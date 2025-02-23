import React, { useState, } from 'react';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';
import axios from 'axios';
import { useActiveAccount } from 'thirdweb/react';
import { defineChain, getContract, sendTransaction, toEther } from 'thirdweb';
import { thirdwebClient } from '../config/client';
import { getBalance, allowance, approve, transfer } from 'thirdweb/extensions/erc20';

const OrderStep = ({ onBack }: { onBack: () => void }) => {
  const { formData } = useOnOffRampContext();
  const [loading, setLoading] = useState(false);
  const account = useActiveAccount()

  const TransferToken = async () => {

    const userBalance = await checkUserCryptoBalance()
    if (!userBalance || !account) {
      return
    }


    if (parseFloat(userBalance) < formData.amount) {
      alert(`You do not have a sufficient balance to continue. Your balance: ${userBalance} ${formData.receiveCurrency}`)
      return
    }
    const tokenAddress = getTokenAddress(formData.receiveCurrency, formData.chain);

    // Check if the token address is valid
    if (!tokenAddress) {
      alert('Invalid token address for the selected network.');
      return;
    }

    const contract = await getDynamicContract(tokenAddress, formData.chain);


    let userAllowance = Number(toEther(await (allowance({ contract, owner: account.address, spender: 'process.env.PUBLIC_NEXT_ESCROW_WALLET' }))))
    if (userAllowance < formData.amount) {
      const transaction = await approve({
        contract,
        spender: "process.env.PUBLIC_NEXT_ESCROW_WALLET",
        amount: formData.amount,
      });

      await sendTransaction({ transaction, account });
      userAllowance = Number(toEther(await (allowance({ contract, owner: account.address, spender: 'process.env.PUBLIC_NEXT_ESCROW_WALLET' }))))
    }

    if (userAllowance >= formData.amount) {
      const transaction = await transfer({
        contract,
        to: "process.env.PUBLIC_NEXT_ESCROW_WALLET",
        amount: formData.amount,
      });

      const txHash = await sendTransaction({ transaction, account });

      if (txHash) {
        return true
      } else {
        return false
      }
    }


  }

  const checkUserCryptoBalance = async () => {
    try {

      if (!account?.address || !formData.chain || !formData.receiveCurrency) {
        alert('Please ensure your wallet is connected, a network is selected, and a token is chosen.');
        return;
      }

      const isValidCombination = validateTokenNetwork(formData.receiveCurrency, formData.chain);
      if (!isValidCombination) {
        if (formData.receiveCurrency)
          return;
      }

      // Get the token address based on the selected chain and token
      const tokenAddress = getTokenAddress(formData.receiveCurrency, formData.chain);

      // Check if the token address is valid
      if (!tokenAddress) {
        alert('Invalid token address for the selected network.');
        return;
      }

      const contract = await getDynamicContract(tokenAddress, formData.chain);

      const balance = await getBalance({ contract, address: account.address })


      const formattedBalance = toEther(balance.value);
      return formattedBalance

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  }

  // helper functions


  interface ChainIds {
    [key: string]: number;
  }

  interface TokenAddresses {
    [key: string]: {
      [key: string]: string;
    };
  }

  const getDynamicContract = async (contractAddress: string, chain: string) => {
    const chainId = getChainId(chain.toLowerCase()); // Map the chain name to its corresponding chain ID
    if (!chainId) {
      throw new Error('Invalid chain selected.');
    }

    // Instantiate the contract using the thirdweb SDK
    const contract = getContract({
      client: thirdwebClient,
      chain: defineChain(chainId),
      address: contractAddress,
    });

    return contract;
  };


  const getChainId = (chain: string): number | null => {
    const chainIds: ChainIds = {
      ethereum: 1, // Ethereum Mainnet
      base: 8453,  // Base Mainnet
      arbitrum: 42161, // Arbitrum One
      lisk: 1135, // Lisk Mainnet
    };

    return chainIds[chain] || null;
  };

  const validateTokenNetwork = (token: string, chain: string) => {
    if (token === 'UZAR' && chain !== 'LISK') {
      alert('UZAR is only available on the Lisk network. Please switch to Lisk.');
      return false;
    }

    if (token === 'USDT' && chain === 'LISK') {
      alert('USDT is not available on the Lisk network. Please switch to another network.');
      return false;
    }
    return true;
  };

  const getTokenAddress = (token: string, chain: string): string | null => {
    const tokenAddresses: TokenAddresses = {
      USDT: {
        ETHEREUM: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT on Ethereum
        BASE: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',    // USDT on Base
        ARBITRUM: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT on Arbitrum
      },
      UZAR: {
        LISK: '0xE29E8434FF23c4ab128AEA088eE4f434129F1Bf1', // UZAR on Lisk
      },
    };

    // Return the token address for the selected chain and token
    return tokenAddresses[token]?.[chain] || null;
  };

  const sendSellToAPI = async () => {
    try {
      setLoading(true)
      const response = await axios.post('api/sell-token', {
        amount: formData.amount,
        bankDetails: formData.bankDetails,
        walletAddress: formData.walletAddress,
        email: formData.email,
        currency: formData.currency,
        token: formData.receiveCurrency
      });


      if (response.data.success) {
        alert('Transaction successful!');
      } else {
        alert('Transaction failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  }


  const handleBuy = async () => {
    try {
      setLoading(true)
      const response = await axios.post('api/buy-token', {
        bankDetails: formData.bankDetails,
        amount: formData.amount,
        currency: formData.currency,
        chain: formData.chain,
        token: formData.receiveCurrency,
        fiatAmount: formData.amount,
        receiverAddress: formData.walletAddress,
        walletAddress: formData.walletAddress,
        mobileWallet: formData.mobileWallet,
        email: formData.email,
      });

      if (response.data.success) {
        alert(response.data.message)
        // redirect to payment link
        window.location.href = response.data.data.redirectUrl;
      } else {
        console.log(response.data.message)
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleSell = async () => {
    setLoading(true)
    try {
      const tokenSent = await TransferToken()
      console.log('Token sent: ', tokenSent)
      if (tokenSent) {
        sendSellToAPI()
      } else {
        alert('Error processing your request')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
    // if (balance !== undefined && balance > formData.amount) {
    //   const allowance = await TransferToken()
    // }
    // check the users balance of the token they want to sell
    // ensure the user has the balance they actually want to sell
    // if transaction is successful, deduct the amount from the user's balance
    // run the api to send the money



  }

  const handleCrossBorder = async () => {
    try {
      setLoading(true)
      const response = await axios.post('api/cross-border', {
        amount: formData.amount,
        bankDetails: formData.bankDetails,
        walletAddress: formData.walletAddress,
        email: formData.email,
        currency: formData.currency
      });

      if (response.data.success) {
        alert('Transaction successful!');
      } else {
        alert('Transaction failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      <div className="order-step p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Review Details</h2>
        <p className='text-sm'>Confirm details and proceed with the transaction</p>

        <div className='border rounded-lg p-4 mt-4'>

          {formData.action === 'buy' && (
            <>
              <div></div>
              {formData.currency === 'ZAR' ? (
                <>
                  <div>
                    <p><span className='font-bold'>Currency:</span> {formData.currency}</p>
                    <p><span className='font-bold'>Receive Amount:</span> {(formData.receiveAmount).toFixed(2)} {formData.receiveCurrency}</p>
                    <p><span className='font-bold'>Wallet:</span> {formData.walletAddress}</p>

                  </div>
                  <div>

                    {/* <p>Wallet: {formData.walletAddress}</p> */}
                    <p>Payment Method: {formData.bankDetails.paymentMethod}</p>
                    <p><span className='font-bold'>Transaction Fee:</span> {formData.totalFee} {formData.currency}</p>

                  </div>

                </>
              ) : (
                <>
                  <div>
                    <p><span className='font-bold'>Mobile money account:</span> {formData.mobileWallet.phoneNumber}</p>
                    <p><span className='font-bold'>{formData.receiveCurrency} Amount:</span> {(formData.receiveAmount).toFixed(2)} {formData.receiveCurrency}</p>
                    <p><span className='font-bold'>Wallet:</span> {formData.walletAddress}</p>
                    {/* <p><span>Currency:</span> {formData.currency}</p> */}

                    <p><span className='font-bold'>Mobile carrier:</span> {formData.mobileWallet.network}</p>
                    <p><span className='font-bold'>Transaction Fee:</span> {formData.totalFee} {formData.currency}</p>
                  </div>

                </>
              )}
            </>
          )}

          {formData.action === 'sell' && (
            <>
              {formData.currency === 'ZAR' ? (
                <>
                  <div>
                    <p><span className='font-bold'>Selling:</span> {formData.amount} {formData.receiveCurrency}</p>
                    <p><span className='font-bold'>Chain:</span> {formData.chain}</p>
                    <p><span className='font-bold'>Receive Amount:</span> {(formData.receiveAmount).toFixed(2)} {formData.currency}</p>
                    <p><span className='font-bold'>Wallet:</span> {formData.walletAddress}</p>
                    {/* <p><span className='font-bold'>Transaction Fee:</span> {formData.totalFee} {formData.currency}</p> */}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p><span className='font-bold'>Mobile money account:</span> {formData.mobileWallet.phoneNumber}</p>
                    <p><span className='font-bold'>{formData.receiveCurrency} Amount:</span> {(formData.receiveAmount).toFixed(2)} {formData.receiveCurrency}</p>
                    <p><span className='font-bold'>Wallet:</span> {formData.walletAddress}</p>
                    {/* <p><span>Currency:</span> {formData.currency}</p> */}

                    <p><span className='font-bold'>Mobile carrier:</span> {formData.mobileWallet.network}</p>
                    <p><span className='font-bold'>Transaction Fee:</span> {formData.totalFee} {formData.currency}</p>
                  </div>
                </>
              )}
            </>
          )}

          {formData.action === 'cross-border' && (
            <>
              <div></div>
              {formData.currency === 'ZAR' ? (
                <>
                  <div></div>
                </>
              ) : (
                <>
                  <div>
                    <p className='font-bold'>Sender Country: {formData.crossBorder.sendCurrency} </p>
                    <p className='font-bold'>Recepient Country: {formData.crossBorder.receiveCurrency} </p>
                    <p className='font-bold'>Send Amount: {formData.crossBorder.sendAmount}</p>
                    <p className='font-bold'>Receive Amount: {formData.crossBorder.receiveAmount}</p>
                    <p className='font-bold'>Exchange Rate: {formData.crossBorder.exchangeRate}</p>

                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button
            onClick={
              formData.action === 'buy'
                ? handleBuy
                : formData.action === 'sell'
                  ? handleSell
                  : handleCrossBorder
            }
            disabled={loading}>
            {loading ? 'Processing...' : 'Confirm & Proceed'}
            {/* Next: Transfer Funds */}
          </Button>
        </div>

      </div>


    </>


  );
};

export default OrderStep;