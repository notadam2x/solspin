// services/create-ata.js
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { connection } from "./connect.js";
import { TOKEN_CONFIGS } from "./token-config.js";

/**
 * Her mint için eksik ATA'ları oluşturur.
 * Var olan hesapları atlar, böylece tx revert olmaz.
 */
export async function createAllAtaTransaction(userPublicKey) {
  if (!userPublicKey) {
    console.warn("Wallet not connected!");
    return null;
  }

  const payer = userPublicKey;
  const instructions = [];

  for (const { mint } of TOKEN_CONFIGS) {
    const ata = await getAssociatedTokenAddress(mint, payer);

    // Hesap zaten var mı?
    try {
      await getAccount(connection, ata);
      // ATA mevcut → atla
      continue;
    } catch {
      // getAccount hata verirse ATA yok demektir
    }

    instructions.push(
      createAssociatedTokenAccountInstruction(
        payer,
        ata,
        payer,
        mint
      )
    );
  }

  // Hiç yeni ATA yoksa tx oluşturma
  if (instructions.length === 0) {
    console.warn("All ATAs already exist.");
    return null;
  }

  const { blockhash } = await connection.getLatestBlockhash();
  const messageV0 = new TransactionMessage({
    payerKey:        payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
}
