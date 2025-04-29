'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useState, Fragment } from 'react'
import { Transition } from '@headlessui/react'     // 7 KB, animasyon için

export default function ConnectDrawer({ onConnected }: { onConnected: () => void }) {
  const { wallets, select } = useWallet()
  const [open, setOpen] = useState(false)

  const dapp = typeof window !== 'undefined' ? window.location.origin : ''

  const deepLinks: Record<string, string> = {
    Phantom:  `https://phantom.app/ul/browse/${encodeURIComponent(dapp)}?ref=${encodeURIComponent(dapp)}`,
    Solflare: `https://solflare.com/access?app_url=${encodeURIComponent(dapp)}`,
    Backpack: 'https://www.backpack.app/',
    Coinbase: 'https://www.coinbase.com/wallet',
    Trust:    'https://trustwallet.com/',
    BitKeep:  'https://bitkeep.com/en',
  }

  const handle = async (w: any) => {
    setOpen(false)

    if (w.readyState === 'Installed') {
      await select(w.adapter.name)
      onConnected()
    } else {
      window.open(deepLinks[w.adapter.name] ?? w.url, '_blank')
    }
  }

  /* Trigger butonu dışarıya children ile bırakacağız */
  return (
    <>
      {/* görünmez trigger'a ref gerekmez; dışarıdan onClick ile açacağız */}
      <Transition show={open} as={Fragment}>
        {/* overlay */}
        <Transition.Child
          as="div"
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-60"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-60"
          leaveTo="opacity-0"
          className="fixed inset-0 bg-black"
          onClick={() => setOpen(false)}
        />

        {/* sheet */}
        <Transition.Child
          as="div"
          enter="transition-transform duration-300"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transition-transform duration-300"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
          className="fixed inset-x-0 bottom-0 max-h-[80vh] bg-[#101014] rounded-t-3xl
                     shadow-2xl flex flex-col"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* kulakçık */}
          <div className="h-1.5 w-12 bg-gray-600 rounded-full mx-auto mt-3" />
          <h2 className="text-center text-lg font-semibold py-4 text-white">
            Connect Wallet
          </h2>

          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
            {wallets.map((w) => (
              <button
                key={w.adapter.name}
                onClick={() => handle(w)}
                className="w-full flex items-center gap-3 px-4 py-3
                           rounded-xl bg-[#1b1b20] hover:bg-[#2a2a30]
                           text-white"
              >
                <img src={w.adapter.icon} alt="" className="h-7 w-7" />
                <span className="font-medium">{w.adapter.name}</span>
              </button>
            ))}
          </div>

          <p className="text-center pb-safe pb-4 text-sm text-gray-400">
            Cüzdanın yok mu?{' '}
            <a
              href="https://solana.com/wallets"
              target="_blank"
              className="underline"
            >
              Hemen edin
            </a>
          </p>
        </Transition.Child>
      </Transition>
    </>
  )
}

/*  Dışarıdan kullanmak için – sheet'i aç */
export const useDrawerController = () => {
  const [, setToggle] = useState(false)
  return {
    open: () => setToggle((x) => !x), // sadece referans değişsin yeter
  }
}
