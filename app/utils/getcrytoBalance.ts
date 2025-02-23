import { defineChain, getContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { thirdwebClient } from "../config/client";
import { useOnOffRampContext } from "../context/OnOffRampContext";
import { getBalance } from "thirdweb/extensions/erc20";

// const account = useActiveAccount()

export const checkUserCryptoBalance = async () => {
    const { formData, uzarContract } = useOnOffRampContext();
    const account = useActiveAccount()

    
    try {

      if (!account?.address || !formData.chain || !formData.receiveCurrency) {
        alert('Please ensure your wallet is connected, a network is selected, and a token is chosen.');
        return;
      }

      const isValidCombination = validateTokenNetwork(formData.receiveCurrency, formData.chain);
      if (!isValidCombination) {
        console.log('Invalid combination');
        return; // Exit early if the combination is invalid
      }

      // Get the token address based on the selected chain and token
      const tokenAddress = getTokenAddress(formData.receiveCurrency, formData.chain);

      // Check if the token address is valid
      if (!tokenAddress) {
        alert('Invalid token address for the selected network.');
        return;
      }

      const contract = await getDynamicContract(tokenAddress, formData.chain);

      const balance = await getBalance({contract, address:account.address})
      alert('new alert')

    //   const formattedBalance = parseFloat(balance.toString()) / 10 ** getDecimals(formData.receiveCurrency);

    // console.log(`User ${formData.receiveCurrency} balance:`, formattedBalance.toFixed(2));
    // alert(`Your ${formData.receiveCurrency} balance is: ${formattedBalance.toFixed(2)}`);

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  }

  // helper functions

  interface TokenDecimals {
    [key: string]: number;
  }

  const getDecimals = (token: string): number => {
    const tokenDecimals: TokenDecimals = {
      USDT: 6, // USDT has 6 decimals
      UZAR: 18, // 18 Decimals
    };
  
    return tokenDecimals[token] || 18; // Default to 18 decimals if unknown
  };

  const getDynamicContract = async (contractAddress:string, chain:string) => {
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

  interface ChainIds {
    [key: string]: number;
  }

  const getChainId = (chain: string): number | null => {
    const chainIds: ChainIds = {
      ethereum: 1, // Ethereum Mainnet
      base: 8453,  // Base Mainnet
      arbitrum: 42161, // Arbitrum One
      lisk: 1135, // Lisk Mainnet
    };

    return chainIds[chain] || null;
  };

  const validateTokenNetwork = (token: string, chain: string) => {
    if (token === 'UZAR' && chain !== 'LISK') {
      alert('UZAR is only available on the Lisk network. Please switch to Lisk.');
      return false;
    }

    if (token === 'USDT' && chain === 'LISK') {
        alert('USDT is not available on the Lisk network. Please switch to another network.');
        return false;
      }
    return true;
  };

  interface TokenAddresses {
    [key: string]: {
      [key: string]: string;
    };
  }

  const getTokenAddress = (token: string, chain: string): string | null => {
    const tokenAddresses: TokenAddresses = {
      USDT: {
        ETHEREUM: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT on Ethereum
        BASE: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',    // USDT on Base
        ARBITRUM: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT on Arbitrum
      },
      UZAR: {
        LISK: '0x427271F417A4807b67840FC68d42b1Caabf775eB', // Replace with actual UZAR address on Lisk
      },
    };

    // Return the token address for the selected chain and token
    return tokenAddresses[token]?.[chain] || null;
  };