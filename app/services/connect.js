/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";

let userPublicKey = null;

// Helius RPC URL (anahtar gizli tutulmalı!)
const HELIUS_RPC_URL = "https://mainnet.helius-rpc.com/?api-key=6dd0d3e7-cc0a-4464-ae18-2560e9d5da53";


export const connection = new Connection(HELIUS_RPC_URL, "confirmed");

/**
 * Phantom cüzdanına bağlanma
 * - Bağlandıktan sonra otomatik bakiye sorgulama (opsiyonel)
 */
export async function connectWallet() {
  if (!window?.solana?.isPhantom) {
    alert("Phantom cüzdanı bulunamadı!");
    return;
  }

  try {
    // @ts-ignore
    const resp = await window.solana.connect();
    userPublicKey = resp.publicKey;
    console.log("Cüzdan bağlandı:", userPublicKey.toBase58());

    // Bağlanınca bakiye göstermek istiyorsan (opsiyonel).
    const balanceLamports = await connection.getBalance(userPublicKey);
    console.log("SOL Bakiyesi:", balanceLamports / 1e9);
  } catch (err) {
    console.error("Cüzdan bağlantı hatası:", err);
  }
}

/**
 * Phantom cüzdanından bağlantıyı kesme
 */
export async function disconnectWallet() {
  if (!window?.solana?.isPhantom) {
    console.warn("Phantom cüzdanı bulunamadı!");
    return;
  }
  try {
    await window.solana.disconnect();
    userPublicKey = null;
    console.log("Cüzdan bağlantısı kesildi");
  } catch (err) {
    console.error("Disconnect sırasında hata:", err);
  }
}

/**
 * Kullanıcının PublicKey'ini döndüren yardımcı fonksiyon
 */
export function getUserPublicKey() {
  return userPublicKey;
}
