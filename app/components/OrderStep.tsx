import React, {useState, useEffect} from 'react';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';
import { Currency } from 'lucide-react';

const OrderStep = ({ onBack }: { onBack: () => void }) => {
  const { formData } = useOnOffRampContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
        const response = await fetch('API_ENDPOINT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
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
    <div className="order-step p-6 rounded-lg shadow-md bg-gray-100">
      <h2 className="text-xl font-bold">Review Details</h2>
      <p className='text-sm'>Confirm details and proceed with the transaction</p>
      {formData.currency === 'ZAR' ? (
        <div className="flex flex-col justify-between mt-4 border">
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
      </div>
        ) : (
            <div className="flex flex-col justify-between mt-4 border">
            <div>
              <p><span className='font-bold'>Mobile money account:</span> {formData.mobileWallet.phoneNumber}</p>
              <p><span className='font-bold'>{formData.receiveCurrency} Amount:</span> {(formData.receiveAmount).toFixed(2)} {formData.receiveCurrency}</p>
              <p><span className='font-bold'>Wallet:</span> {formData.walletAddress}</p>
              {/* <p><span>Currency:</span> {formData.currency}</p> */}
              
              <p><span className='font-bold'>Mobile carrier:</span> {formData.mobileWallet.network}</p>
              <p><span className='font-bold'>Transaction Fee:</span> {formData.totalFee} {formData.currency}</p>
            </div>
            
          </div>
        )}
      <div className="flex justify-between mt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Confirm & Proceed'}
          {/* Next: Transfer Funds */}
        </Button>
      </div>
    </div>
  );
};

export default OrderStep;