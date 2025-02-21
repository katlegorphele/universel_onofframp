'use client'

import React, { useState } from 'react';
import AmountStep from './AmountStep';
import WalletStep from './WalletStep';
import VerifyStep from './VerifyStep';
import OrderStep from './OrderStep';
import { useOnOffRampContext } from '../context/OnOffRampContext';
import StepIndicator from './StepIndicator';
import { Button } from '@/components/ui/button';
import TransferStep from './TransferStep';

const OnOffRampForm = () => {
  const [step, setStep] = useState(1);
  const { formData, setFormData } = useOnOffRampContext();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const switchToBuy = () => {
    setStep(1);
    setFormData((prev) => ({ ...prev, action: 'buy' }));
  }

  const switchToSell = () => {
    setStep(1);
    setFormData((prev) => ({ ...prev, action: 'sell' }));
  }

  const switchToTransfer = () => {
    setStep(5)
    setFormData((prev) => ({ ...prev, action: 'transfer' }));
  }

  const switchToCrossBorder = () => {
    setStep(1);
    setFormData((prev) => ({ ...prev, action: 'cross-border' }));
  }


  return (
    <>
    <div className="p-6 rounded-lg shadow-md bg-[#68BEFF40] bg-opacity-80 max-h-screen mt-4 w-2/3 h-auto "
    >
      {/* <h1 className="text-2xl font-bold mb-4 text-center">Universal</h1> */}
      <div className='justify-center rounded-lg border p-2 text-white font-bold text-center '>
        <p>{formData.action.toUpperCase()}</p>
      </div>
      <div className="steps flex justify-center mb-4 w-full">
        <StepIndicator currentStep={step} />
      </div>
      {step === 1 && <AmountStep onNext={handleNext} />}
      {step === 2 && <WalletStep onNext={handleNext} onBack={handleBack} />}
      {step === 3 && <VerifyStep onNext={handleNext} onBack={handleBack} />}
      {step === 4 && <OrderStep onBack={handleBack} />}
      {step === 5 && <TransferStep/>}
      
    </div>
    <div className='flex justify-between mt-2'>
      <Button onClick={switchToBuy}>BUY</Button>
      <Button onClick={switchToSell}>SELL</Button>
      <Button onClick={switchToTransfer}>TRANSFER</Button>
      <Button onClick={switchToCrossBorder}>CROSS-BORDER</Button>
    </div>
    
    </>
  );
};

export default OnOffRampForm;