
import React, { useState } from 'react';
import { useOnOffRampContext } from '../context/OnOffRampContext';

const VerifyStep = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { setFormData } = useOnOffRampContext();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    setFormData((prev) => ({ ...prev, email }));
    onNext();
  };

  return (
    <div className="verify-step">
      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
        Email
      </label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Back
        </button>
        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default VerifyStep;