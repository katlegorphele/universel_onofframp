import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useActiveAccount } from 'thirdweb/react';
import { thirdwebClient } from '../config/client';
import { defineChain, getContract, sendTransaction, toEther, toWei, } from 'thirdweb';
import { allowance, approve, getBalance, transfer } from 'thirdweb/extensions/erc20';
import axios from 'axios';
import { getDynamicContract } from '../utils/helperFunctions';

const transferContract = getContract({
  client: thirdwebClient,
  chain: defineChain(1135),
  address: "0xE29E8434FF23c4ab128AEA088eE4f434129F1Bf1",

});



const TransferStep = () => {
  const [addressTo, setAddressTo] = useState('')
  const [amount, setAmount] = useState(0)
  const [email, setEmail] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const activeAccount = useActiveAccount()

  const account = useActiveAccount()

  useEffect(() => {
    if (account) {
      setWalletAddress(account.address)
    }
  }, [account])


  const handleTransfer = async () => {
    setLoading(true)

  const logAmounts = () => {
    console.log('Amount: ', amount)
    console.log('Amount in wei', toWei(amount.toString()))
    console.log('Amount in ether', toEther(BigInt(amount)))
  }

    try {
      logAmounts()

      if (!account) {
        throw new Error('Account is not defined');
      }
      // get balance
      const balance = await getBalance({ contract: transferContract, address: walletAddress })
      console.log('Balance', toEther(balance.value))

      // if balance lower than amount return
      if (Number(toEther(balance.value)) < amount) {
        alert(`You have insufficient balance to transfer. Your balance: ${toEther(balance.value)} UZAR`)
        return
      }

      let userAllowance = Number(toEther(await allowance({ contract: transferContract, owner: walletAddress, spender: process.env.NEXT_PUBLIC_ESCROW_WALLET || '' })))

      const contract = await getDynamicContract('0xE29E8434FF23c4ab128AEA088eE4f434129F1Bf1','LISK')

      if (userAllowance < amount) {
        const transaction = await approve({
          contract,
          spender: process.env.NEXT_PUBLIC_ESCROW_WALLET || '',
          amount,
        });
        const approveHash = await sendTransaction({ transaction, account });
        console.log('Approval Hash', approveHash)
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



  return (
    // If active account then display fields otherwise show connect button
    <>
      {activeAccount && (
        <>
          <div className="p-6 flex flex-col sm:w-full">
            <label htmlFor="senderWalletAddress" className="block mb-2 text-sm font-medium text-gray-900">
              Enter Your Wallet Address
            </label>
            <Input
              type="text"
              id="walletAddress"
              value={activeAccount.address}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="mb-4 bg-white"
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
              className="mb-4 bg-white"
            />

            <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900">
              Amount To Transfer
            </label>
            <Input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mb-4 bg-white"
            />

            <label htmlFor="recepientWalletAddress" className="block mb-2 text-sm font-medium text-gray-900">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 bg-white"
            />

            <Button onClick={handleTransfer} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm & Proceed'}
              {/* Next: Transfer Funds */}
            </Button>
          </div>

        </>)
        }
    </>
  )
}

export default TransferStep