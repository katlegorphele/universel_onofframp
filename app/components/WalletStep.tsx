'use client'

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';
import { useActiveAccount } from 'thirdweb/react';
// Import static data
import {
  currencyProviders,
  bankCodes,
  paymentMethodsZAR,
  paymentMethodsZARforSelling
} from '../config/formOptions';

// Define type for option objects used in Select components
interface SelectOption {
  value: string;
  label: string;
}


const WalletStep = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  // Remove static data from context destructuring
  const { formData, setFormData } = useOnOffRampContext();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState('');
  const [accountName, setAccountName] = useState('');
  const [fullname, setFullname] = useState(formData.bankDetails.fullname);
  const [paymentMethod, setPaymentMethod] = useState(formData.bankDetails.paymentMethod);
  const [walletAddress, setWalletAddress] = useState(formData.walletAddress);
  const [buttonActive, setButtonActive] = useState(false); // TODO: Re-evaluate buttonActive logic
  const [address, setAddress] = useState(formData.bankDetails.address);
  const [bankCode, setBankCode] = useState(formData.bankDetails.bankCode);
  const [accountNumber, setAccountNumber] = useState(formData.bankDetails.accountNumber);
  const [crossBorderReceiveAmount, setcrossBorderReceiveAmount] = useState(formData.crossBorder.receiveAmount)
  const account = useActiveAccount()

  // state variables needed for cross-border
  const [senderBankDetails, setSenderBankDetails] = useState({
    fullname: '',
    phoneNumber: '',
    paymentMethod: '', // This might be redundant if selected elsewhere
    bankCode: '',
    address: '',
    accountNumber: '',
  });

  const [senderMobileDetails, setsenderMobileDetails] = useState({
    phoneNumber: '',
    network: '',
    accountName: ''
  });

  const [receiverBankDetails, setreceiverBankDetails] = useState({
    fullname: '',
    phoneNumber: '',
    paymentMethod: '', // This might be redundant if selected elsewhere
    bankCode: '',
    address: '',
    accountNumber: '',
  });

  const [receiverMobileDetails, setreceiverMobileDetails] = useState({
    phoneNumber: '',
    network: '',
    accountName: ''
  });


  useEffect(() => {
    if (account) {
      setWalletAddress(account.address)
      // Automatically update formData when account address is available
      setFormData((prev) => ({ ...prev, walletAddress: account.address }));
    }
  }, [account, setFormData]) // Add setFormData dependency

  // This useEffect seems to recalculate cross-border receive amount based on ZAR, which might conflict with context calculation. Review needed.
  useEffect(() => {
    if (formData.crossBorder.sendAmount > 0 && formData.action == 'cross-border' && formData.exchangeRate > 0) {
      const zarAmount = formData.crossBorder.sendAmount / formData.exchangeRate; // Assumes exchangeRate is target/ZAR
      const fetchTargetExchangeRate = async () => {
        // TODO: Use environment variable for API key
        const apiKey = 'd25d28a877b7ab63c582f16d';
        if (!apiKey) {
          console.error("API key missing for target rate fetch.");
          return;
        }
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/ZAR`;
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (data.result === 'error') throw new Error(`API error: ${data['error-type']}`);

          if (data.conversion_rates && data.conversion_rates[formData.crossBorder.sendCurrency]) {
            const targetRate = data.conversion_rates[formData.crossBorder.sendCurrency]; // Rate of ZAR / target
            const finalAmount = zarAmount * targetRate;
            setcrossBorderReceiveAmount(Number(finalAmount.toFixed(2))); // Update local state
            // Note: This might overwrite the value calculated in the context. Decide which calculation is correct.
          } else {
             console.warn(`Target currency ${formData.crossBorder.sendCurrency} not found in ZAR rates.`);
          }
        } catch (error) {
           console.error("Failed to fetch target exchange rate:", error);
        }
      };

      fetchTargetExchangeRate()
    }
  }, [formData.crossBorder.sendAmount, formData.exchangeRate, formData.crossBorder.sendCurrency, formData.action]); // Removed receiveCurrency dependency as it's the target


  // TODO: Re-implement validation logic for buttonActive state based on required fields for each action/currency combination.
  // The previous logic was commented out and complex. Needs careful review.
  useEffect(() => {
     // Placeholder: Set button active for now, needs proper validation
     setButtonActive(true);
  }, [formData, phoneNumber, network, accountName, fullname, paymentMethod, walletAddress, address, bankCode, accountNumber, senderBankDetails, senderMobileDetails, receiverBankDetails, receiverMobileDetails]);


  // This useEffect updates the main formData in the context.
  // It runs on every change to many local state variables. Consider optimizing.
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      // Update mobileWallet details from local state
      mobileWallet: {
        phoneNumber, // Assumes this phoneNumber is for mobile wallet
        network,
        accountName
      },
      // Update bankDetails from local state
      bankDetails: {
        fullname, // Assumes this fullname is for bank
        phoneNumber, // Assumes this phoneNumber is for bank (potentially confusing)
        paymentMethod, // Assumes this paymentMethod is for bank
        bankCode,
        address,
        accountNumber,
        country: 'SOUTH AFRICA' // Hardcoded country
      },
      // Update crossBorder details, merging calculated amounts and specific sender/receiver details
      crossBorder: {
        ...prev.crossBorder, // Keep existing crossBorder fields like send/receive currency/amount
        // Conditionally set sender/receiver details based on currency type
        senderDetails: prev.crossBorder.sendCurrency === 'ZAR' ? senderBankDetails : senderMobileDetails,
        recieverDetails: prev.crossBorder.receiveCurrency === 'ZAR' ? receiverBankDetails : receiverMobileDetails,
        // Ensure payment methods are correctly sourced if they change
        // senderPaymentMethod: formData.crossBorder.senderPaymentMethod, // Already in context?
        // recieverPaymentMethod: formData.crossBorder.recieverPaymentMethod // Already in context?
      },
      // Update walletAddress if it changed locally (though usually set by account effect)
      walletAddress
    }));
    // Dependency array is very large, leading to frequent updates. Review dependencies.
  }, [
      setFormData, phoneNumber, network, accountName, fullname, paymentMethod,
      bankCode, address, accountNumber, walletAddress,
      senderBankDetails, senderMobileDetails, receiverBankDetails, receiverMobileDetails
      // Removed crossBorder state variables as they should ideally be read from context (prev.crossBorder)
  ]);


  const handleSubmit = () => {
    // TODO: Add validation here before calling onNext()
    console.log("Submitting Wallet Step Data:", formData); // Log data before proceeding
    onNext()
  };

  // Logging useEffect - useful for debugging
  useEffect(() => {
    const logFormData = () => {
      console.log('Current FormData in WalletStep:', formData);
      // console.log('Reciever Data:', formData.crossBorder.recieverDetails);
      // console.log('Sender Details:', formData.crossBorder.senderDetails);
    }
    logFormData()
  }, [formData])


  // This handler seems redundant if crossBorderReceiveAmount is calculated in context/useEffect
  // const handleCrossBorderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setcrossBorderReceiveAmount(Number(e.target.value));
  //   setFormData((prev) => ({
  //     ...prev,
  //     crossBorder: {
  //       ...prev.crossBorder,
  //       receiveAmount: Number(e.target.value),
  //     },
  //   }))
  // };

  // This function seems unused
  // const updateForm = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     crossBorder: {
  //       ...prev.crossBorder,
  //       sendCurrency: formData.crossBorder.sendCurrency,
  //       receiveCurrency: formData.crossBorder.receiveCurrency,
  //       sendAmount: formData.crossBorder.sendAmount,
  //       receiveAmount: crossBorderReceiveAmount, // Uses local state, might differ from context
  //       exchangeRate: formData.exchangeRate,
  //       totalFee: 0,
  //       senderDetails: {}, // Resets sender details?
  //       recieverDetails: {}, // Resets receiver details?
  //       senderPaymentMethod: formData.crossBorder.senderPaymentMethod,
  //       recieverPaymentMethod: formData.crossBorder.recieverPaymentMethod
  //     }
  //   }))
  // }

  return (
    <>
      {/* BUY ACTION */}
      {formData.action === 'buy' && (
        <div className="p-6 flex flex-col sm:m-5 ">
          {formData.currency === 'ZAR' ? (
            <h2 className="text-xl font-bold mb-4">Please provide your crypto wallet address and details for the transaction.</h2>
          ) : (
            <h2 className="text-xl font-bold mb-4">Please provide your crypto wallet address and mobile money phone number for the transaction.</h2>
          )}
          <label htmlFor="walletAddress" className="block mb-2 text-sm font-medium text-gray-900">
            Web3 Wallet Address
          </label>
          <Input
            type="text"
            id="walletAddress"
            value={walletAddress} // Use local state derived from account
            readOnly // Should be read-only as it comes from connected account
            className="mb-4 bg-gray-100 font-extrabold" // Style as read-only
            disabled={true}
          />
          {/* Conditional rendering based on currency */}
          {currencyProviders[formData.currency] && formData.currency !== 'ZAR' ? (
             // MOBILE MONEY DETAILS (Non-ZAR Buy)
            <>
              <label htmlFor="accountName" className="block mb-2 text-sm font-medium text-gray-900">
                Mobile Money Account Name
              </label>
              <Input
                type="text"
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="mb-4 bg-white font-extrabold"
              />
              <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                Mobile Money Phone Number
              </label>
              <Input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mb-4 bg-white font-extrabold"
              />
              <label htmlFor="network" className="block mb-2 text-sm font-medium text-gray-900">
                Mobile Network
              </label>
              <Select onValueChange={setNetwork} value={network}>
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder="Select Network" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add explicit type 'string' */}
                  {currencyProviders[formData.currency]?.map((provider: string) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : formData.currency === 'ZAR' ? (
            // BANK DETAILS (ZAR Buy)
            <>
              <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900">
                Full Name (as on bank account)
              </label>
              <Input
                type="text"
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="mb-4 bg-white font-extrabold"
              />
              <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                Phone Number (for contact)
              </label>
              <Input
                type="text"
                id="phoneNumber"
                value={phoneNumber} // Using the same state as mobile money, might be confusing
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mb-4 bg-white font-extrabold"
              />
              <label htmlFor="paymentMethod" className="block mb-2 text-sm font-medium text-gray-900">
                Payment Method
              </label>
              <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                   {/* Add explicit type 'string' */}
                  {paymentMethodsZAR.map((method: string) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : (
             // Fallback or loading state if currency/provider info isn't ready
             <p>Loading payment details...</p>
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
      )}

      {/* CROSS-BORDER ACTION */}
      {formData.action === 'cross-border' && (
        <>
          {/* SENDER DETAILS */}
          <h3 className="text-lg font-semibold mb-2 p-6 pb-0">Sender Details ({formData.crossBorder.sendCurrency})</h3>
          {formData.crossBorder.sendCurrency === 'ZAR' ? (
            // SENDER BANK DETAILS (ZAR)
            <div className='p-6 pt-2 flex flex-col sm:m-5 mt-0'>
              <label className="block mb-1 text-sm font-medium text-gray-900">Bank</label>
              <Select onValueChange={(value) => setSenderBankDetails((prev) => ({ ...prev, bankCode: value }))} value={senderBankDetails.bankCode}>
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent>
                   {/* Add explicit type 'SelectOption' */}
                  {bankCodes.map((option: SelectOption) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label htmlFor="senderAccountNumber" className="block mt-3 mb-1 text-sm font-medium text-gray-900">
                Account Number
              </label>
              <Input
                type="text" id="senderAccountNumber"
                value={senderBankDetails.accountNumber}
                onChange={(e) => setSenderBankDetails((prev) => ({ ...prev, accountNumber: e.target.value }))}
                className="mb-3 bg-white font-extrabold" placeholder="Sender's account number"
              />

              <label htmlFor='senderFullName' className='block mb-1 text-sm font-medium text-gray-900'>
                Full Name
              </label>
              <Input
                type="text" id="senderFullName"
                value={senderBankDetails.fullname}
                onChange={(e) => setSenderBankDetails((prev) => ({ ...prev, fullname: e.target.value }))}
                className="mb-3 bg-white font-extrabold" placeholder="Sender's full name"
              />

              <label htmlFor="senderAddress" className="block mb-1 text-sm font-medium text-gray-900">
                Physical Address
              </label>
              <Input
                type="text" id="senderAddress"
                value={senderBankDetails.address}
                onChange={(e) => setSenderBankDetails((prev) => ({ ...prev, address: e.target.value }))}
                className="mb-3 bg-white font-extrabold" placeholder="Sender's physical address"
              />

              <label htmlFor="senderPhoneNumber" className="block mb-1 text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <Input
                type="text" id="senderPhoneNumber"
                value={senderBankDetails.phoneNumber}
                onChange={(e) => setSenderBankDetails((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                className="mb-3 bg-white font-extrabold" placeholder="Sender's phone number"
              />
            </div>
          ) : (
            // SENDER MOBILE DETAILS (Non-ZAR)
            <div className='p-6 pt-2 flex flex-col sm:m-5 mt-0'>
              <label htmlFor="senderAccountName" className="block mb-1 text-sm font-medium text-gray-900">
                Account Name
              </label>
              <Input
                type="text" id="senderAccountName"
                value={senderMobileDetails.accountName}
                onChange={(e) => setsenderMobileDetails((prev) => ({ ...prev, accountName: e.target.value }))}
                className="mb-3 bg-white font-extrabold" placeholder="Sender's account name"
              />

              <label htmlFor="senderMobilePhoneNumber" className="block mb-1 text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <Input
                type="text" id="senderMobilePhoneNumber"
                 value={senderMobileDetails.phoneNumber}
                onChange={(e) => setsenderMobileDetails((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                className="mb-3 bg-white font-extrabold" placeholder="Sender's mobile number"
              />

              <label htmlFor="senderNetwork" className="block mb-1 text-sm font-medium text-gray-900">
                Network
              </label>
              <Select onValueChange={(value) => setsenderMobileDetails((prev) => ({ ...prev, network: value }))} value={senderMobileDetails.network}>
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder="Select Network" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add explicit type 'string' */}
                  {currencyProviders[formData.crossBorder.sendCurrency]?.map((provider: string) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* RECEIVER DETAILS */}
           <h3 className="text-lg font-semibold mb-2 p-6 pb-0">Receiver Details ({formData.crossBorder.receiveCurrency})</h3>
          {formData.crossBorder.receiveCurrency === 'ZAR' ? (
            // RECEIVER BANK DETAILS (ZAR)
             <div className='p-6 pt-2 flex flex-col sm:m-5 mt-0'>
                <label className="block mb-1 text-sm font-medium text-gray-900">Bank</label>
                <Select onValueChange={(value) => setreceiverBankDetails((prev) => ({ ...prev, bankCode: value }))} value={receiverBankDetails.bankCode}>
                  <SelectTrigger className='bg-white'>
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent>
                     {/* Add explicit type 'SelectOption' */}
                    {bankCodes.map((option: SelectOption) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <label htmlFor="receiverAccountNumber" className="block mt-3 mb-1 text-sm font-medium text-gray-900">
                  Account Number
                </label>
                <Input
                  type="text" id="receiverAccountNumber"
                  value={receiverBankDetails.accountNumber}
                  onChange={(e) => setreceiverBankDetails((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  className="mb-3 bg-white font-extrabold" placeholder="Receiver's account number"
                />

                <label htmlFor='receiverFullName' className='block mb-1 text-sm font-medium text-gray-900'>
                  Full Name
                </label>
                <Input
                  type="text" id="receiverFullName"
                   value={receiverBankDetails.fullname}
                  onChange={(e) => setreceiverBankDetails((prev) => ({ ...prev, fullname: e.target.value }))}
                  className="mb-3 bg-white font-extrabold" placeholder="Receiver's full name"
                />

                <label htmlFor="receiverAddress" className="block mb-1 text-sm font-medium text-gray-900">
                  Physical Address
                </label>
                <Input
                  type="text" id="receiverAddress"
                   value={receiverBankDetails.address}
                  onChange={(e) => setreceiverBankDetails((prev) => ({ ...prev, address: e.target.value }))}
                  className="mb-3 bg-white font-extrabold" placeholder="Receiver's physical address"
                />

                <label htmlFor="receiverPhoneNumber" className="block mb-1 text-sm font-medium text-gray-900">
                  Phone Number
                </label>
                <Input
                  type="text" id="receiverPhoneNumber"
                   value={receiverBankDetails.phoneNumber}
                  onChange={(e) => setreceiverBankDetails((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  className="mb-3 bg-white font-extrabold" placeholder="Receiver's phone number"
                />
              </div>
          ) : (
             // RECEIVER MOBILE DETAILS (Non-ZAR)
            <div className='p-6 pt-2 flex flex-col sm:m-5 mt-0'>
                <label htmlFor="receiverAccountName" className="block mb-1 text-sm font-medium text-gray-900">
                  Account Name
                </label>
                <Input
                  type="text" id="receiverAccountName"
                  value={receiverMobileDetails.accountName}
                  onChange={(e) => setreceiverMobileDetails((prev) => ({ ...prev, accountName: e.target.value }))}
                  className="mb-3 bg-white font-extrabold" placeholder="Receiver's account name"
                />

                <label htmlFor="receiverMobilePhoneNumber" className="block mb-1 text-sm font-medium text-gray-900">
                  Phone Number
                </label>
                <Input
                  type="text" id="receiverMobilePhoneNumber"
                  value={receiverMobileDetails.phoneNumber}
                  onChange={(e) => setreceiverMobileDetails((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  className="mb-3 bg-white font-extrabold" placeholder="Receiver's mobile number"
                />

                <label htmlFor="receiverNetwork" className="block mb-1 text-sm font-medium text-gray-900">
                  Network
                </label>
                <Select onValueChange={(value) => setreceiverMobileDetails((prev) => ({ ...prev, network: value }))} value={receiverMobileDetails.network}>
                  <SelectTrigger className='bg-white'>
                    <SelectValue placeholder="Select Network" />
                  </SelectTrigger>
                  <SelectContent>
                     {/* Add explicit type 'string' */}
                    {currencyProviders[formData.crossBorder.receiveCurrency]?.map((provider: string) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4 p-6 pt-0">
            <Button onClick={onBack} variant="outline">
              Back
            </Button>
            <Button disabled={!buttonActive} onClick={handleSubmit}>
              Next
            </Button>
          </div>
        </>
      )}

      {/* SELL ACTION */}
      {formData.action === 'sell' && (
        <div className="p-6 rounded-lg">
          {formData.currency === 'ZAR' ? (
            <h2 className="text-xl font-bold mb-4">Please provide your crypto wallet address and bank details for the transaction.</h2>
          ) : (
            <h2 className="text-xl font-bold mb-4">Please provide your crypto wallet address and mobile money details for the transaction.</h2>
          )}

          <label htmlFor="walletAddressSell" className="block mb-2 text-sm font-medium text-gray-900">
            Web3 Wallet Address (From where you'll send funds)
          </label>
          <Input
            type="text" id="walletAddressSell"
            value={walletAddress} // Use local state derived from account
            readOnly // Should be read-only
            className="mb-4 bg-gray-100 font-extrabold"
            disabled={true}
          />

          {/* Conditional rendering based on currency */}
          {formData.currency === 'ZAR' ? (
            // BANK DETAILS (ZAR Sell)
            <>
              <label htmlFor="sellFullName" className="block mb-2 text-sm font-medium text-gray-900">
                Full Name (as on bank account)
              </label>
              <Input
                type="text" id="sellFullName"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="mb-4 bg-white font-extrabold"
              />
              <label htmlFor="sellAddress" className="block mb-2 text-sm font-medium text-gray-900">
                Physical Address
              </label>
              <Input
                type="text" id="sellAddress"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mb-4 bg-white font-extrabold"
              />
              <label htmlFor="sellPhoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                Phone Number (for contact)
              </label>
              <Input
                type="text" id="sellPhoneNumber"
                value={phoneNumber} // Using same state as buy/mobile, review if needed
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mb-4 bg-white font-extrabold"
              />

              <label htmlFor="sellPaymentMethod" className="block mb-2 text-sm font-medium text-gray-900">
                How would you like to receive funds?
              </label>
              <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                   {/* Add explicit type 'string' */}
                  {paymentMethodsZARforSelling.map((method: string) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label htmlFor="sellBankCode" className="block mb-2 mt-2 text-sm font-medium text-gray-900">
                Bank
              </label>
              <Select onValueChange={setBankCode} value={bankCode}>
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent>
                   {/* Add explicit type 'SelectOption' */}
                  {bankCodes.map((option: SelectOption) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label htmlFor="sellAccountNumber" className="block mb-2 mt-4 text-sm font-medium text-gray-900">
                Account Number
              </label>
              <Input
                type="text" id="sellAccountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="mb-4 bg-white font-extrabold"
                placeholder="Enter your account number"
              />
            </>
          ) : (
             // MOBILE MONEY DETAILS (Non-ZAR Sell)
            <>
              <label htmlFor="sellAccountName" className="block mb-2 text-sm font-medium text-gray-900">
                Mobile Money Account Name
              </label>
              <Input
                type="text" id="sellAccountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="mb-4 bg-white font-extrabold"
              />
              <label htmlFor="sellMobilePhoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                 Mobile Money Phone Number
              </label>
              <Input
                type="text" id="sellMobilePhoneNumber"
                value={phoneNumber} // Using same state as buy/bank, review if needed
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mb-4 bg-white font-extrabold"
              />

              <label htmlFor="sellNetwork" className="block mb-2 text-sm font-medium text-gray-900">
                Mobile Network
              </label>
              <Select onValueChange={setNetwork} value={network}>
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder="Select Network" />
                </SelectTrigger>
                <SelectContent>
                   {/* Add explicit type 'string' */}
                  {currencyProviders[formData.currency]?.map((provider: string) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <Button onClick={onBack} variant="outline">
              Back
            </Button>
            <Button disabled={!buttonActive} onClick={handleSubmit}>
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletStep;
