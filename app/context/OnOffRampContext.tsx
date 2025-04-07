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

const currencyProviders: { [key: string]: string[] } = {
  KES: ['MPESA'],
  GHS: ['MTN', 'VODAFONE'],
  ZMW: ['MTN', 'AIRTEL',],
  XOF: ['MTN', 'ORANGE'],
  XAF: ['MTN', 'ORANGE'],
  CDF: ['AIRTEL', 'ORANGE'],
  TZS: ['AIRTEL', 'TIGO'],
  MWK: ['AIRTEL', 'TNM'],
  UGX: ['MTN'],
  RWF: ['MTN', 'AIRTEL'],
  ZAR: ['BANK'],
};

const bankCodes = [
  // Banks
  { value: '6320', label: 'ABSA' },
  { value: '4300', label: 'African Bank'},
  { value: '4620', label: 'BidVest Bank'},
  { value: '4700', label: 'Capitec' },
  { value: '4701', label: 'Capitec Business Bank'},
  { value: '6799', label: 'Discovery Bank'},
  { value: '2500', label: 'FNB' },
  { value: '5800', label: 'Investec Bank Limited' },
  { value: '1987', label: 'Nedbank' },
  { value: '5100', label: 'Standard Bank' },
  { value: '6789', label: 'TymeBank' },
];

const currencyOptions = [
  // EDIT HERE TO ADD MORE CURRENCIES 
  { value: 'ZAR', label: 'South African Rand (ZAR)' },
  { value: 'CDF', label: 'Congolese Franc (CFD)' },
  { value: 'GHS', label: 'Ghanaian Cedi (GHS)' },
  { value: 'KES', label: 'Kenyan Shillings (KES)' },
  { value: "MWK", label: "Malawian Kwacha ()" },
  { value: 'RWF', label: 'Rwandan Franc (RWF)' },
  { value: 'TZS', label: 'Tanzanian Shilling (TZS)' },
  { value: 'UGX', label: 'Ugandan Shilling (UGX)' },
  { value: 'XAF', label: 'C African CFA Franc (XAF)' },
  { value: 'XOF', label: 'W African CFA Franc (XOF)' },
  { value: 'ZMW', label: 'Zambian Kwacha (ZMW)' },
  // { value: 'NGN', label: 'Nigerian Naira' },
];

const chainOptions = [
  // ALL SUPPORTED CHAINS

  { value: 'ARBITRUM', label: 'ARBITRUM' },
  // { value: 'ETHEREUM', label: 'ETHEREUM' },
  { value: 'BASE', label: 'BASE' },
  { value: 'LISK', label: 'LISK' },

];

const receiveCurrencyOptions = [
  // AVAILABLE TOKENS
  { value: 'UZAR', label: 'UZAR' },
  { value: 'USDC', label: 'USDC' },
  // { value: 'USDT', label: 'USDT' },
];

const paymentMethodsZAR = ['CARD', 'BANK'];
const paymentMethodsZARforSelling = ['E-WALLET / CASH SEND', 'BANK TRANSFER'];


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
    senderDetails: {};
    recieverDetails: {};
    paymentMethod: string;
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
  currencyProviders : typeof currencyProviders;
  bankCodes: typeof bankCodes;
  currencyOptions: typeof currencyOptions;
  chainOptions: typeof chainOptions;
  receiveCurrencyOptions: typeof receiveCurrencyOptions;
  paymentMethodsZAR: typeof paymentMethodsZAR;
  paymentMethodsZARforSelling: typeof paymentMethodsZARforSelling

}

const OnOffRampContext = createContext<OnOffRampContextType>({
  formData: {} as FormData,
  setFormData: () => {},
  uzarContract,
  transactionContract,
  currencyProviders,
  bankCodes,
  currencyOptions,
  chainOptions,
  receiveCurrencyOptions,
  paymentMethodsZAR,
  paymentMethodsZARforSelling
});

interface OnOffRampProviderProps {
  children: React.ReactNode;
}

export const OnOffRampProvider: React.FC<OnOffRampProviderProps> = ({ children }) => {
  
  const [formData, setFormData] = useState({
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
      paymentMethod: ''
    },
    otpCode: '',
    email: '',
    action: 'buy',

  } as FormData);
  

  useEffect(() => {
    const fetchExchangeRates = async () => {
      let url = '';
      if (formData.receiveCurrency === 'UZAR') {
        url = 'https://v6.exchangerate-api.com/v6/6c2c521a02e3eb57efa066fa/latest/ZAR';
      } else {
        url = 'https://v6.exchangerate-api.com/v6/6c2c521a02e3eb57efa066fa/latest/USD';
      }
      const response = await fetch(url);
      const data = await response.json();
      const rate = data.conversion_rates[formData.currency];
      setFormData((prev) => ({ ...prev, exchangeRate: rate }));
    };

    fetchExchangeRates();
  }, [formData.receiveCurrency, formData.currency, formData.crossBorder.sendCurrency]);

  useEffect(() => {
    const fetchCrossBorderExchangeRates = async () => {
      let url = `https://v6.exchangerate-api.com/v6/6c2c521a02e3eb57efa066fa/latest/${formData.crossBorder.sendCurrency}`;
      const response = await fetch(url);
      console.log('Response:', response);
      const data = await response.json();
      const rate = data.conversion_rates[formData.crossBorder.receiveCurrency];
      setFormData((prev) => ({ ...prev, crossBorder: { ...prev.crossBorder, exchangeRate: rate } }));
    }

    if (formData.crossBorder.receiveCurrency !== '' && formData.crossBorder.sendAmount > 0) {
      fetchCrossBorderExchangeRates();
    }

  }, [formData.crossBorder.sendCurrency, formData.crossBorder.exchangeRate, formData.crossBorder.receiveCurrency, formData.crossBorder.sendAmount]);


  //useEffect to set receive amount which is amount * exchange rate
  useEffect(() => {
    const crossBorderReceiveAmount = formData.crossBorder.sendAmount * formData.crossBorder.exchangeRate;
    console.log('Cross Border Receive Amount:', crossBorderReceiveAmount);
    setFormData((prev) => ({ ...prev, crossBorder: { ...prev.crossBorder, receiveAmount: crossBorderReceiveAmount } }));
  }
  , [formData.crossBorder.receiveCurrency]);

  //useEffect to set total fee which is 3% of amount
  useEffect(() => {
    const fee = (formData.amount * 3) / 100;
    setFormData((prev) => ({ ...prev, totalFee: fee }));
    
  }, [formData.amount]);

  return (
    <OnOffRampContext.Provider value={{ 
      formData, 
      setFormData, 
      uzarContract, 
      transactionContract, 
      currencyProviders,
      bankCodes, 
      currencyOptions,
      chainOptions,
      receiveCurrencyOptions,
      paymentMethodsZAR,
      paymentMethodsZARforSelling
      }}>
      {children}
    </OnOffRampContext.Provider>
  );
};

export const useOnOffRampContext = () => useContext(OnOffRampContext);