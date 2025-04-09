'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { defineChain, getContract} from "thirdweb";
import { thirdwebClient } from '../config/client';
import { networkConfig } from "../config/networkConfig";
const { chainId, uZarContractAddress, rampContractAddress } = networkConfig;

const uzarContract = getContract({
  client: thirdwebClient,
  chain: defineChain(chainId),
  address: uZarContractAddress,

});


const transactionContract = getContract({
  client: thirdwebClient,
  chain: defineChain(chainId),
  address: rampContractAddress,
});

// Static data moved to app/config/formOptions.ts

interface FormData {
  amount: number;
  currency: string;
  chain: string;
  receiveCurrency: string;
  receiveAmount: number;
  exchangeRate: number;
  totalFee: number;
  walletAddress: string;
  mobileWallet: {
    phoneNumber: string;
    network: string;
    accountName: string;
  };
  bankDetails: {
    fullname: string;
    phoneNumber: string;
    paymentMethod: string;
    bankCode: string;
    address: string;
    accountNumber: string;
    country: string;
  };
  crossBorder: {
    sendCurrency: string;
    receiveCurrency: string;
    sendAmount: number;
    receiveAmount: number;
    exchangeRate: number;
    totalFee: number;
    senderDetails: object;
    recieverDetails: object;
    senderPaymentMethod: string;
    recieverPaymentMethod: string;
  }
  otpCode: string;
  email: string;
  action: 'buy' | 'sell' | 'transfer' | 'cross-border';
}

interface OnOffRampContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  uzarContract: typeof uzarContract;
  transactionContract: typeof transactionContract;
  // Static data types removed
}

// Define a default state object matching the FormData interface
const defaultFormData: FormData = {
  amount: 0,
  currency: 'ZAR',
  chain: 'LISK',
  receiveCurrency: 'UZAR',
  receiveAmount: 0,
  exchangeRate: 0,
  totalFee: 0,
  walletAddress: '',
  mobileWallet: {
    phoneNumber: '',
    network: '',
    accountName: ''
  },
  bankDetails: {
    fullname: '',
    phoneNumber: '',
    paymentMethod: '',
    bankCode: '',
    address: '',
    accountNumber: '',
    country: ''
  },
  crossBorder: {
    sendCurrency: '',
    receiveCurrency: '',
    sendAmount: 0,
    receiveAmount: 0,
    exchangeRate: 0,
    totalFee: 0,
    senderDetails: {},
    recieverDetails: {},
    senderPaymentMethod: '',
    recieverPaymentMethod: '',
  },
  otpCode: '',
  email: '',
  action: 'buy',
};


const OnOffRampContext = createContext<OnOffRampContextType>({
  formData: defaultFormData, // Use the default object
  setFormData: () => {},
  uzarContract,
  transactionContract,
  // Static data removed from default context value
});

interface OnOffRampProviderProps {
  children: React.ReactNode;
}

