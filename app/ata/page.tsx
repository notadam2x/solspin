// app/ata/page.tsx
'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import type { WalletName } from '@solana/wallet-adapter-base';
import { createAllAtaTransaction } from '../services/create-ata';
import { connection } from '../services/connect';

export default function AtaPage(): JSX.Element {
  const { publicKey, wallets, select, connect, sendTransaction, connected } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleConnect = async (): Promise<void> => {
    setMessage(null);
    try {
      // Phantom varsa onu seç, yoksa ilk adapter
      const phantom = wallets.find((w) => w.adapter.name === 'Phantom');
      if (phantom) {
        select(phantom.adapter.name as WalletName);
      } else if (wallets.length > 0) {
        select(wallets[0].adapter.name as WalletName);
      } else {
        throw new Error('No wallet adapters available');
      }

      await connect();
      setMessage('Wallet connected');
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setMessage(`Error connecting wallet: ${err.message}`);
      } else {
        setMessage('Unknown error connecting wallet');
      }
    }
  };

  const handleCreateAta = async (): Promise<void> => {
    if (!publicKey) {
      setMessage('No wallet connected.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const tx = await createAllAtaTransaction(publicKey);
      if (!tx) throw new Error('Failed to create transaction.');

      const signature = await sendTransaction(tx, connection);
      setMessage(`All ATAs created. Signature: ${signature}`);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setMessage(`Error: ${err.message}`);
      } else {
        setMessage('Unknown error');
      }
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
