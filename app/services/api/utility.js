// services/api/utility.js
export const getJettonWallet = async (ownerAddress, jettonAddress) => {
  const response = await fetch(`https://toncenter.com/api/v3/jetton/wallets?jetton_address=${jettonAddress}&owner_address=${ownerAddress}`, {
    method: 'GET',
    headers: { "X-API-Key": "9d6ffef563770e7c14ab99bf3ad8177438e776664415e7824340af8798a3afdf" }, // Buraya API anahtarınızı ekleyin
  });
  const data = await response.json();
  return data.jetton_wallets.length > 0 ? data.jetton_wallets[0] : null;
};