export const OnOffRampProvider: React.FC<OnOffRampProviderProps> = ({ children }) => {

  const [formData, setFormData] = useState<FormData>(defaultFormData); // Use default state and type


  useEffect(() => {
    const fetchExchangeRates = async () => {
      // Use environment variable for API key
      const apiKey = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY;
      if (!apiKey) {
        console.error("NEXT_PUBLIC_EXCHANGERATE_API_KEY environment variable is missing.");
        return; // Don't proceed if key is missing
      }
      // Ensure currency is set before fetching
      if (!formData.currency) {
        return;
      }

      let url = '';
      // Determine API endpoint based on receiveCurrency
      if (formData.receiveCurrency === 'UZAR') {
        url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/ZAR`;
      } else {
        // Assuming other tokens are pegged to USD or require USD rate
        url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          // Throw an error for bad responses (4xx, 5xx)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Check for API-specific errors
        if (data.result === 'error') {
           throw new Error(`API error: ${data['error-type']}`);
        }
        // Ensure the target currency exists in the rates
        if (data.conversion_rates && data.conversion_rates[formData.currency]) {
          const rate = data.conversion_rates[formData.currency];
          setFormData((prev) => ({ ...prev, exchangeRate: rate }));
        } else {
          console.warn(`Currency ${formData.currency} not found in exchange rates.`);
          setFormData((prev) => ({ ...prev, exchangeRate: 0 })); // Reset or handle appropriately
        }
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
        setFormData((prev) => ({ ...prev, exchangeRate: 0 })); // Reset rate on error
        // Optionally, set a user-facing error state here
      }
    };

    fetchExchangeRates();
    // Dependency array includes currencies that affect the API call or rate lookup
  }, [formData.receiveCurrency, formData.currency]);

  useEffect(() => {
    const fetchCrossBorderExchangeRates = async () => {
       // Use environment variable for API key
      const apiKey = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY;
      if (!apiKey) {
        console.error("NEXT_PUBLIC_EXCHANGERATE_API_KEY environment variable is missing.");
        return; // Don't proceed if key is missing
      }
      // Ensure both send and receive currencies are set
      if (!formData.crossBorder.sendCurrency || !formData.crossBorder.receiveCurrency) {
          console.warn("Cross-border currencies not fully selected.");
          return; // Don't fetch if currencies are missing
      }

      const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${formData.crossBorder.sendCurrency}`;

      try {
        const response = await fetch(url);
         if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
         if (data.result === 'error') {
           throw new Error(`API error: ${data['error-type']}`);
        }
        // Ensure the target currency exists
        if (data.conversion_rates && data.conversion_rates[formData.crossBorder.receiveCurrency]) {
          const rate = data.conversion_rates[formData.crossBorder.receiveCurrency];
          setFormData((prev) => ({ ...prev, crossBorder: { ...prev.crossBorder, exchangeRate: rate } }));
        } else {
           console.warn(`Currency ${formData.crossBorder.receiveCurrency} not found in cross-border rates for ${formData.crossBorder.sendCurrency}.`);
           setFormData((prev) => ({ ...prev, crossBorder: { ...prev.crossBorder, exchangeRate: 0 } }));
        }
      } catch (error) {
         console.error("Failed to fetch cross-border exchange rates:", error);
         setFormData((prev) => ({ ...prev, crossBorder: { ...prev.crossBorder, exchangeRate: 0 } }));
         // Optionally set an error state here
         
      }
    }

    // Trigger only when relevant cross-border fields change and amount is positive
    if (formData.crossBorder.sendCurrency && formData.crossBorder.receiveCurrency && formData.crossBorder.sendAmount > 0) {
      fetchCrossBorderExchangeRates();
    } else {
      // Reset rate if conditions aren't met
       setFormData((prev) => ({ ...prev, crossBorder: { ...prev.crossBorder, exchangeRate: 0 } }));
    }
    // Dependencies that trigger the cross-border rate fetch
  }, [formData.crossBorder.sendCurrency, formData.crossBorder.receiveCurrency, formData.crossBorder.sendAmount]);


  //useEffect to calculate cross-border receive amount
  useEffect(() => {
    // Ensure exchange rate is a valid positive number before calculating
    if (typeof formData.crossBorder.exchangeRate === 'number' && formData.crossBorder.exchangeRate > 0) {
       const crossBorderReceiveAmount = formData.crossBorder.sendAmount * formData.crossBorder.exchangeRate;
       // Round to a reasonable number of decimal places if necessary
       setFormData((prev) => ({ ...prev, crossBorder: { ...prev.crossBorder, receiveAmount: crossBorderReceiveAmount } }));
    } else {
       // Reset receive amount if rate is invalid or zero
       setFormData((prev) => ({ ...prev, crossBorder: { ...prev.crossBorder, receiveAmount: 0 } }));
    }
  }
  // Depend on the values used in the calculation
  , [formData.crossBorder.sendAmount, formData.crossBorder.exchangeRate]);

  //useEffect to calculate the general total fee (3% of amount)
  useEffect(() => {
    // Ensure amount is a valid positive number
    if (typeof formData.amount === 'number' && formData.amount >= 0) {
      const fee = (formData.amount * 3) / 100;
      setFormData((prev) => ({ ...prev, totalFee: fee }));
    } else {
      // Reset fee if amount is invalid
      setFormData((prev) => ({ ...prev, totalFee: 0 }));
    }
  }, [formData.amount]); // Only depends on the main amount


  return (
    <OnOffRampContext.Provider value={{
      formData,
      setFormData,
      uzarContract,
      transactionContract,
      // Static data removed from provider value
      }}>
      {children}
    </OnOffRampContext.Provider>
  );
};

export const useOnOffRampContext = () => useContext(OnOffRampContext);
