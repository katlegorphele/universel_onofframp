'use client'

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';
import { useActiveAccount } from 'thirdweb/react';




const WalletStep = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { formData, setFormData, currencyProviders, bankCodes, currencyOptions, paymentMethodsZAR } = useOnOffRampContext();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState('');
  const [accountName, setAccountName] = useState('');
  const [fullname, setFullname] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [buttonActive, setButtonActive] = useState(false);
  const [address, setAddress] = useState('');
  const [bankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [crossBorderReceiver, setCrossBorderReceiver] = useState('ZAR')
  const [crossBorderReceiveAmount, setcrossBorderReceiveAmount] = useState(0)
  const account = useActiveAccount()

  useEffect(() => {
    if(account) {
      setWalletAddress(account.address)
    }
  }, [account])

  useEffect(() => {

    if (formData.crossBorder.sendAmount > 0 && formData.action == 'cross-border') {
      const zarAmount = formData.crossBorder.sendAmount / formData.exchangeRate;
      const fetchTargetExchangeRate = async () => {
        const url = `https://v6.exchangerate-api.com/v6/6c2c521a02e3eb57efa066fa/latest/ZAR`;
        const response = await fetch(url);
        const data = await response.json();
        const targetRate = data.conversion_rates[formData.crossBorder.sendCurrency];
        const finalAmount = zarAmount * targetRate;
        setcrossBorderReceiveAmount(Number(finalAmount.toFixed(2)));
        console.log(finalAmount)
      };

      fetchTargetExchangeRate()
    }
  }, [formData.crossBorder.sendAmount, formData.exchangeRate, formData.crossBorder.sendCurrency, formData.action, formData.crossBorder.receiveCurrency]);



  useEffect(() => {
    if (formData.action === 'buy') {
      if (formData.currency === 'ZAR') {
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
    }

    if (formData.action === 'sell') {
      if (formData.currency === 'ZAR') {
        if (
          walletAddress == '' ||
          fullname == '' ||
          address == '' ||
          phoneNumber == '' ||
          // bankCode == '' ||
          accountNumber == ''
          
        ) {
          setButtonActive(false)
        } else {
          setButtonActive(true)
        }
      } else {
        if (
          phoneNumber == '' ||
          accountName == '' ||
          walletAddress == '' ||
          network == ''
        ) {

          setButtonActive(false)
        } else {
          setButtonActive(true)
        }
      }

    }

    if (formData.action === 'cross-border') {
      if (formData.crossBorder.receiveCurrency === 'ZAR') {
        if (
          fullname == '' ||
          address == '' ||
          phoneNumber == '' ||
          // bankCode == '' ||
          accountNumber == ''
        ) {
          setButtonActive(false)
        } else {
          setButtonActive(true)
        }
      }

      if (formData.crossBorder.receiveCurrency !== 'ZAR') {
        if (
          accountName == '' ||
          phoneNumber == '' ||
          network == ''
        ) {
          setButtonActive(false)
        } else {
          setButtonActive(true)
        }
      }
    }
  }, [phoneNumber, paymentMethod, fullname, walletAddress, network, accountName, formData.currency, formData.action, address, bankCode, accountNumber, formData.crossBorder.receiveCurrency])




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
      crossBorder: {
        sendCurrency: formData.crossBorder.sendCurrency,
        receiveCurrency: crossBorderReceiver,
        sendAmount: formData.crossBorder.sendAmount,
        receiveAmount: crossBorderReceiveAmount,
        exchangeRate: formData.exchangeRate,
        totalFee: 0,
      },
      walletAddress
    }));
  }, [phoneNumber, setFormData, network, accountName, fullname, paymentMethod, walletAddress, accountNumber, address, bankCode, crossBorderReceiveAmount, crossBorderReceiver, formData.crossBorder.sendAmount, formData.crossBorder.sendCurrency, formData.exchangeRate]);


  const handleSubmit = () => {

    onNext();
  };




  const handleCrossBorderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcrossBorderReceiveAmount(Number(e.target.value));
    setFormData((prev) => ({
      ...prev,
      crossBorder: {
        ...prev.crossBorder,
        receiveAmount: Number(e.target.value),
      },
    }))

  };

  return (
    <>
      {formData.action === 'buy' && (
        <>
          {/* Fields for buying */}
          <div className="p-6 flex flex-col sm:m-5 ">
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
              className="mb-4 bg-white"
              
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
                  className="mb-4 bg-white"
                />
                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                  Phone Number
                </label>
                <Input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mb-4 bg-white"
                />
                <label htmlFor="network" className="block mb-2 text-sm font-medium text-gray-900">
                  Network
                </label>
                <Select onValueChange={setNetwork} defaultValue={network}>
                  <SelectTrigger className='bg-white'>
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
                  className="mb-4 bg-white"
                />
                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                  Phone Number
                </label>
                <Input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mb-4 bg-white"
                />
                <label htmlFor="paymentMethod" className="block mb-2 text-sm font-medium text-gray-900">
                  Payment Method
                </label>
                <Select onValueChange={setPaymentMethod} defaultValue={paymentMethod}>
                  <SelectTrigger className='bg-white'>
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

      {formData.action === 'cross-border' && (
        <>
          <div className="p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Please provide Recepient Details</h2>
            <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900">
              Currency
            </label>
            <Select onValueChange={(value) => {
              setCrossBorderReceiver(value)
              setFormData((prev) => ({...prev, crossBorder: {...prev.crossBorder, receiveCurrency: value}}))
              }}>
              <SelectTrigger className='bg-white'>
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

            {crossBorderReceiver === 'ZAR' && (
              <>

                <label htmlFor="amount" className="block mb-2 mt-4 text-sm  text-gray-900">
                  Recepient Amount (in {crossBorderReceiver})
                </label>

                <Input
                  type="number"
                  id="amount"
                  // value with currency symbols
                  value={crossBorderReceiveAmount}
                  onChange={handleCrossBorderInputChange}
                  className="mb-4 bg-white"
                  disabled={true}
                />


                <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900">
                  Full Name
                </label>
                <Input
                  type="text"
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="mb-4 bg-white"
                />
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">
                  Address
                </label>
                <Input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mb-4 bg-white"
                />
                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                  Phone Number
                </label>
                <Input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mb-4 bg-white"
                />

                <label htmlFor="bankCode" className="block mb-2 text-sm font-medium text-gray-900">
                  Bank
                </label>
                <Select onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, bankCode: value }))
                }
                } defaultValue={formData.bankDetails.bankCode}>
                  <SelectTrigger className='bg-white'>
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
                  className="mb-4 bg-white"
                  placeholder={`Enter your account number`}
                />

              </>
            )}

            {crossBorderReceiver != 'ZAR' && (
              <>

                <label htmlFor="amount" className="block mb-2 mt-4 text-sm  text-gray-900">
                  Recepient Amount (in {crossBorderReceiver})
                </label>

                <Input
                  type="number"
                  id="amount"
                  // value with currency symbols
                  value={crossBorderReceiveAmount}
                  onChange={handleCrossBorderInputChange}
                  className="mb-4 bg-white"
                  disabled={true}
                />
                <label htmlFor="accountName" className="block mb-2 text-sm font-medium text-gray-900">
                  Account Name
                </label>
                <Input
                  type="text"
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="mb-4 bg-white"
                />
                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                  Phone Number
                </label>
                <Input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mb-4 bg-white"
                />
                <label htmlFor="network" className="block mb-2 text-sm font-medium text-gray-900">
                  Network
                </label>
                <Select onValueChange={setNetwork} defaultValue={network}>
                  <SelectTrigger className='bg-white'>
                    <SelectValue placeholder="Select Network" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyProviders[crossBorderReceiver].map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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
        </>
      )}

      {formData.action === 'sell' && (
        <>
          <div className="p-6 rounded-lg">
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
              className="mb-4 bg-white"
            />

            {formData.currency === 'ZAR' && (<>
              <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900">
                Full Name
              </label>
              <Input
                type="text"
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="mb-4 bg-white"
              />
              <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">
                Address
              </label>
              <Input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mb-4 bg-white"
              />
              <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <Input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mb-4 bg-white"
              />
              <label htmlFor="bankCode" className="block mb-2 text-sm font-medium text-gray-900">
                Bank
              </label>
              <Select onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, bankCode: value }))
              }
              } defaultValue={formData.bankDetails.bankCode}>
                <SelectTrigger className='bg-white'>
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
                className="mb-4 bg-white"
                placeholder={`Enter your account number`}
              />
            </>)}

            {formData.currency !== 'ZAR' && (<>
              <label htmlFor="accountName" className="block mb-2 text-sm font-medium text-gray-900">
                Account Name
              </label>
              <Input
                type="text"
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="mb-4 bg-white"
              />
              <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <Input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mb-4 bg-white"
              />

              <label htmlFor="network" className="block mb-2 text-sm font-medium text-gray-900">
                Network
              </label>
              <Select onValueChange={setNetwork} defaultValue={network}>
                <SelectTrigger className='bg-white'>
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


            </>)}




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