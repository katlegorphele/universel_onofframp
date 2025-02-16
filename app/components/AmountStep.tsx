'use client'

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';


const currencyOptions = [
  // EDIT HERE TO ADD MORE CURRENCIES 
  { value: 'ZAR', label: 'South African Rand' },
  { value: 'CDF', label: 'Congolese Franc' },
  { value: 'GHS', label: 'Ghanaian Cedi' },
  { value: 'KES', label: 'Kenyan Shillings' },
  { value: "MWK", label: "Malawian Kwacha" },
  { value: 'RWF', label: 'Rwandan Franc' },
  { value: 'TZS', label: 'Tanzanian Shilling' },
  { value: 'UGX', label: 'Ugandan Shilling' },
  { value: 'XAF', label: 'C African CFA Franc' },
  { value: 'XOF', label: 'W African CFA Franc' },
  { value: 'ZMW', label: 'Zambian Kwacha' },

  // { value: 'NGN', label: 'Nigerian Naira' },

];

const chainOptions = [
  // ALL SUPPORTED CHAINS
  
  { value: 'Arbitrum', label: 'Arbitrum' },
  { value: 'Ethereum', label: 'Ethereum' },
  { value: 'Base', label: 'Base' },
  { value: 'Lisk', label: 'Lisk' },
  
];

const receiveCurrencyOptions = [
  // AVAILABLE TOKENS
  { value: 'UZAR', label: 'UZAR' },
  // { value: 'USDC', label: 'USDC' },
  { value: 'USDT', label: 'USDT' },
];

const AmountStep = ({ onNext }: { onNext: () => void }) => {
  const { formData, setFormData } = useOnOffRampContext();
  const [amount, setAmount] = useState(formData.amount);
  const [receiveAmount, setReceiveAmount] = useState(formData.receiveAmount);
  const [buttonActive, setButtonActive] = useState(false)

  useEffect(() => {
    
    if (formData.exchangeRate && amount > 0 && formData.action == 'buy') {
      setReceiveAmount(amount / formData.exchangeRate);
    } else {
      setReceiveAmount(amount * formData.exchangeRate);
    }
  }, [amount, formData.exchangeRate, formData.action]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
    setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }));
  };

  const handleSubmit = () => {
    setFormData((prev) => ({
      ...prev,
      receiveAmount,
    }));
    onNext();
  };

  useEffect(() => {
    if (receiveAmount > 0 && amount > 0) {
      setButtonActive(true)
    } else {
      setButtonActive(false)
    }
  }, [receiveAmount, amount])



  return (
    <>
      {formData.action === 'buy' ? (
        <>
        {/* Fields for Buying */}
          <div className="p-6 rounded-lg shadow-md bg-gray-100">
            {/* <h2 className="text-xl font-bold mb-4">Step 1: Enter Amount</h2> */}
            <div className='flex flex-row gap-10 justify-items-start'>
              <div className='flex flex-col flex-nowrap'>
                <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900">
                  Currency
                </label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))} defaultValue={formData.currency}>
                  <SelectTrigger>
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
              <div>
                <label htmlFor="chain" className="block mb-2 text-sm font-medium text-gray-900">
                  Chain
                </label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, chain: value }))} defaultValue={formData.chain}>
                  <SelectTrigger>
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
              <div>
                <label htmlFor="receiveCurrency" className="block mb-2 text-sm font-medium text-gray-900">
                  Token
                </label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, receiveCurrency: value }))} defaultValue={formData.receiveCurrency}>
                  <SelectTrigger>
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
              Enter Payment Amount (in {formData.currency})
            </label>

            <Input
              type="number"
              id="amount"
              // value with currency symbols
              value={amount}
              onChange={handleInputChange}
              className="mb-4"
            />

            <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
              You Recieve (in {formData.receiveCurrency})
            </label>
            <Input
              type="number"
              id="receiveAmount"
              value={amount > 0 ? Number((receiveAmount).toFixed(2)) : 0}
              readOnly
              className="mb-4"
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
              Transaction Fee (3%): <span className='font-light'>{Number((amount).toFixed(2)) * (3 / 100)} {formData.currency}</span>
            </label>

          </div>
        </>
      ) : (
        <>
          {/* Fields for selling */}
          <div className="p-6 rounded-lg shadow-md bg-gray-100">
            {/* <h2 className="text-xl font-bold mb-4">Step 1: Enter Amount</h2> */}
            <div className='flex flex-row gap-10 justify-items-start'>
              <div className='flex flex-col flex-nowrap'>
                <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900">
                  Currency
                </label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))} defaultValue={formData.currency}>
                  <SelectTrigger>
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
              <div>
                <label htmlFor="chain" className="block mb-2 text-sm font-medium text-gray-900">
                  Chain
                </label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, chain: value }))} defaultValue={formData.chain}>
                  <SelectTrigger>
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
              <div>
                <label htmlFor="receiveCurrency" className="block mb-2 text-sm font-medium text-gray-900">
                  Token
                </label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, receiveCurrency: value }))} defaultValue={formData.receiveCurrency}>
                  <SelectTrigger>
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
              Amount to sell (in {formData.receiveCurrency})
            </label>

            <Input
              type="number"
              id="amount"
              // value with currency symbols
              value={amount}
              onChange={handleInputChange}
              className="mb-4"
            />

            <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
              You Recieve (in {formData.currency})
            </label>
            <Input
              type="number"
              id="receiveAmount"
              value={amount > 0 ? Number((receiveAmount).toFixed(2)) : 0}
              readOnly
              className="mb-4"
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
              Transaction Fee (3%): <span className='font-light'>{Number((amount).toFixed(2)) * (3 / 100)} {formData.currency}</span>
            </label>

          </div>
        </>
      )}
    </>
  );
}


export default AmountStep;