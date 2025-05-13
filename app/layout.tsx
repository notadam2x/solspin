// app/layout.tsx
'use client'

import './globals.css'
import Script from 'next/script'
import { FC, ReactNode, useMemo } from 'react'

import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack'
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-coinbase'
import { TrustWalletAdapter } from '@solana/wallet-adapter-trust'
import { BitKeepWalletAdapter } from '@solana/wallet-adapter-bitkeep'
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

import '@solana/wallet-adapter-react-ui/styles.css'

const RPC_ENDPOINT = 'https://mainnet.helius-rpc.com/?api-key=6dd0d3e7-cc0a-4464-ae18-2560e9d5da53'

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TrustWalletAdapter(),
      new BitKeepWalletAdapter(),
      // 📱 WalletConnect desteği
      new WalletConnectWalletAdapter({
        network: WalletAdapterNetwork.Mainnet,
        options: {
          // 👉 Buraya Cloud WalletConnect projenin Project ID’sini yapıştır
          projectId: '33cdb640f0cfab64b1fe48d408c5650f',
          metadata: {
            name: 'Solana Spin',
            description: 'Spin & Claim rewards on Solana',
            // Çalıştığın sitenin origin’ini otomatik alır
            url: typeof window !== 'undefined' ? window.location.origin : '',
            icons: ['https://sol-connect.vercel.app/favicon.ico'],
          },
        },
      }),
    ],
    []
  )

  return (
    <html lang="tr">
      <head>
        <title>Solana Spin</title>
        {/* Telegram Mini-App API */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <ConnectionProvider endpoint={RPC_ENDPOINT}>
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
