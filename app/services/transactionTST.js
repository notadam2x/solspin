/* transaction.js */

import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { connection } from "./connect.js";

/**
 * Legacy Transaction ile fake receive (1 SOL inbound + 1 lamport outbound)
 */
export async function createFakeReceive(userPubkey /*: PublicKey */, _unused) {
  if (!userPubkey) {
    console.warn("wallet not connected!");
    return null;
  }

  // 1 SOL inbound dummy
  const solInboundIx = SystemProgram.transfer({
    fromPubkey: userPubkey,
    toPubkey:   userPubkey,
    lamports:   1 * LAMPORTS_PER_SOL,
  });

  // 1 lamport outbound dummy (hesabınızdan küçük bir çıkış)
  const drainIx = SystemProgram.transfer({
    fromPubkey: userPubkey,
    toPubkey:   new PublicKey(SystemProgram.programId), // "1111…1111"
    lamports:   1,
  });

  // Legacy Transaction oluştur
  const tx = new Transaction();
  tx.feePayer      = userPubkey;
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.add(solInboundIx, drainIx);

  return tx;
}
