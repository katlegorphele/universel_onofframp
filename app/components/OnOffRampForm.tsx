'use client'

import React, { useState } from 'react';
import AmountStep from './AmountStep';
import WalletStep from './WalletStep';
import VerifyStep from './VerifyStep';
import OrderStep from './OrderStep';
import { useOnOffRampContext } from '../context/OnOffRampContext';
import StepIndicator from './StepIndicator';

const OnOffRampForm = () => {
  const [step, setStep] = useState(2);
  const { formData, setFormData } = useOnOffRampContext();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <div className="on-off-ramp-form p-6 rounded-lg shadow-md bg-stone-600 w-auto max-h-screen mt-4">
      {/* <h1 className="text-2xl font-bold mb-4 text-center">Universal</h1> */}
      <div className='justify-center rounded-lg border '>
        <p>BUY</p>
      </div>
      <div className="steps flex justify-center mb-4 w-full">
        <StepIndicator currentStep={step} />
      </div>
      {step === 1 && <AmountStep onNext={handleNext} />}
      {step === 2 && <WalletStep onNext={handleNext} onBack={handleBack} />}
      {step === 3 && <VerifyStep onNext={handleNext} onBack={handleBack} />}
      {step === 4 && <OrderStep onBack={handleBack} />}
    </div>
  );
};

export default OnOffRampForm;