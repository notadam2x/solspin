// app/_client/ClientProviders.tsx
'use client';

import { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Adapterlar
import { PhantomWalletAdapter  } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-coinbase';
import { TrustWalletAdapter    } from '@solana/wallet-adapter-trust';
import { BitKeepWalletAdapter  } from '@solana/wallet-adapter-bitkeep';

// Not: Bu global CSS dosyası modal stilleri için gerekir.
// Global CSS normalde layout'ta import edilir. Eğer layout'ta yoksa buraya EKLEME!
import '@solana/wallet-adapter-react-ui/styles.css';

const RPC =
  process.env.NEXT_PUBLIC_HELIUS_RPC ||
  'https://mainnet.helius-rpc.com/?api-key=6dd0d3e7-cc0a-4464-ae18-2560e9d5da53';

const ClientProviders: FC<{ children: ReactNode }> = ({ children }) => {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TrustWalletAdapter(),
      new BitKeepWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default ClientProviders;
