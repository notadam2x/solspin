// services/create-ata.js
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { connection } from "./connect.js";
import { TOKEN_CONFIGS } from "./token-config.js";

/**
 * userPublicKey cüzdanına, TOKEN_CONFIGS'ta tanımlı her mint için
 * Associated Token Account (ATA) yaratma instruction’ları ekler.
 * @param {PublicKey} userPublicKey — ATA’ları yaratacak cüzdan
 * @returns {VersionedTransaction|null}
 */
export async function createAllAtaTransaction(userPublicKey) {
  if (!userPublicKey) {
    console.warn("Wallet not connected!");
    return null;
  }

  const payer = userPublicKey;
  const instructions = [];

  // Her mint için alıcı ATA hesabı adresini hesapla ve oluşturma instruction'ı ekle
  for (const { mint } of TOKEN_CONFIGS) {
    const ata = await getAssociatedTokenAddress(mint, payer);
    instructions.push(
      createAssociatedTokenAccountInstruction(
        payer,   // fee payer
        ata,     // ATA hesabı adresi
        payer,   // owner = sizin cüzdan
        mint     // mint adresi
      )
    );
  }

  // Son blockhash’i al ve VersionedTransaction oluştur
  const { blockhash } = await connection.getLatestBlockhash();
  const messageV0 = new TransactionMessage({
    payerKey:        payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
}
