// app/services/connect.js
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Connection } from "@solana/web3.js";

let userPublicKey = null;

// Helius RPC URL (anahtar gizli tutulmalı!)
const HELIUS_RPC_URL =
  "https://mainnet.helius-rpc.com/?api-key=6dd0d3e7-cc0a-4464-ae18-2560e9d5da53";

export const connection = new Connection(HELIUS_RPC_URL, "confirmed");

export async function connectWallet() {
  if (!window?.solana?.isPhantom) {
    alert("Phantom cüzdanı bulunamadı!");
    return;
  }

  try {
    // @ts-expect-error – Phantom extension tipleri tarayıcıda tanımlı değil
    const resp = await window.solana.connect();
    userPublicKey = resp.publicKey;
    console.log("Cüzdan bağlandı:", userPublicKey.toBase58());

    const balanceLamports = await connection.getBalance(userPublicKey);
    console.log("SOL Bakiyesi:", balanceLamports / 1e9);
  } catch (err) {
    console.error("Cüzdan bağlantı hatası:", err);
  }
}

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
 * Returns the currently connected public key.
 * First tries the wallet-adapter injected provider (window.solana.publicKey),
 * then falls back to the legacy userPublicKey.
 */
export function getUserPublicKey() {
  return window.solana?.publicKey || userPublicKey;
}
