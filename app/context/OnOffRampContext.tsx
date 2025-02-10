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
    currency: 'KES',
    chain: 'Celo',
    receiveCurrency: 'USDC',
    receiveAmount: 0,
    exchangeRate: 0,
    totalFee: 0,
    walletAddress: '',

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

  return (
    <OnOffRampContext.Provider value={{ formData, setFormData }}>
      {children}
    </OnOffRampContext.Provider>
  );
};

export const useOnOffRampContext = () => useContext(OnOffRampContext);