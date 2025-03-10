import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useActiveAccount, useSwitchActiveWalletChain } from 'thirdweb/react';
import { thirdwebClient } from '../config/client';
import { defineChain, getContract, sendTransaction, toEther, } from 'thirdweb';
import { allowance, approve, getBalance, transfer } from 'thirdweb/extensions/erc20';
import axios from 'axios';
import { getDynamicContract, getTokenAddress } from '../utils/helperFunctions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOnOffRampContext } from '../context/OnOffRampContext';
import { Loader } from 'lucide-react';

const transferContract = getContract({
  client: thirdwebClient,
  chain: defineChain(1135),
  address: "0xE29E8434FF23c4ab128AEA088eE4f434129F1Bf1",

});



const TransferStep = () => {
  const { formData, setFormData, receiveCurrencyOptions, chainOptions } = useOnOffRampContext();
  const [addressTo, setAddressTo] = useState('')
  const [amount, setAmount] = useState(0)
  const [email, setEmail] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const activeAccount = useActiveAccount()
  const [buttonActive, setButtonActive] = useState(false)

  const account = useActiveAccount()
  const wallet = useSwitchActiveWalletChain();

  useEffect(()=> {
      switch(formData.chain) {
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

  useEffect(() => {
    if (addressTo === '' || amount === 0 || email === '') {
      setButtonActive(false)
    } else {
      setButtonActive(true)
    }
  }, [setButtonActive, addressTo, amount, email])

  useEffect(() => {
    if (account) {
      setWalletAddress(account.address)
    }
  }, [account])

  const getAllowance = async () => {
    if (!account) {
      return
    }
    const tokenAddress = getTokenAddress(formData.receiveCurrency, formData.chain)
    if (!tokenAddress) {return}
    const contract = await getDynamicContract(tokenAddress, formData.chain)
    let userAllowance = 0
    if (formData.receiveCurrency == 'UZAR') {
      // has 18 decimals
      userAllowance = Number(await (allowance({ contract, owner: account.address, spender: process.env.NEXT_PUBLIC_ESCROW_WALLET || '' }))) / 10 ** 18
    } else {
      userAllowance = Number(await (allowance({ contract, owner: account.address, spender: process.env.NEXT_PUBLIC_ESCROW_WALLET || '' }))) / 10 ** 6
    }
    return userAllowance
  }

  const handleUZARTransfer = async () => {
    setLoading(true)
    try {

      if (!account) {
        throw new Error('Account is not defined');
      }
      // get balance
      const balance = await getBalance({ contract: transferContract, address: walletAddress })

      // if balance lower than amount return
      if (Number(toEther(balance.value)) < amount) {
        alert(`You have insufficient balance to transfer. Your balance: ${toEther(balance.value)} UZAR`)
        return
      }

      let userAllowance = Number(toEther(await allowance({ contract: transferContract, owner: walletAddress, spender: process.env.NEXT_PUBLIC_ESCROW_WALLET || '' })))

      const contract = await getDynamicContract('0xE29E8434FF23c4ab128AEA088eE4f434129F1Bf1', 'LISK')

      if (userAllowance < amount) {
        const transaction = await approve({
          contract,
          spender: process.env.NEXT_PUBLIC_ESCROW_WALLET || '',
          amount,
        });
        await sendTransaction({ transaction, account });
        userAllowance = Number(toEther(await allowance({ contract: transferContract, owner: walletAddress, spender: process.env.NEXT_PUBLIC_ESCROW_WALLET || '' })))
      }

      if (userAllowance >= amount) {
        const transaction = await transfer({
          contract,
          to: addressTo || '',
          amount: amount,
        });


        const txHash = await sendTransaction({ transaction, account });
        if (txHash.transactionHash) {
          const response = await axios.post("/api/transfer-token", {
            amount,
            to: addressTo,
            email: email,
            txHash: txHash.transactionHash,
          });

          if (response.data.success) {
            alert(response.data.message)
          }
        } else {
          alert('Something went wrong')
        }
      }

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async () => {
    setLoading(true)
    const tokenAddress = getTokenAddress(formData.receiveCurrency, formData.chain)
    if (!tokenAddress) {return}
    const contract = await getDynamicContract(tokenAddress, formData.chain)
    if (!account) {
      return
    }
    const userBalance = await getBalance({ contract, address: walletAddress })
    const userAllowance = await getAllowance()

    try {
      if (Number(userBalance.displayValue) < amount) {
        alert(`You have insufficient balance to transfer. Your balance: ${userBalance.displayValue} ${formData.receiveCurrency}`)
        return
      }
      if (!userAllowance) {
        return}

      if (userAllowance < amount) {
        const transaction = approve({
          contract,
          spender: process.env.NEXT_PUBLIC_ESCROW_WALLET || '',
          amount: amount,
        });
        await sendTransaction({ transaction, account });
      }

      if (userAllowance >= amount) {
        const transaction = transfer({
          contract,
          to: addressTo || '',
          amount: amount,
        });
        const txHash = await sendTransaction({ transaction, account });
        if (txHash.transactionHash) {
          const response = await axios.post("/api/transfer-token", {
            amount,
            to: addressTo,
            email: email,
            txHash: txHash.transactionHash,
            token: formData.receiveCurrency,
            chain: formData.chain
          });

          if (response.data.success) {
            alert(response.data.message)
          }
        } else {
          alert('Something went wrong')
        }
      }

    }
    catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
    
  }



  return (
    // If active account then display fields otherwise show connect button
    <>

      <div className="p-6 flex flex-col sm:w-full">
        <div className='flex flex-col md:flex-row md:gap-4 mb-4'>
          <div className='flex flex-col flex-nowrap md:w-1/2 '>
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
          <div className='md:w-1/2'>
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
        </div>

        <label htmlFor="senderWalletAddress" className="block mb-2 text-sm font-medium text-gray-900">
          Enter Your Wallet Address
        </label>
        <Input
          type="text"
          id="walletAddress"
          value={activeAccount?.address}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="mb-4 bg-white font-extrabold"
          disabled={true}
        />

        <label htmlFor="recepientWalletAddress" className="block mb-2 text-sm font-medium text-gray-900">
          Enter Recepient Wallet Address
        </label>
        <Input
          type="text"
          id="recepientWalletAddress"
          value={addressTo}
          onChange={(e) => setAddressTo(e.target.value)}
          className="mb-4 bg-white font-extrabold"
        />

        <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900">
          Amount To Transfer
        </label>
        <Input
          type="number"
          id="amount"
          // pattern='[0-9]*'
          // value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mb-4 bg-white font-extrabold"
        />

        <label htmlFor="recepientWalletAddress" className="block mb-2 text-sm font-medium text-gray-900">
          Email Address
        </label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 bg-white font-extrabold"
        />

        <Button onClick={formData.receiveCurrency == 'UZAR' ? handleUZARTransfer : handleTransfer } disabled={!buttonActive}>
          {loading ? <> <Loader/> Processing...</> : 'Confirm & Proceed'}

          {/* Next: Transfer Funds */}
        </Button>
      </div>
    </>
  )
}

export default TransferStep