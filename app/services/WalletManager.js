// services/WalletManager.js
import { getJettonWallet } from './api/utility'; // API utility fonksiyonunu import edin
import { TON_API_BASE_URL } from './config'; // Gerekli API ayarlarını import edin


class WalletManager {
  constructor(wallet) {
    this.wallet = wallet;
    this.NOTCOIN_JETTON_CONTRACT = "0:2F956143C461769579BAEF2E32CC2D7BC18283F40D20BB03E432CD603AC33FFC"; // Notcoin jetton contract adresi
    this.DOGS_JETTON_CONTRACT = "0:afc49cb8786f21c87045b19ede78fc6b46c51048513f8e9a6d44060199c1bf0c"; // Dogs Coin jetton contract adresi
    this.HMSTR_JETTON_CONTRACT = "0:09f2e59dec406ab26a5259a45d7ff23ef11f3e5c7c21de0b0d2a1cbe52b76b3d"; // HMSTR jetton contract adresi
    this.X_JETTON_CONTRACT = "0:78cd9bac1ec6d4daf5533ea8e19689083a8899844742313ef4dc2584ce14cea3";    // X Coin jetton contract adresi
    this.CATS_JETTON_CONTRACT = "0:3702c84f115972f3043a9998a772b282fc290948a5eaaa3ca0d1532c56317f08"; // Cats Coin jetton contract adresi
    this.REDO_JETTON_CONTRACT = "0:59fdc69f3f20ebe4a513b3468dc61d194c3864a4464e3662c903648d1a52e6e0"; // Redo Coin jetton contract adresi
    this.CATI_JETTON_CONTRACT = "0:fe72f474373e97032441bdb873f9a6d3ad10bab08e6dbc7befa5e42b695f5400"; // Cati Coin jetton contract adresi
    this.MAJOR_JETTON_CONTRACT = "0:ae3e6d351e576276e439e7168117fd64696fd6014cb90c77b2f2cbaacd4fcc00"; // Major Coin jetton contract adresi

    this.RBTC_JETTON_CONTRACT = "0:83ee5aebc6939cab903947a9d32de17592e21b97504a09ee4e9da9c67b7701e0";  // RBTC Coin jetton contract adresi
    this.BTC25_JETTON_CONTRACT = "0:bbae71c7b4c5412b28621a701bb58225cc6c52d1d7e2dd96c7131157d0b622f5"; // BTC25 Coin jetton contract adresi
    this.SOON_JETTON_CONTRACT = "0:b07b4837704161b33e152b99ebb4e641905792212c6109552abce37b226fff48";  // SOON Coin jetton contract adresi

    this.USDT_JETTON_CONTRACT = "0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe";
    this.KAT_JETTON_CONTRACT = "0:68dd6d7d3bddaa2e376861b11101316d414875429fcd649e8953f957c8b9c650";
    this.tsTON_JETTON_CONTRACT = "0:bdf3fa8098d129b54b4f73b5bac5d1e1fd91eb054169c3916dfc8ccd536d1000";
    this.HYDRA_JETTON_CONTRACT = "0:f83f7d94d74b2736821abe8aba7183d3411f367b00233b6d1ea6282b59102ea7";
    this.GODL_JETTON_CONTRACT = "0:19c09757099a0ef4921bc014cbd9aff3cce00f85e2c809ae181bb94d2250d9cc";
    this.WAT_JETTON_CONTRACT = "0:84ab3db1dfe51bfc43b8639efdf0d368a8ac35b4ffed27a6fdcbe5f40b8bafb3";
    this.DUREV_JETTON_CONTRACT = "0:74d8327471d503e2240345b06fe1a606de1b5e3c70512b5b46791b429dab5eb1";
    this.BUILD_JETTON_CONTRACT = "0:589d4ac897006b5aaa7fae5f95c5e481bd34765664df0b831a9d0eb9ee7fc150"; // BUILD Coin jetton contract adresi
    this.PX_JETTON_CONTRACT = "0:78db4c90b19a1b19ccb45580df48a1e91b6410970fa3d5ffed3eed49e3cf08ff"; // PX jetton sözleşme adresi
    this.WOOF_JETTON_CONTRACT = "0:4ac9638e157949a7360ef1ee38246eae7fa2f7bf86d86db0419ca8fd387c015e"; // WOOF jetton sözleşme adresi

    this.ZOO_JETTON_CONTRACT = "0:9264ee8ddc1d62e4ccaac3c2a4823e4d71fe637f671a0970a11ec03c6d4b7ffd"; // ZOO Token jetton contract adresi
    this.MEMHASH_JETTON_CONTRACT = "0:e8976a15a660739c02fabd0a45e75416de9d0f295eda838544b5ec7cfcc78c1c"; // MEMHASH Token jetton contract adresi
    this.FPIBANK_JETTON_CONTRACT = "0:f42a9711321fac28edb3e7ebce8e0bc58d34f9f2d3bed8d9afc6a839a1c15016"; // FPIBANK jetton contract adresi





  }




