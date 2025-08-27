// app/layout.tsx
'use client'

import './globals.css'
import Script from 'next/script'
import { FC, ReactNode, useMemo } from 'react'

import "./assets/2idql.css";
import "./assets/connect.css";

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider }                from '@solana/wallet-adapter-react-ui'

import { PhantomWalletAdapter   } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter  } from '@solana/wallet-adapter-solflare'
import { BackpackWalletAdapter  } from '@solana/wallet-adapter-backpack'
import { CoinbaseWalletAdapter  } from '@solana/wallet-adapter-coinbase'
import { TrustWalletAdapter     } from '@solana/wallet-adapter-trust'
import { BitKeepWalletAdapter   } from '@solana/wallet-adapter-bitkeep'

import '@solana/wallet-adapter-react-ui/styles.css'

const RPC = 'https://mainnet.helius-rpc.com/?api-key=6dd0d3e7-cc0a-4464-ae18-2560e9d5da53'

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
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
  )

  return (
    <html lang="en" className="dark">
      <head>
        <title>Secure Connect</title>
        {/* Telegram Mini-App API */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <ConnectionProvider endpoint={RPC}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  )
}

export default RootLayout
