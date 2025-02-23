import React, { useState } from 'react'
import { useOnOffRampContext } from '../context/OnOffRampContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useActiveAccount } from 'thirdweb/react';
import { ConnectButton } from 'thirdweb/react';
import { networkConfig } from '../config/networkConfig';
import { thirdwebClient } from '../config/client';
import { defineChain, getContract, prepareContractCall, readContract, sendTransaction, toEther, toWei } from 'thirdweb';
import { allowance, approve, getBalance, transfer } from 'thirdweb/extensions/erc20';
import axios, { all } from 'axios';

const transferContract = getContract({
  client: thirdwebClient,
  chain: defineChain(1135),
  address: "0xE29E8434FF23c4ab128AEA088eE4f434129F1Bf1",

});



const TransferStep = () => {
  const { chainId, uZarContractAddress, rampContractAddress } = networkConfig;
  const { uzarContract, transactionContract } = useOnOffRampContext();
  const [addressTo, setAddressTo] = useState('')
  const [amount, setAmount] = useState(0)
  const [email, setEmail] = useState('')
  // const [txHash, setTXHash] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const activeAccount = useActiveAccount()

  const account = useActiveAccount()

  // console.log('Wallet Address: ', walletAddress)


  const handleTransfer = async () => {
    setLoading(true)

    try {
      if (!account) {
        throw new Error('Account is not defined');
      }
      // get balance
      const balance = await getBalance({ contract: transferContract, address: account.address })
      console.log('Balance', toEther(balance.value))

      // if balance lower than amount return
      if (Number(toEther(balance.value)) < amount) {
        alert(`You have insufficient balance to transfer. Your balance: ${toEther(balance.value)} UZAR`)
        return
      }

      let userAllowance = Number(toEther(await allowance({ contract: transferContract, owner: account.address, spender: '0xC1245E360B99d22D146c513e41fcB8914BA0bA44' })))

      if (userAllowance < amount) {
        let transaction = await approve({
          contract: uzarContract,
          spender: "0xC1245E360B99d22D146c513e41fcB8914BA0bA44",
          amount: toEther(BigInt(amount)),
        });
        const approveHash = await sendTransaction({ transaction, account });
        console.log('Approval Hash', approveHash)
        userAllowance = Number(toEther(await allowance({ contract: transferContract, owner: account.address, spender: '0xC1245E360B99d22D146c513e41fcB8914BA0bA44' })))
      }

      if (userAllowance > amount) {
        const transaction = await transfer({
          contract: transferContract,
          to: "0xC1245E360B99d22D146c513e41fcB8914BA0bA44",
          amount: amount,
        });


        const txHash = await sendTransaction({ transaction, account });
        alert(txHash.transactionHash)

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




      // if (userAllowance < amount) {
      //   alert('Approving ...')
      //   let transaction = await approve({
      //     contract: uzarContract,
      //     spender: "0xC1245E360B99d22D146c513e41fcB8914BA0bA44",
      //     amount: toEther(BigInt(amount)),
      //   });
      //   const approveHash = await sendTransaction({ transaction, account });
      //   console.log('Approval Hash', approveHash)
      //   userAllowance = await allowance({ contract: uzarContract, owner: account.address, spender: '0xC1245E360B99d22D146c513e41fcB8914BA0bA44' })
      // }



      // check user allowance and if less send approval

      // transfer token

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }



  return (
    // If active account then display fields otherwise show connect button
    <>
      {activeAccount ? (
        <>
          <div className="p-6 rounded-lg shadow-md bg-gray-100">
            <label htmlFor="senderWalletAddress" className="block mb-2 text-sm font-medium text-gray-900">
              Enter Your Wallet Address
            </label>
            <Input
              type="text"
              id="walletAddress"
              value={activeAccount.address}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="mb-4"
              disabled={true}
            />

            <label htmlFor="recepientWalletAddress" className="block mb-2 text-sm font-medium text-gray-900">
              Enter Recepient Wallet Address
            </label>
            <Input
              type="text"
              id="recepientWalletAddress"
              value={'0xC1245E360B99d22D146c513e41fcB8914BA0bA44'}
              onChange={(e) => setAddressTo(e.target.value)}
              className="mb-4"
            />

            <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900">
              Amount To Transfer
            </label>
            <Input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mb-4"
            />

            <label htmlFor="recepientWalletAddress" className="block mb-2 text-sm font-medium text-gray-900">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />

            <Button onClick={handleTransfer} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm & Proceed'}
              {/* Next: Transfer Funds */}
            </Button>
          </div>

        </>)
        :
        (<>
          <ConnectButton
            supportedTokens={{
              [chainId]: [
                {
                  address: uZarContractAddress,
                  name: "Universel Zar",
                  symbol: "uZAR",
                  icon: "...",
                },
              ],
            }}
            client={thirdwebClient}
            accountAbstraction={{
              chain: defineChain(chainId),
              sponsorGas: true,
            }}
            connectModal={{
              size: "wide",
              showThirdwebBranding: false,
            }}
          />


        </>
        )}
    </>
  )
}

export default TransferStep