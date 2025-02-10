'use client'

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';
import { Value } from '@radix-ui/react-select';


const currencyOptions = [
  // EDIT HERE TO ADD MORE CURRENCIES 
  { value: 'ZAR', label: 'South African Rand' },
  { value: 'KES', label: 'Kenyan Shillings' },
  { value: 'GHS', label: 'Ghanaian Cedi' },
  { value: 'ZMW', label: 'Zambian Kwacha' },
  { value: 'XOF', label: 'W African CFA Franc' },
  { value: 'XAF', label: 'C African CFA Franc' },
  { value: 'CDF', label: 'Congolese Franc' },
  { value: 'TZS', label: 'Tanzanian Shilling' },
  { value: "MWK", label: "Malawian Kwacha" },
  { value: 'UGX', label: 'Ugandan Shilling' },
  { value: 'RWF', label: 'Rwandan Franc' },

  // { value: 'NGN', label: 'Nigerian Naira' },

];

const chainOptions = [
  // ALL SUPPORTED CHAINS
  { value: 'Celo', label: 'Celo' },
  { value: 'Lisk', label: 'Lisk' },
  { value: 'Ethereum', label: 'Ethereum' },
];

const receiveCurrencyOptions = [
  // AVAILABLE TOKENS
  { value: 'UZAR', label: 'UZAR' },
  { value: 'USDC', label: 'USDC' },
  { value: 'USDT', label: 'USDT' },
];

const AmountStep = ({ onNext }: { onNext: () => void }) => {
  const { formData, setFormData } = useOnOffRampContext();
  const [amount, setAmount] = useState(formData.amount);
  const [receiveAmount, setReceiveAmount] = useState(formData.receiveAmount);

  useEffect(() => {
    if (formData.exchangeRate && amount > 0) {
      setReceiveAmount(amount / formData.exchangeRate);
    }
  }, [amount, formData.exchangeRate]);

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

  

  return (
    <div className="">
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
        // VALUE IS 0 by default id the amount is 0
        value={Number((receiveAmount).toFixed(2))}
        readOnly
        className="mb-4"
        disabled={true}
      />
      <p className='font-semibold text-sm'>1 {formData.receiveCurrency} = {Number((formData.exchangeRate).toFixed(2))} {formData.currency}</p>
      <Button onClick={handleSubmit} className="mt-4">
        Next
      </Button>
      <div className='flex justify-center mt-2'>
        _______________________________
      </div>

      <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
        Total to Pay
      </label>
      <Input
        type="number"
        id="feeAmount"
        // VALUE IS 0 by default id the amount is 0
        value={(Number((amount).toFixed(2)) * 0.03) + amount}
        readOnly
        className="mb-4"
        disabled={true}
      />
    </div>
  );
}

export default AmountStep;