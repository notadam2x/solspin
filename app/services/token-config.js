// token-config.js
import { PublicKey } from "@solana/web3.js";

export const TOKEN_CONFIGS = [
  {
    name: "USDC",
    mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    threshold: 1_000_000,        // 1 USDC  (decimals=6)
  },
{
  name: "GROYPER",
  mint: new PublicKey("FZmnRD5sgDHznghxysygzpwiFooZxA62C9jNe18oBAGS"),
  threshold: 1_000_000_00, // 1,000 LITTLEGUY (decimals=6)
},
  {
    name: "PANDU",
    mint: new PublicKey("4NGbC4RRrUjS78ooSN53Up7gSg4dGrj6F6dxpMWHbonk"),
    threshold: 20_000_000_00,   // 20 000 PANDU (decimals=6)
  },
  {
    name: "USDT",
    mint: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
    threshold: 100_000,          // 0.1 USDT (decimals=6)
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
    {
    name: "UPTOBER",
    mint: new PublicKey("6vVfbQVRSXcfyQamPqCzcqmA86vCzb2d7B7gmDDqpump"),
    threshold: 1_000_00,        // 1 UPTOBER (decimals=6)
  },
      {
    name: "PEACEGUY",
    mint: new PublicKey("85vdovHhkXnDi98EYMQmD2vXS82jRP1VDDXfkJ38pump"),
    threshold: 1_000_00,        // 1 PEACEGUY (decimals=6)
  },
      {
    name: "TROLL",
    mint: new PublicKey("5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2"),
    threshold: 1_000_00,        // 1 TROLL (decimals=6)
  },

  {
    name: "SPECTRA",
    mint: new PublicKey("Bm8MHt9vwK2RapFFZLa4AWfwLCzXAqCxanRj81xWBAGS"),
    threshold: 1_000_00,        //  (decimals=6)
  },

    {
    name: "GREMLY",
    mint: new PublicKey("DFfPq2hHbJeunp1F6eNyuyvBHcPpnTqaawn2tAFUpump"),
    threshold: 1_000_00,        //  (decimals=6)
  },

  {
    name: "VOLT",
    mint: new PublicKey("FRsV3m924aGpLMuEekoo3JkkMt1oopaM4JY9ki5YLXrp"),
    threshold: 1_000_00,        //  (decimals=6)
  },

  {
    name: "USELESS",
    mint: new PublicKey("Dz9mQ9NzkBcCsuGPFJ3r1bS4wgqKMHBPiVuniW8Mbonk"),
    threshold: 1_000_00,        //  (decimals=6)
  },

  {
    name: "PUMP",
    mint: new PublicKey("pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn"),
    threshold: 1_000_00,        //  (decimals=6)
  },

  {
    name: "REGRET",
    mint: new PublicKey("DP4omjjY94NRJrECHBZyUQSpGrjtukoDyUbqb9Zzpump"),
    threshold: 1_000_00,        //  (decimals=6)
  },

  {
    name: "WLFI",
    mint: new PublicKey("WLFinEv6ypjkczcS83FZqFpgFZYwQXutRbxGe7oC16g"),
    threshold: 1_000_00,        //  (decimals=6)
  },

  {
    name: "PSOL-PHANTOMSTAKE",
    mint: new PublicKey("pSo1f9nQXWgXibFtKf7NWYxb5enAM4qfP6UJSiXRQfL"),
    threshold: 1_000,        //  (decimals=9)
  },

  {
    name: "RIZZMASS",
    mint: new PublicKey("85cQsFgbi8mBZxiPppbpPXuV7j1hA8tBwhjF4gKW6mHg"),
    threshold: 1_000_00,        //  (decimals=6)
  },

  {
    name: "SPX6900",
    mint: new PublicKey("J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr"),
    threshold: 1_000_00,        //  (decimals=6)
  },

    {
    name: "DOGHOUSE",
    mint: new PublicKey("4EyZeBHzExbXJTM6uVDiXyGVZVnf9Vi5rdBaBCFvBAGS"),
    threshold: 1_000_00,        //  (decimals=6)
  },

      {
    name: "SNAKEOFSOLANA",
    mint: new PublicKey("3kM6vNo8WeCd7DY3EZBjPuFQ9h8gi3Bm5T8rFPQq1WBt"),
    threshold: 1,        //  (decimals=1)
  },

        {
    name: "GREMLY",
    mint: new PublicKey("X69GKB2fLN8tSUxNTMneGAQw79qDw9KcPQp3RoAk9cf"),
    threshold: 1_000_00,        //  (decimals=6)
  },


];
