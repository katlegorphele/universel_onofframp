import React, {  useState } from 'react'
import { useOnOffRampContext } from '../context/OnOffRampContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useActiveAccount } from 'thirdweb/react';
import { ConnectButton } from 'thirdweb/react';
import { networkConfig } from '../config/networkConfig';
import { thirdwebClient } from '../config/client';
import { defineChain, prepareContractCall, readContract, sendTransaction, toWei } from 'thirdweb';
import axios from 'axios';


const TransferStep = () => {
    const {chainId, uZarContractAddress, rampContractAddress} = networkConfig;
    const { uzarContract, transactionContract } = useOnOffRampContext();
    const [addressTo, setAddressTo] = useState('')
    const [amount, setAmount] = useState(0)
    const [email, setEmail] = useState('')
    // const [txHash, setTXHash] = useState('')
    const [walletAddress, setWalletAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const activeAccount = useActiveAccount()

    const account = useActiveAccount()

    console.log('Wallet Address: ', walletAddress)
    

    const handleTransfer = async () => {
        try {
            setLoading(true)
            const allowance = await readContract({
                contract: uzarContract,
                method:
                  "function allowance(address owner, address spender) view returns (uint256)",
                params: [account?.address || "", rampContractAddress],
              });
              console.log('Current Allowance: ', allowance)

            if (allowance < amount) {
                const transaction = prepareContractCall({
                    contract: uzarContract,
                    method: "function approve(address, uint256)",
                    params: [rampContractAddress, toWei(amount.toString())],
                })

                if (account) {
                    const {transactionHash} = await sendTransaction({
                        transaction,
                        account
                    })
                    console.log('Transaction Hash: ', transactionHash)
                } else {
                    throw new Error('Account not found')
                }

                const transactionId = "txn_" + Math.random().toString(36).substr(2, 9);

                const transferTransaction = prepareContractCall({
                    contract: transactionContract,
                    method: "function OnOffRamp(address,uint256,string,string)",
                    params: [addressTo, toWei(amount.toString()), transactionId, email],
                })

                if (account) {
                    const { transactionHash } = await sendTransaction({
                      transaction: transferTransaction,
                      account,
                    });
                    console.log("Transfer Confirmation:", transactionHash);
            
                    const response = await axios.post("/api/transfer-token", {
                      amount: amount,
                      to: addressTo,
                      email: email,
                      txHash: transactionHash,
                    });
            
                    if (response.data.success) {
                      alert(response.data.message);
                    }
                  } else {
                    throw new Error("Account is undefined");
                  }
            }
        } catch (error) {
            console.log(error)
        }        

        setLoading(false)
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
                value={addressTo}
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