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
      const response = await fetch('https://v6.exchangerate-api.com/v6/6c2c521a02e3eb57efa066fa/latest/ZAR');
      const data = await response.json();
      setFormData((prev) => ({ ...prev, exchangeRate: data.conversion_rates.KES }));
    };

    fetchExchangeRates();
  }, []);

  return (
    <OnOffRampContext.Provider value={{ formData, setFormData }}>
      {children}
    </OnOffRampContext.Provider>
  );
};

export const useOnOffRampContext = () => useContext(OnOffRampContext);