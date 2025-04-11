import React, { useState, } from 'react';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';
import axios from 'axios';
import { useActiveAccount } from 'thirdweb/react';
import { sendTransaction, toEther } from 'thirdweb';
import { getBalance, allowance, approve, transfer } from 'thirdweb/extensions/erc20';
import { getDynamicContract, getTokenAddress, validateTokenNetwork } from '../utils/helperFunctions';
import { Loader2 } from 'lucide-react';
import { bankCodes } from '../config/formOptions';

const OrderStep = ({ onBack }: { onBack: () => void }) => {
  const { formData } = useOnOffRampContext();
  const [loading, setLoading] = useState(false);
  const account = useActiveAccount()



  const bankName: string =
    bankCodes.find((bank: { value: string; label: string }) => bank.value === formData.bankDetails.bankCode)?.label ||
    'Unknown Bank';

    
  const TransferToken = async () => {

    const fee_amount = formData.amount * 1 / 100
    const amount_with_fee = formData.amount + fee_amount

    const userBalance = await checkUserCryptoBalance()
    if (!userBalance || !account) {
      return
    }


    if (parseFloat(userBalance.displayValue) < amount_with_fee) {
      alert(`You do not have a sufficient balance to continue. Your balance: ${userBalance.displayValue} ${formData.receiveCurrency}`)
      return
    }
    const tokenAddress = getTokenAddress(formData.receiveCurrency, formData.chain);

    // Check if the token address is valid
    if (!tokenAddress) {
      alert('Invalid token address for the selected network.');
      return;
    }

    const contract = await getDynamicContract(tokenAddress, formData.chain);
    let userAllowance = 0;
    if (formData.receiveCurrency == 'UZAR') {
      // has 18 decimals
      userAllowance = Number((await (allowance({ contract, owner: account.address, spender: process.env.NEXT_PUBLIC_ESCROW_WALLET || '' })))) / 10 ** 18
    } else {
      userAllowance = Number((await (allowance({ contract, owner: account.address, spender: process.env.NEXT_PUBLIC_ESCROW_WALLET || '' })))) / 10 ** 6
    }
    if (userAllowance < amount_with_fee) {
      const transaction = approve({
        contract,
        spender: process.env.NEXT_PUBLIC_ESCROW_WALLET || '',
        amount: amount_with_fee,
      });

      await sendTransaction({ transaction, account });
      userAllowance = Number(toEther(await (allowance({ contract, owner: account.address, spender: process.env.NEXT_PUBLIC_ESCROW_WALLET || '' }))))
    }


    if (parseFloat(userBalance.displayValue) >= formData.amount) {
      let transaction = transfer({
        contract,
        to: process.env.NEXT_PUBLIC_ESCROW_WALLET || '',
        amount: formData.amount,
      });

      const txHash = await sendTransaction({ transaction, account });





      transaction = transfer({
        contract,
        to: process.env.NEXT_PUBLIC_FEE_COLLECTOR || '',
        amount: fee_amount,
      });

      const FeetxHash = await sendTransaction({ transaction, account });



      if (txHash && FeetxHash) {
        return txHash
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

      return balance

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  }

  const sendSellToAPI = async (txHash: string) => {
    try {
      setLoading(true)
      const response = await axios.post('api/sell-token', {
        amount: formData.receiveAmount,
        bankDetails: formData.bankDetails,
        walletAddress: formData.walletAddress,
        email: formData.email,
        currency: formData.currency,
        token: formData.receiveCurrency,
        chain: formData.chain,
        txHash,
        txFee: transactionFee()
      });


      if (response.data.success) {
        alert('Transaction successful!');
      } else {
        
        alert('Transaction failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
    finally {
      setLoading(false);
    }
  }

  const handleBuy = async () => {

    if (formData.receiveCurrency == 'UZAR') {
      alert('Feature not enabled yet. Please try again later')
      return
    }
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
        // redirect to payment link on a new page
        if (response.data.redirectUrl) {
          const redirectUrl = response.data.redirectUrl;
          if (redirectUrl) {
            window.open(redirectUrl, '_blank')?.focus();
          }

        }

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
      const txHash = await TransferToken()
      if (txHash) {
        sendSellToAPI(txHash.transactionHash)
      } else {
        alert('Error processing your request')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }

  }

  const handleCrossBorder = async () => {
    try {
      setLoading(true)
      const response = await axios.post('api/cross-border', {
        crossBorder: formData.crossBorder,
        email: formData.email,
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

  const transactionFee = () => {

    let transactionFee;
    if (formData.bankDetails.paymentMethod == 'E-WALLET / CASH SEND') {
        transactionFee = (formData.amount * (1/100)) + 10
    } else {
      transactionFee = (formData.amount * (1/100))
    }

    return transactionFee;
  }


  return (
    <>
      <div className="order-step p-6 rounded-lg shadow-md text-wrap">
        <h2 className="text-xl font-bold">Review Details</h2>
        <p className='text-sm'>Confirm details and proceed with the transaction</p>

        <div className='border rounded-lg p-4 mt-4 '>

          {formData.action === 'buy' && (
            <>
              
              {formData.currency === 'ZAR' ? (
                <>
                  <div className='text-wrap'>
                    <p><span className='font-bold'>Pay Amount:</span> {formData.amount} {formData.currency}</p>
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
                    <p><span className='font-bold'>Total:</span> {formData.totalFee + formData.amount} {formData.currency}</p>
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
                    <p className='mt-2'>Token Details:</p>
                    <p><span className='font-bold'>Selling:</span> {formData.amount} {formData.receiveCurrency}</p>
                    <p><span className='font-bold'>Chain:</span> {formData.chain}</p>
                    <p><span className='font-bold'>Wallet:</span> {formData.walletAddress}</p>

                    <p className='mt-2'>Payment Details ({formData.bankDetails.paymentMethod})</p>
                    <p><span className='font-bold'>Transaction Fee:</span> R{transactionFee()}</p>
                    <p><span className='font-bold'>Receive Amount:</span> R{formData.amount - transactionFee()}</p>
                    
                    {formData.bankDetails.paymentMethod == 'BANK TRANSFER' ?
                      <>
                        <p><span className='font-bold'>Bank:</span> {bankName}</p>
                        <p><span className='font-bold'>Account Number:</span> {formData.bankDetails.accountNumber}</p>

                      </>
                      : <>
                        {/* <p><span className='font-bold'>Bank:</span> {bankName}</p> */}
                        <p><span className='font-bold'>Phone Number:</span> {formData.bankDetails.phoneNumber}</p>

                      </>}
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

              <div>
                <p><span className='font-bold'>Send Amount:</span> {(formData.crossBorder.sendAmount).toFixed(2)} {formData.crossBorder.sendCurrency}</p>
                <p><span className='font-bold'>Receive Amount:</span> {(formData.crossBorder.receiveAmount).toFixed(2)} {formData.crossBorder.receiveCurrency}</p>
                <p><span className='font-bold'>Receipient Details:</span></p>
                
                
                
              </div>
              
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
            {loading ? <><Loader2 /> Processing ...</> : 'Confirm & Proceed'}
            {/* Next: Transfer Funds */}
          </Button>
        </div>

      </div>


    </>


  );
};

export default OrderStep;