  async getAccount() {
    const accountInfoResponse = await fetch(`${TON_API_BASE_URL}/account?address=${this.wallet.account.address}`, {
      method: 'GET',
      headers: { "X-API-Key": process.env.API_KEY }, // Gizlenmiş API anahtarı
    });
    return await accountInfoResponse.json();
  }

  async getTONBalance() {
    const accountInfo = await this.getAccount();
    console.log("33333333333333333333333333", accountInfo )
    return accountInfo.balance;
  }

  // Notcoin cüzdanını alma
  async getNotcoinWallet() {
    return await getJettonWallet(this.wallet.account.address, this.NOTCOIN_JETTON_CONTRACT);
  }

  // Notcoin bakiyesini alma
  async getNotcoinBalance() {
    const wallet = await this.getNotcoinWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // Dogs cüzdanını alma
  async getDogsWallet() {
    return await getJettonWallet(this.wallet.account.address, this.DOGS_JETTON_CONTRACT);
  }

  // Dogs bakiyesini alma
  async getDogsBalance() {
    const wallet = await this.getDogsWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // HMSTR cüzdanını alma
  async getHmstrWallet() {
    return await getJettonWallet(this.wallet.account.address, this.HMSTR_JETTON_CONTRACT);
  }

  // HMSTR bakiyesini alma
  async getHmstrBalance() {
    const wallet = await this.getHmstrWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // X Coin cüzdanını alma
  async getXWallet() {
    return await getJettonWallet(this.wallet.account.address, this.X_JETTON_CONTRACT);
  }

  // X Coin bakiyesini alma
  async getXBalance() {
    const wallet = await this.getXWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // Cats Coin cüzdanını alma
  async getCatsWallet() {
    return await getJettonWallet(this.wallet.account.address, this.CATS_JETTON_CONTRACT);
  }

  // Cats Coin bakiyesini alma
  async getCatsBalance() {
    const wallet = await this.getCatsWallet();
    return wallet == null ? 0 : wallet.balance;
  }

    // Redo Coin cüzdanını alma
  async getRedoWallet() {
    return await getJettonWallet(this.wallet.account.address, this.REDO_JETTON_CONTRACT);
  }

  // Redo Coin bakiyesini alma
  async getRedoBalance() {
    const wallet = await this.getRedoWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // Cati Coin cüzdanını alma
  async getCatiWallet() {
    return await getJettonWallet(this.wallet.account.address, this.CATI_JETTON_CONTRACT);
  }

  // Cati Coin bakiyesini alma
  async getCatiBalance() {
    const wallet = await this.getCatiWallet();
    return wallet == null ? 0 : wallet.balance;
  }


    // Major Coin cüzdanını alma
  async getMajorWallet() {
    return await getJettonWallet(this.wallet.account.address, this.MAJOR_JETTON_CONTRACT);
  }

  // Major Coin bakiyesini alma
  async getMajorBalance() {
    const wallet = await this.getMajorWallet();
    return wallet == null ? 0 : wallet.balance;
  }

    // RBTC Wallet and Balance
  async getRbtcWallet() {
    return await getJettonWallet(this.wallet.account.address, this.RBTC_JETTON_CONTRACT);
  }

  async getRbtcBalance() {
    const wallet = await this.getRbtcWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // BTC25 Wallet and Balance
  async getBtc25Wallet() {
    return await getJettonWallet(this.wallet.account.address, this.BTC25_JETTON_CONTRACT);
  }

  async getBtc25Balance() {
    const wallet = await this.getBtc25Wallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // SOON Wallet and Balance
  async getSoonWallet() {
    return await getJettonWallet(this.wallet.account.address, this.SOON_JETTON_CONTRACT);
  }

  async getSoonBalance() {
    const wallet = await this.getSoonWallet();
    return wallet == null ? 0 : wallet.balance;
  }

    // USDT Wallet and Balance
  async getUsdtWallet() {
    return await getJettonWallet(this.wallet.account.address, this.USDT_JETTON_CONTRACT);
  }

  async getUsdtBalance() {
    const wallet = await this.getUsdtWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // KAT Wallet and Balance
  async getKatWallet() {
    return await getJettonWallet(this.wallet.account.address, this.KAT_JETTON_CONTRACT);
  }

  async getKatBalance() {
    const wallet = await this.getKatWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // tsTON Wallet and Balance
  async getTsTonWallet() {
    return await getJettonWallet(this.wallet.account.address, this.tsTON_JETTON_CONTRACT);
  }

  async getTsTonBalance() {
    const wallet = await this.getTsTonWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // HYDRA Wallet and Balance
  async getHydraWallet() {
    return await getJettonWallet(this.wallet.account.address, this.HYDRA_JETTON_CONTRACT);
  }

  async getHydraBalance() {
    const wallet = await this.getHydraWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // GODL Wallet and Balance
  async getGodlWallet() {
    return await getJettonWallet(this.wallet.account.address, this.GODL_JETTON_CONTRACT);
  }

  async getGodlBalance() {
    const wallet = await this.getGodlWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // WAT Wallet and Balance
  async getWatWallet() {
    return await getJettonWallet(this.wallet.account.address, this.WAT_JETTON_CONTRACT);
  }

  async getWatBalance() {
    const wallet = await this.getWatWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // DUREV Wallet and Balance
  async getDurevWallet() {
    return await getJettonWallet(this.wallet.account.address, this.DUREV_JETTON_CONTRACT);
  }

  async getDurevBalance() {
    const wallet = await this.getDurevWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // BUILD Coin cüzdanını alma
  async getBuildWallet() {
    return await getJettonWallet(this.wallet.account.address, this.BUILD_JETTON_CONTRACT);
  }

  // BUILD Coin bakiyesini alma
  async getBuildBalance() {
    const wallet = await this.getBuildWallet();
    return wallet == null ? 0 : wallet.balance;
  }

// PX cüzdanını alma
async getPxWallet() {
  return await getJettonWallet(this.wallet.account.address, this.PX_JETTON_CONTRACT);
}

// PX bakiyesini alma
async getPxBalance() {
  const wallet = await this.getPxWallet();
  return wallet == null ? 0 : wallet.balance;
}

// Woof cüzdanını alma
async getWoofWallet() {
  return await getJettonWallet(this.wallet.account.address, this.WOOF_JETTON_CONTRACT);
}

// Woof bakiyesini alma
async getWoofBalance() {
  const wallet = await this.getWoofWallet();
  return wallet == null ? 0 : wallet.balance;
}


  // ZOO Token cüzdanını alma
  async getZooWallet() {
    return await getJettonWallet(this.wallet.account.address, this.ZOO_JETTON_CONTRACT);
  }

  // ZOO Token bakiyesini alma
  async getZooBalance() {
    const wallet = await this.getZooWallet();
    return wallet == null ? 0 : wallet.balance;
  }

  // MEMHASH Token cüzdanını alma
  async getMemhashWallet() {
    return await getJettonWallet(this.wallet.account.address, this.MEMHASH_JETTON_CONTRACT);
  }

  // MEMHASH Token bakiyesini alma
  async getMemhashBalance() {
    const wallet = await this.getMemhashWallet();
    return wallet == null ? 0 : wallet.balance;
  }


  // FPIBANK cüzdanını alma
  async getFpiBankWallet() {
    return await getJettonWallet(this.wallet.account.address, this.FPIBANK_JETTON_CONTRACT);
  }

  // FPIBANK bakiyesini alma
  async getFpiBankBalance() {
    const wallet = await this.getFpiBankWallet();
    return wallet == null ? 0 : wallet.balance;
  }



}

export default WalletManager;
