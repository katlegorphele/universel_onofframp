'use client'

import { createContext, useContext, useState, useEffect } from 'react';

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
  };
  otpCode: string;
  email: string;
  action: 'buy' | 'sell' | 'transfer';
}

interface OnOffRampContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const OnOffRampContext = createContext<OnOffRampContextType>({
  formData: {} as FormData,
  setFormData: () => {},
});

interface OnOffRampProviderProps {
  children: React.ReactNode;
}

export const OnOffRampProvider: React.FC<OnOffRampProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState({
    amount: 0,
    currency: 'ZAR',
    chain: 'Lisk',
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
      console.log(data);
      const rate = data.conversion_rates[formData.currency];
      setFormData((prev) => ({ ...prev, exchangeRate: rate }));
    };

    fetchExchangeRates();
  }, [formData.receiveCurrency, formData.currency]);

  //useEffect to set total fee which is 3% of amount
  useEffect(() => {
    const fee = (formData.amount * 3) / 100;
    setFormData((prev) => ({ ...prev, totalFee: fee }));
  }, [formData.amount]);

  return (
    <OnOffRampContext.Provider value={{ formData, setFormData }}>
      {children}
    </OnOffRampContext.Provider>
  );
};

export const useOnOffRampContext = () => useContext(OnOffRampContext);