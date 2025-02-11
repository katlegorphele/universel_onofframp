'use client'

import React, { useState } from 'react';
import AmountStep from './AmountStep';
import WalletStep from './WalletStep';
import VerifyStep from './VerifyStep';
import OrderStep from './OrderStep';
import { useOnOffRampContext } from '../context/OnOffRampContext';
import StepIndicator from './StepIndicator';
import { Button } from '@/components/ui/button';

const OnOffRampForm = () => {
  const [step, setStep] = useState(1);
  const { formData } = useOnOffRampContext();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <>
      <div
        className="on-off-ramp-form p-6 rounded-lg shadow-md"
        style={{
          width: '750.47px',
          height: '650px',
          backgroundColor: '#68BEFF40', // Blue transparent background
          border: '2px solid #039FFF',
        }}
      >
        <div className="justify-center rounded-lg border">
          <p>{formData.action.toUpperCase()}</p>
        </div>
        <div className="steps flex justify-center mb-4 w-full">
          <StepIndicator currentStep={step} />
        </div>
        {step === 1 && <AmountStep onNext={handleNext} />}
        {step === 2 && <WalletStep onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <VerifyStep onNext={handleNext} onBack={handleBack} />}
        {step === 4 && <OrderStep onBack={handleBack} />}
        <Button>BUY</Button>
        <Button>SELL</Button>
        <Button>TRANSFER</Button>
      </div>
    </>
  );
};

export default OnOffRampForm;