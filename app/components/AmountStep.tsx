'use client'

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';
import { useSwitchActiveWalletChain } from 'thirdweb/react';
import { defineChain } from 'thirdweb';


const AmountStep = ({ onNext }: { onNext: () => void }) => {
  const { formData, setFormData, currencyProviders, currencyOptions, chainOptions, receiveCurrencyOptions, bankCodes } = useOnOffRampContext();
  const [amount, setAmount] = useState(formData.amount);
  const [receiveAmount, setReceiveAmount] = useState(formData.receiveAmount);
  const [buttonActive, setButtonActive] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState(formData.mobileWallet.network);
  const [accountName, setAccountName] = useState(formData.mobileWallet.accountName);
  const [fullname, setFullname] = useState(formData.bankDetails.fullname);
  const [crossBorderSender, setCrossBorderSender] = useState('ZAR')
  const [crossBorderSendAmount, setCrossBorderSendAmount] = useState(0)
  const [address, setAddress] = useState(formData.bankDetails.address);
  const [accountNumber, setAccountNumber] = useState(formData.bankDetails.accountNumber);

  const wallet = useSwitchActiveWalletChain();


  // useEffect(() => {
  //   if (formData.exchangeRate && amount > 0 && formData.action == 'buy') {
  //     setReceiveAmount(amount / formData.exchangeRate);
  //   } else {
  //     setReceiveAmount(amount * formData.exchangeRate);
  //   }
  // }, [amount, formData.exchangeRate, formData.action]);

  useEffect(() => {
    const fetchMainExchangeRate = async () => {
      if (formData.action === 'cross-border') return;
  
      let baseCurrency = formData.receiveCurrency === 'UZAR' ? 'ZAR' : 'USD';
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`
      );
      const data = await response.json();
      const rate = data.conversion_rates[formData.currency] || 0;
  
      setFormData(prev => ({
        ...prev,
        exchangeRate: rate,
      }));
    };
  
    fetchMainExchangeRate();
  }, [formData.currency, formData.receiveCurrency, formData.action]);

  useEffect(() => {
    switch (formData.chain) {
      case 'ARBITRUM':
        wallet(defineChain(42161));
        break;
      case 'ETHEREUM':
        wallet(defineChain(1));
        break;
      case 'BASE':
        wallet(defineChain(8453));
        break;
      case 'LISK':
        wallet(defineChain(1135));
        break;
      default:
        wallet(defineChain(42161));
    }
  }, [formData.chain, wallet])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
    setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }));
  };

  const handleCrossBorderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCrossBorderSendAmount(Number(e.target.value));
    setFormData((prev) => ({ ...prev, crossBorder: { ...prev.crossBorder, sendAmount: Number(e.target.value) } }));
    console.log('Cross Border Sender Amount', crossBorderSendAmount)

  };

  const handleSubmit = () => {
    if (receiveAmount >= 25) {
      setFormData((prev) => ({
        ...prev,
        receiveAmount,
      }));
      onNext();
    } else {
      alert('Minimum Value of 25 UZAR')
    }
  };

  useEffect(() => {
    if (receiveAmount > 0 && amount > 0) {
      setButtonActive(true)
    } else {
      setButtonActive(false)
    }
  }, [receiveAmount, amount])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,

      crossBorder: {
        sendCurrency: crossBorderSender,
        receiveCurrency: '',
        sendAmount: crossBorderSendAmount,
        receiveAmount: 0,
        exchangeRate: formData.exchangeRate,
        totalFee: 0,
        senderDetails: {},
        recieverDetails: {},
      },
      mobileWallet: {
        phoneNumber,
        network,
        accountName
      },
      bankDetails: {
        fullname,
        phoneNumber,
        paymentMethod: '',
        bankCode: '',
        address,
        accountNumber,
        country: ''
      },
    }));
  }, [setFormData, crossBorderSender, accountName, address, bankCodes, formData.exchangeRate, fullname, network, phoneNumber, receiveAmount, amount, crossBorderSendAmount, accountNumber]);

  const getCrossBorderExchangeRate = async (from: string, to: string): Promise<number> => {
    if (!from || !to) return 0;
    
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${from}/${to}`
      );
      const data = await response.json();
      return data.conversion_rate || 0;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return 0;
    }
  };

  // Add these useEffects to handle cross-border calculations
useEffect(() => {
  // Fetch cross-border exchange rate when currencies change
  const fetchCrossBorderRate = async () => {
    const rate = await getCrossBorderExchangeRate(
      formData.crossBorder.sendCurrency,
      formData.crossBorder.receiveCurrency
    );
    
    setFormData(prev => ({
      ...prev,
      crossBorder: {
        ...prev.crossBorder,
        exchangeRate: rate || 0,
      },
    }));
  };

  if (formData.crossBorder.sendCurrency && formData.crossBorder.receiveCurrency) {
    fetchCrossBorderRate();
  }
}, [formData.crossBorder.sendCurrency, formData.crossBorder.receiveCurrency]);

useEffect(() => {
  // Calculate cross-border fee and receive amount when send amount changes
  if (!formData.crossBorder.sendAmount) return;

  const fee = (formData.crossBorder.sendAmount * 3) / 100;
  const receiveAmount = formData.crossBorder.exchangeRate
    ? (formData.crossBorder.sendAmount - fee) * formData.crossBorder.exchangeRate
    : 0;

  setFormData(prev => ({
    ...prev,
    crossBorder: {
      ...prev.crossBorder,
      totalFee: fee,
      receiveAmount: receiveAmount,
    },
  }));
}, [
  formData.crossBorder.sendAmount,
  formData.crossBorder.exchangeRate,
  formData.crossBorder.sendCurrency,
  formData.crossBorder.receiveCurrency,
]);



  return (
    <>
      {formData.action === 'buy' && (
        <>
          {/* Fields for Buying */}
          <div className="p-6 flex flex-col sm:w-full">

            {/* <h2 className="text-xl font-bold mb-4">Step 1: Enter Amount</h2> */}
            <div className='flex flex-col gap-2 md:gap-10 md:flex-row justify-items-between'>
              <div className='flex flex-col flex-nowrap md:w-1/3'>
                <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900">
                  Currency
                </label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))} defaultValue={formData.currency} >
                  <SelectTrigger className='bg-white font-extrabold'>
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='md:w-1/3'>
                <label htmlFor="chain" className="block mb-2 text-sm font-medium text-gray-900">
                  Chain
                </label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, chain: value }))} defaultValue={formData.chain}>
                  <SelectTrigger className='bg-white font-extrabold'>
                    <SelectValue placeholder="Select Chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {chainOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='md:w-1/3'>
                <label htmlFor="receiveCurrency" className="block mb-2 text-sm font-medium text-gray-900 justify-end">
                  Token
                </label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, receiveCurrency: value }))} defaultValue={formData.receiveCurrency}>
                  <SelectTrigger className='bg-white font-extrabold '>
                    <SelectValue placeholder="Select Token" />
                  </SelectTrigger>
                  <SelectContent>
                    {receiveCurrencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
              Enter Payment Amount (in {formData.currency})
            </label>

            <Input
              type="number"
              id="amount"
              pattern="[0-9]*"
              // value with currency symbols

              onChange={handleInputChange}
              className="md:mb-4 bg-white font-extrabold"
            />

            <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
              You Recieve (in {formData.receiveCurrency})
            </label>
            <Input
              type="number"
              id="receiveAmount"
              value={amount > 0 ? Number((receiveAmount).toFixed(2)) : 0}
              readOnly
              className="mb-4 bg-white font-extrabold"
              disabled={true}
            />
            <p className='font-semibold text-sm'>1 {formData.receiveCurrency} = {Number((formData.exchangeRate).toFixed(2))} {formData.currency}</p>
            {/* disabled if the amount is 0 */}

            <div className='mt-2'>
              <Button disabled={!buttonActive} onClick={handleSubmit} className="mt-4 m-auto">
                Next
              </Button>
            </div>
            <div className='flex justify-center mt-2'>
              _______________________________
            </div>

            <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
              Transaction Fee (3%): <span className='font-light'>{(Number((amount).toFixed(2)) * (3 / 100)).toFixed(2)} {formData.currency}</span>
            </label>

          </div>
        </>
      )}

      {formData.action === 'sell' && (
        <>
          {/* Fields for selling */}
          <div className=' p-6 w-full' >
            {/* <h2 className="text-xl font-bold mb-4">Step 1: Enter Amount</h2> */}
            <div className='flex flex-col gap-2 md:gap-10 md:flex-row justify-items-between'>
              <div className='flex flex-col flex-nowrap md:w-1/3 '>
                <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900 md:w-1/3">
                  Currency
                </label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))} defaultValue={formData.currency}>
                  <SelectTrigger className='bg-white font-extrabold'>
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='md:w-1/3'>
                <label htmlFor="chain" className="block mb-2 text-sm font-medium text-gray-900">
                  Chain
                </label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, chain: value }))} defaultValue={formData.chain}>
                  <SelectTrigger className='bg-white font-extrabold'>
                    <SelectValue placeholder="Select Chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {chainOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='md:w-1/3'>
                <label htmlFor="receiveCurrency" className="block mb-2 text-sm font-medium text-gray-900">
                  Token
                </label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, receiveCurrency: value }))} defaultValue={formData.receiveCurrency}>
                  <SelectTrigger className='bg-white font-extrabold'>
                    <SelectValue placeholder="Select Receive Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {receiveCurrencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
              {formData.currency !== '' ? `Enter Amount to Sell (in ${formData.receiveCurrency})` : 'Enter Amount to Sell'}
            </label>

            <Input
              type="number"
              id="amount"
              // value with currency symbols
              // value={amount}
              onChange={handleInputChange}
              className="mb-4 bg-white font-extrabold"
            />

            <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
              You Recieve (in {formData.currency})
            </label>
            <Input
              type="number"
              id="receiveAmount"
              value={amount > 0 ? Number((receiveAmount).toFixed(2)) : 0}
              readOnly
              className="mb-4 bg-white font-extrabold"
              disabled={true}
            />
            <p className='font-semibold text-sm'>1 {formData.receiveCurrency} = {Number((formData.exchangeRate).toFixed(2))} {formData.currency}</p>
            {/* disabled if the amount is 0 */}

            <Button disabled={!buttonActive} onClick={handleSubmit} className="mt-4">
              Next
            </Button>
            <div className='flex justify-center mt-2'>
              _______________________________
            </div>

            <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
              Transaction Fee (1%): <span className='font-light'>{(Number((amount).toFixed(2)) * (1 / 100)).toFixed(2)} {formData.currency}</span>
            </label>

          </div>
        </>
      )}

      {formData.action === 'cross-border' && (
        <>
          <div className=' p-6 w-full' >
            <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900">
              You Send:
            </label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  crossBorder: {
                    ...prev.crossBorder,
                    sendCurrency: value,
                  },
                }))
              }
              defaultValue={formData.crossBorder.receiveCurrency}>
              {/* <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))} defaultValue={formData.currency} ></Select> */}
              <SelectTrigger className='bg-white font-extrabold'>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900">
              Send Amount
            </label>

            <Input
              type="number"
              id="amount"
              pattern="[0-9]*"
              onChange={handleCrossBorderInputChange}
              className="md:mb-4 bg-white font-extrabold"
            />

            <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900">
              They Receive
            </label>

            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  crossBorder: {
                    ...prev.crossBorder,
                    receiveCurrency: value,
                  },
                }))
              }
              defaultValue={formData.crossBorder.receiveCurrency}>
              {/* <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))} defaultValue={formData.currency} ></Select> */}
              <SelectTrigger className='bg-white font-extrabold'>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900">
              Receive Amount
            </label>

            <Input
              type="number"
              id="amount"
              pattern="[0-9]*"
              disabled={true}
              // onChange={handleCrossBorderInputChange}
              className="md:mb-4 bg-white font-extrabold"
            />

          </div>

          
        </>
      )}
    </>
  );
}
export default AmountStep;