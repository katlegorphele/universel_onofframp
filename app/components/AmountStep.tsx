'use client'

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';
import { useSwitchActiveWalletChain } from 'thirdweb/react';
import { defineChain } from 'thirdweb';
// Import static data
import {
  currencyProviders,
  currencyOptions,
  chainOptions,
  receiveCurrencyOptions,
  // bankCodes // Not used in this component currently, uncomment if needed
} from '../config/formOptions';

// Define type for option objects used in Select components
interface SelectOption {
  value: string;
  label: string;
}

const AmountStep = ({ onNext }: { onNext: () => void }) => {
  // Remove static data from context destructuring
  const { formData, setFormData } = useOnOffRampContext();
  const [amount, setAmount] = useState(formData.amount);
  const [receiveAmount, setReceiveAmount] = useState(formData.receiveAmount);
  const [buttonActive, setButtonActive] = useState(false)
  const [crossBorderSender, setCrossBorderSender] = useState('ZAR')
  const [crossBorderReciever, setCrossBorderReciever] = useState('')
  const [crossBorderSendAmount, setCrossBorderSendAmount] = useState(0)
  const [crossBorderReceiveAmount, setCrossBorderReceiveAmount] = useState(0)


  const wallet = useSwitchActiveWalletChain();

  // useEffect(() => {
  //   console.log('FORM DATA', formData)
  //   if (formData.action == 'cross-border') {
  //     if (
  //       formData.crossBorder.sendCurrency == '' ||
  //       formData.crossBorder.senderPaymentMethod == '' ||
  //       formData.crossBorder.recieverPaymentMethod == '' ||
  //       formData.crossBorder.receiveCurrency == '' ||
  //       formData.crossBorder.sendAmount <= 0 ||
  //       formData.crossBorder.receiveAmount <= 0 
  //     ) {
  //       setButtonActive(false)
  //     } else {
  //       setButtonActive(true)
  //     }
  //   }

  //   if (formData.action == 'sell') {
  //     if (
  //       formData.currency == '' ||
  //       formData.chain == '' ||
  //       formData.receiveCurrency == '' ||
  //       amount <= 0 ||
  //       receiveAmount <= 0
  //     ) {
  //       setButtonActive(false)
  //     } else {
  //       setButtonActive(true)
  //     }
  //   }
  //   if (formData.action == 'buy') {
  //     if (
  //       formData.currency == '' ||
  //       formData.chain == '' ||
  //       formData.receiveCurrency == '' ||
  //       amount <= 0 ||
  //       receiveAmount <= 0
  //     ) {
  //       setButtonActive(false)
  //     }
  //     else {
  //       setButtonActive(true)
  //     }
  //   }
  // }, [formData, amount, receiveAmount, crossBorderSender, crossBorderReciever, crossBorderSendAmount, crossBorderReceiveAmount]);

  useEffect(() => {
    // if (formData.action == 'cross-border') {
    //   if (
    //     formData.crossBorder.sendCurrency == '' ||
    //     formData.crossBorder.senderPaymentMethod == '' ||
    //     formData.crossBorder.recieverPaymentMethod == '' ||
    //     formData.crossBorder.receiveCurrency == '' ||
    //     formData.crossBorder.sendAmount <= 0 ||
    //     formData.crossBorder.receiveAmount <= 0
    //   ) {
    //     setButtonActive(false)
    //   } else {
    //     setButtonActive(true)
    //   }
    // }

    if (formData.action == 'buy') {
      if (
        formData.currency == '' ||
        formData.chain == '' ||
        formData.receiveCurrency == '' ||
        amount <= 0 ||
        receiveAmount <= 0
      ) {
        setButtonActive(false)
      } else {
        setButtonActive(true)
      }
    }

    if (formData.action == 'sell') {
      if (
        formData.currency == '' ||
        formData.chain == '' ||
        formData.receiveCurrency == '' ||
        amount <= 0 ||
        receiveAmount <= 0
      ) {
        setButtonActive(false)
      } else {
        setButtonActive(true)
      }
    }
  })

  useEffect(() => {
    if (formData.exchangeRate && amount > 0 && formData.action == 'buy') {
      setFormData((prev) => ({
        ...prev,
        receiveAmount: amount / formData.exchangeRate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        receiveAmount: amount * formData.exchangeRate,
      }));
    }
  }, [amount, formData.exchangeRate, formData.action]);


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

  };

  const handleSubmit = () => {
    if (formData.action == 'sell') {
      if (receiveAmount >= 25) {
        setFormData((prev) => ({
          ...prev,  
          receiveAmount: Number((receiveAmount).toFixed(2)),
        }));
        onNext();
      } else {
        alert('Minimum Value of 25 UZAR')
      }
    }

    if (formData.action == 'cross-border') {
      if (crossBorderSendAmount > 0) {
        onNext();
      } else {
        alert('Please enter all details')
      }
    }

    if (formData.action == 'buy') {
      if (amount > 0 && receiveAmount > 0) {
        onNext();

      } else {
        alert('Please enter all details')
      }
    }
  };


  useEffect(() => {
    if (formData.action == 'cross-border') {
      if (crossBorderSender && crossBorderSendAmount > 0) {
        const exchangeRate = formData.crossBorder.exchangeRate;
        const receiveAmount = crossBorderSendAmount * exchangeRate;
        console.log('Exchange Rate:', exchangeRate);
        console.log('Cross Border Receive Amount:', receiveAmount);
        setCrossBorderReceiveAmount(receiveAmount);
        setFormData((prev) => ({
          ...prev,
          crossBorder: {
            ...prev.crossBorder,
            receiveAmount: receiveAmount,
          },
        }));
      }
    }
  }, [crossBorderSender, crossBorderSendAmount, formData.crossBorder.exchangeRate, formData.action, setFormData]);

  console.log('Current State',buttonActive)
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
                    {/* Add explicit type to option */}
                    {currencyOptions.map((option: SelectOption) => (
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
                    {/* Add explicit type to option */}
                    {chainOptions.map((option: SelectOption) => (
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
                    {/* Add explicit type to option */}
                    {receiveCurrencyOptions.map((option: SelectOption) => (
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
              value={amount > 0 ? Number((formData.receiveAmount).toFixed(2)) : 0}
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
                    {/* Add explicit type to option */}
                    {currencyOptions.map((option: SelectOption) => (
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
                    {/* Add explicit type to option */}
                    {chainOptions.map((option: SelectOption) => (
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
                    {/* Add explicit type to option */}
                    {receiveCurrencyOptions.map((option: SelectOption) => (
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
          {/* Fields for Cross Border */}
          <div className="p-6 flex flex-col sm:w-full">
            <div className='flex flex-col gap-2 justify-items-between'>
              <div>
                <div className='flex flex-col flex-nowrap md:w-1/3'>
                  <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
                    You Send
                  </label>
                  <Select onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      crossBorder: {
                        ...prev.crossBorder,
                        sendCurrency: value,
                      },
                    }))
                    setCrossBorderSender(value)
                  }}
                    defaultValue={formData.crossBorder.sendCurrency}
                  >
                    <SelectTrigger className='bg-white font-extrabold'>
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Add explicit type to option */}
                      {currencyOptions.map((option: SelectOption) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex flex-col flex-nowrap md:w-1/3'>
                  <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
                    Using
                  </label>
                  <Select onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      crossBorder: {
                        ...prev.crossBorder,
                        senderPaymentMethod: value,
                      },
                    }))
                    // setCrossBorderSender(value)
                  }}
                    defaultValue={formData.crossBorder.sendCurrency !== '' ? currencyProviders[formData.crossBorder.sendCurrency][0] : '' }
                  >
                    <SelectTrigger className='bg-white font-extrabold'>
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Add explicit type to option */}
                      {formData.crossBorder.sendCurrency !== '' ? (
                        currencyProviders[formData.crossBorder.sendCurrency].map((option: string) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="default" disabled>
                          Select a currency first
                        </SelectItem>
                      )}

                    </SelectContent>
                  </Select>
                </div>
              </div>

              <label htmlFor="crossBorderSendamount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
                {formData.crossBorder.sendCurrency !== '' ? `Amount (in ${formData.crossBorder.sendCurrency})` : 'They Recieve'}
              </label>
              <Input
                type="number"
                id="amount"
                pattern="[0-9]*"
                onChange={handleCrossBorderInputChange}
                className="md:mb-4 bg-white font-extrabold"
              />

              {/* RECIEVE STUFF  */}
              <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
                {/* {formData.crossBorder.receiveCurrency !== '' ? `They Recieve (in ${formData.receiveCurrency})` : 'They Recieve'} */}
                They Receive
              </label>

              <Select onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  crossBorder: {
                    ...prev.crossBorder,
                    receiveCurrency: value,
                  },
                }))
                setCrossBorderReciever(value)
              }}
                defaultValue={formData.crossBorder.receiveCurrency}
              >
                <SelectTrigger className='bg-white font-extrabold'>
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Add explicit type to option */}
                      {currencyOptions.map((option: SelectOption) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label htmlFor="amount" className="block mb-2 mt-4 text-sm font-extrabold text-gray-900">
                {formData.crossBorder.receiveCurrency !== '' ? `Receive Amount (in ${formData.crossBorder.receiveCurrency})` : 'Recieve Amount'}
              </label>


              <Input
                type="number"
                id="receiveAmount"
                value={formData.crossBorder.receiveAmount > 0 ? Number((crossBorderReceiveAmount).toFixed(2)) : 0}
                readOnly
                className="mb-4 bg-white font-extrabold"
                disabled={true}
              />
              {/* <p className='font-semibold text-sm'>1 {formData.crossBorder.sendCurrency} = {Number((formData.crossBorder.exchangeRate).toFixed(2))} {formData.crossBorder.receiveCurrency}</p>        */}
            </div>

            {formData.crossBorder.receiveCurrency !== '' && (
              <>
                <label htmlFor="recieveMethod" className="block mb-2 text-sm font-medium text-gray-900">
                  Using
                </label>
                <Select onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    crossBorder: {
                      ...prev.crossBorder,
                      recieverPaymentMethod: value,
                    },
                  }))

                }}>
                  <SelectTrigger className='bg-white font-extrabold'>
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>
                    <SelectContent defaultValue={formData.crossBorder.recieverPaymentMethod}>
                      {/* Add explicit type to option */}
                      {formData.crossBorder.receiveCurrency !== '' ? (
                        currencyProviders[formData.crossBorder.receiveCurrency].map((option: string) => (
                          <SelectItem key={option} value={option} defaultValue={formData.crossBorder.recieverPaymentMethod}>
                            {option}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="default" disabled>
                          Select a currency first
                        </SelectItem>
                      )}

                    </SelectContent>
                </Select>
              </>
            )}


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

      
    </>
  );
}
export default AmountStep;
