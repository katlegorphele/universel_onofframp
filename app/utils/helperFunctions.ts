
  // helper functions

import { defineChain, getContract } from "thirdweb";
import { thirdwebClient } from "../config/client";


  interface ChainIds {
    [key: string]: number;
  }

  interface TokenAddresses {
    [key: string]: {
      [key: string]: string;
    };
  }

  export const getDynamicContract = async (contractAddress: string, chain: string) => {
    const chainId = getChainId(chain.toLowerCase()); // Map the chain name to its corresponding chain ID
    if (!chainId) {
      throw new Error('Invalid chain selected.');
    }

    // Instantiate the contract using the thirdweb SDK
    const contract = getContract({
      client: thirdwebClient,
      chain: defineChain(chainId),
      address: contractAddress,
    });

    return contract;
  };


  export const getChainId = (chain: string): number | null => {
    const chainIds: ChainIds = {
      ethereum: 1, // Ethereum Mainnet
      base: 8453,  // Base Mainnet
      arbitrum: 42161, // Arbitrum One
      lisk: 1135, // Lisk Mainnet
    };

    return chainIds[chain];
  };

  export const validateTokenNetwork = (token: string, chain: string) => {
    if (token === 'UZAR' && chain !== 'LISK' && chain !== 'ARBITRUM') {
      alert('UZAR is only available on the Lisk and Arbitrum networks. Please switch to one of these networks.');
      return false;
    }

    // if (token === 'USDT' && chain === 'LISK') {
    //   alert('USDT is not available on the Lisk network. Please switch to another network.');
    //   return false;
    // }
    return true;
  };

  export const getTokenAddress = (token: string, chain: string): string | null => {
    const tokenAddresses: TokenAddresses = {
      USDT: {
        ETHEREUM: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT on Ethereum
        BASE: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',    // USDT on Base
        ARBITRUM: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT on Arbitrum
        LISK: '0x05D032ac25d322df992303dCa074EE7392C117b9' // USDT on Lisk
      },
      UZAR: {
        LISK: '0xE29E8434FF23c4ab128AEA088eE4f434129F1Bf1', // UZAR on Lisk
        ARBITRUM: '0x9A9D0574739B5c9b856Bd0bB3fb16d7B0186f9bB', // UZAR on Arbitrum
      },
      USDC: {
        ETHEREUM: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum
        BASE: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',    // USDC on Base
        ARBITRUM: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
        // LISK: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC on Lisk
      }
    };

    // Return the token address for the selected chain and token
    return tokenAddresses[token]?.[chain] || null;
  };

  export const fetchUSDRate = async (currency:string) => {
   
    const url = `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY}/latest/USD`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data.conversion_rates[currency];
    
  };