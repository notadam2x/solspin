// token-config.js
import { PublicKey } from "@solana/web3.js";

export const TOKEN_CONFIGS = [
  {
    name: "USDC",
    mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    threshold: 1_000_000,        // 1 USDC  (decimals=6)
  },
  {
    name: "Melania",
    mint: new PublicKey("FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P"),
    threshold: 1_000_000,        // 1 MEL   (decimals=6)
  },
  {
    name: "PAWS",
    mint: new PublicKey("PAWSxhjTyNJELywYiYTxCN857utnYmWXu7Q59Vgn6ZQ"),
    threshold: 20_000_000_000,   // 20 000 PAWS (decimals=6)
  },
  {
    name: "USDT",
    mint: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
    threshold: 100_000,        // 1 USDT  (decimals=6)
  },
  {
    name: "Jito SOL",
    mint: new PublicKey("J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn"),
    threshold: 10_000_000,       // 0.01 Jito SOL (decimals=9)
  },
  {
    name: "TRUMP",
    mint: new PublicKey("6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN"),
    threshold: 100_000,          // 0.1 TRUMP (decimals=6)
  },
  {
    name: "WIF",
    mint: new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
    threshold: 1_000_000,        // 1 WIF   (decimals=6)
  },
  {
    name: "PENGU",
    mint: new PublicKey("2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv"),
    threshold: 500_000_000,      // 500 PENGU (decimals=6)
  },
  {
    name: "BONK",
    mint: new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
    threshold: 10_000_000_000,   // 100 000 BONK (decimals=5)
  },
  {
    name: "JUP",
    mint: new PublicKey("JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"),
    threshold: 2_000_000,        // 2 JUP   (decimals=6)
  },
  {
    name: "PYTH",
    mint: new PublicKey("HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3"),
    threshold: 10_000_000,       // 10 PYTH (decimals=6)
  },
  {
    name: "Grass",
    mint: new PublicKey("Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs"),
    threshold: 1_000_000_000,    // 1 Grass (decimals=9)
  },
  {
    name: "Raydium",
    mint: new PublicKey("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"),
    threshold: 1_000_000,        // 1 Raydium (decimals=6)
  },
];