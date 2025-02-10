import React from 'react';
import { useOnOffRampContext } from '../context/OnOffRampContext';

const OrderStep = ({ onBack }: { onBack: () => void }) => {
  const { formData } = useOnOffRampContext();

  return (
    <div className="order-step">
      <h2 className="text-xl font-bold mb-4">Review Details</h2>
      {/* <p>Mobile money account: {formData.phoneNumber}</p>
      <p>Currency: {formData.currency}</p>
      <p>Wallet: {formData.walletAddress}</p>
      <p>Email: {formData.email}</p> */}
      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Back
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </div>
    </div>
  );
};

export default OrderStep;