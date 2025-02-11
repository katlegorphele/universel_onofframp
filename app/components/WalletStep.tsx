'use client'

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';

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
};


const bankCodes = [
  // AVAILABLE TOKENS
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



const paymentMethodsZAR = ['CARD', 'BANK'];

const WalletStep = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { formData, setFormData } = useOnOffRampContext();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState('');
  const [accountName, setAccountName] = useState('');
  const [fullname, setFullname] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [buttonActive, setButtonActive] = useState(true);
  const [address, setAddress] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');






  // useEffect(() => {
  //   if (formData.currency == 'ZAR' && formData.action== 'buy') {
  //     if (
  //       phoneNumber == '' ||
  //       paymentMethod == '' ||
  //       fullname == '' ||
  //       walletAddress == ''
  //     ) {
  //       setButtonActive(false)
  //     } else {
  //       setButtonActive(true)
  //     }
  //   } else {
  //     if (
  //       phoneNumber == '' ||
  //       accountName == '' ||
  //       phoneNumber == '' ||
  //       walletAddress == '' ||
  //       network == ''
  //     ) {

  //       setButtonActive(false)
  //     } else {
  //       setButtonActive(true)
  //     }

  //   }
  // }, [phoneNumber, paymentMethod, fullname, walletAddress, network, accountName, formData.currency])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      mobileWallet: {
        phoneNumber,
        network,
        accountName
      },
      bankDetails: {
        fullname,
        phoneNumber,
        paymentMethod,
        bankCode,
        address,
        accountNumber,
        country: ''
      },
      walletAddress
    }));
  }, [phoneNumber, setFormData, network, accountName, fullname, paymentMethod, walletAddress]);


  const handleSubmit = () => {
    if (formData.currency == 'ZAR') {
      onNext();
    } else {
      alert('We only support ZAR currently. Please check back again')
    }
  };

  return (
    <>
      {formData.action === 'buy' ? (
        <>
          {/* Fields for buying */}
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
            ) :(<></>)}
            <div className="flex justify-between mt-4">
              <Button onClick={onBack} variant="outline">
                Back
              </Button>
              <Button disabled={!buttonActive} onClick={handleSubmit}>
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Fields for selling */}
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
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">
                  Address
                </label>
                <Input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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

                <label htmlFor="bankCode" className="block mb-2 text-sm font-medium text-gray-900">
                  Bank
                </label>
                <Select onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, bankCode: value }))
                }
                  } defaultValue={formData.bankDetails.bankCode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankCodes.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <label htmlFor="accountNumber" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
                  Account Number
                </label>
                <Input
                  type="text"
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="mb-4"
                  placeholder={`Enter your account number`}
                />

              </>
            ) : (<></>)}
            <div className="flex justify-between mt-4">
              <Button onClick={onBack} variant="outline">
                Back
              </Button>
              <Button disabled={!buttonActive} onClick={handleSubmit}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );

};

export default WalletStep;