// app/ata/page.tsx
'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createAllAtaTransaction } from '../services/create-ata';
import { connection } from '../services/connect';

export default function AtaPage() {
  // select: hangi cüzdan adapter'ı kullanılacağını seçmek için
  const { publicKey, wallets, select, connect, sendTransaction, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleConnect = async () => {
    setMessage(null);
    try {
      // 1) Eğer Phantom adapter varsa onu seç, yoksa ilk adapter'ı seç
      const phantom = wallets.find((w) => w.adapter.name === 'Phantom');
      if (phantom) {
        select('Phantom');
      } else if (wallets.length > 0) {
        select(wallets[0].adapter.name);
      } else {
        throw new Error('No wallet adapters found');
      }

      // 2) Seçili adapter ile bağlantıyı başlat
      await connect();
      setMessage('Wallet connected');
    } catch (err: any) {
      console.error(err);
      setMessage(`Error connecting wallet: ${err.message}`);
    }
  };

  const handleCreateAta = async () => {
    if (!publicKey) {
      setMessage('No wallet connected.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // ATA transaction'ını oluştur
      const tx = await createAllAtaTransaction(publicKey);
      if (!tx) throw new Error('Failed to create transaction.');

      // İmzala ve gönder
      const signature = await sendTransaction(tx, connection);
      setMessage(`All ATAs created. Signature: ${signature}`);
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50">
      {!connected ? (
        <button
          onClick={handleConnect}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={handleCreateAta}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
        >
          {loading ? 'Creating ATAs…' : 'Create All ATAs'}
        </button>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
}
