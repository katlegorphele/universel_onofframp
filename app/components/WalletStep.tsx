'use client'

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';

const currencyProviders: { [key: string]: string[] } = {
  KES: ['MPESA'],
  GHS: ['MTN', 'VODAFONE'],
  ZMW: ['MTN', 'AIRTEL', ],
  XOF: ['MTN', 'ORANGE'],
  XAF: ['MTN', 'ORANGE'],
  CDF: ['AIRTEL', 'ORANGE'],
  TZS: ['AIRTEL', 'TIGO'],
  MWK: ['AIRTEL', 'TNM'],
  UGX: ['MTN'],
  RWF: ['MTN', 'AIRTEL'], 
};

const paymentMethodsZAR = ['CARD', 'BANK'];

const WalletStep = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { formData, setFormData }: { formData: { currency: keyof typeof currencyProviders }, setFormData: any } = useOnOffRampContext();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState('');
  const [accountName, setAccountName] = useState('');
  const [fullname, setFullname] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [buttonActive, setButtonActive] = useState(false)

  useEffect(() => {
    if (formData.currency == 'ZAR') {
      if (
        phoneNumber == '' ||
        paymentMethod == '' ||
        fullname == '' ||
        walletAddress == ''
      ) {
        setButtonActive(false)
      } else {
        setButtonActive(true)
      }
    } else {
      if (
        phoneNumber == '' ||
        accountName == '' ||
        phoneNumber == '' ||
        walletAddress == '' ||
        network == ''
      ) {
        
        setButtonActive(false)
      } else {
        setButtonActive(true)
      }

    }
  }, [phoneNumber, paymentMethod, fullname, walletAddress, network, accountName])

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      mobileWallet: {
      phoneNumber,
      network,
      accountName
      },
      bankDetails: {
      fullname,
      phoneNumber,
      paymentMethod
      },
      walletAddress
    }));
  }, [phoneNumber, network, accountName, fullname, paymentMethod, walletAddress]);


  const handleSubmit = () => {
    onNext();
  };

  return (
    <div className="wallet-step p-6 rounded-lg shadow-md bg-gray-100 ">
      {formData.currency === 'ZAR' ? (
        <h2 className="text-xl font-bold mb-4">Please provide your crypto wallet address and details for the transaction.</h2>
      ) : (
        <h2 className="text-xl font-bold mb-4">Please provide your crypto wallet address and mobile money
phone number for the transaction.</h2>
      )  
      }
      <label htmlFor="walletAddress" className="block mb-2 text-sm font-medium text-gray-900">
        Web3 Wallet Address
      </label>
      <Input
        type="text"
        id="walletAddress"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="mb-4"
      />
      {currencyProviders[formData.currency] ? (
        <>
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
        </>
      ) : formData.currency === 'ZAR' ? (
        <>
          <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900">
            Full Name
          </label>
          <Input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
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
          <label htmlFor="paymentMethod" className="block mb-2 text-sm font-medium text-gray-900">
            Payment Method
          </label>
          <Select onValueChange={setPaymentMethod} defaultValue={paymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select Payment Method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethodsZAR.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      ) : (
        <>
          <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900">
            Full Name
          </label>
          <Input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
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
          <label htmlFor="paymentMethod" className="block mb-2 text-sm font-medium text-gray-900">
            Payment Method
          </label>
          <Input
            type="text"
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mb-4"
          />
        </>
      )}
      <div className="flex justify-between mt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button disabled={!buttonActive} onClick={handleSubmit}>
          Next
        </Button>
      </div>
    </div>
  );

};

export default WalletStep;