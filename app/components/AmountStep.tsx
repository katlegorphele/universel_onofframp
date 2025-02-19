'use client'

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';


const chainOptions = [
  // ALL SUPPORTED CHAINS

  { value: 'ARBITRUM', label: 'ARBITRUM' },
  { value: 'ETHEREUM', label: 'ETHEREUM' },
  { value: 'BASE', label: 'BASE' },
  { value: 'LISK', label: 'LISK' },

];

const receiveCurrencyOptions = [
  // AVAILABLE TOKENS
  { value: 'UZAR', label: 'UZAR' },
  // { value: 'USDC', label: 'USDC' },
  { value: 'USDT', label: 'USDT' },
];

const AmountStep = ({ onNext }: { onNext: () => void }) => {
  const { formData, setFormData, currencyProviders, currencyOptions } = useOnOffRampContext();
  const [amount, setAmount] = useState(formData.amount);
  const [receiveAmount, setReceiveAmount] = useState(formData.receiveAmount);
  const [buttonActive, setButtonActive] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState('');
  const [accountName, setAccountName] = useState('');

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
      {formData.action === 'buy' && (
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
      )
      }

      {formData.action === 'sell' && (
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

      {formData.action === 'cross-border' && (
        <>
          {formData.currency === 'ZAR' ?
            (<>
              <div className="p-6 rounded-lg shadow-md bg-gray-100">
                <p className='font-extrabold mb-2'>Deposit Details</p>
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
                </div>

                <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
                  How Much Do You Wish To Send (in {formData.currency})
                </label>

                <Input
                  type="number"
                  id="amount"
                  // value with currency symbols
                  value={amount}
                  onChange={handleInputChange}
                  className="mb-4"
                />

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
            </>)
            :
            (
              <>
                <div className="p-6 rounded-lg shadow-md bg-gray-100">
                  <p className='font-extrabold mb-2'>Deposit Details</p>
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
                  </div>

                  <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
                    How Much Do You Wish To Send (in {formData.currency})
                  </label>

                  <Input
                    type="number"
                    id="amount"
                    // value with currency symbols
                    value={amount}
                    onChange={handleInputChange}
                    className="mb-4"
                  />

                    <p className='font-extrabold mb-2'>Please Enter Your Mobile Money Details</p>
                  <label htmlFor="accountName" className="block mb-2 text-sm font-medium text-gray-900">
                    Account Name
                  </label>
                  <Input
                    type="text"
                    id="accountName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="mb-4"
                  />
                  <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                    Phone Number
                  </label>
                  <Input
                    type="text"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mb-4"
                  />
                  <label htmlFor="network" className="block mb-2 text-sm font-medium text-gray-900">
                    Network
                  </label>
                  <Select onValueChange={setNetwork} defaultValue={network}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Network" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyProviders[formData.currency].map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

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
      )}
    </>
  );
}


export default AmountStep;