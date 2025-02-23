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
import Header from './Header';
import { ArrowLeftRight, MapPinned } from 'lucide-react';
import {useActiveAccount } from 'thirdweb/react';
import PresetConnectButton from './presetConnectButton';


const OnOffRampForm = () => {
  const [step, setStep] = useState(1);
  const { formData, setFormData } = useOnOffRampContext();
  const account = useActiveAccount()

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
      <Header />
      { account ? 
      (<>
        <div className="md:p-6 rounded-lg shadow-md bg-[#68BEFF40] bg-opacity-0 max-h-screen mt-4 "
      >
        {/* <h1 className="text-2xl font-bold mb-4 text-center">Universal</h1> */}
        <div className='justify-center rounded-lg border p-2 text-white font-bold text-center mb-4 bg-[#039FFF]'>
          <p>{formData.action.toUpperCase()}</p>
        </div>
        <div className="steps flex justify-center  w-2.5/3">
          <StepIndicator currentStep={step} />
        </div>
        {step === 1 && <AmountStep onNext={handleNext} />}
        {step === 2 && <WalletStep onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <VerifyStep onNext={handleNext} onBack={handleBack} />}
        {step === 4 && <OrderStep onBack={handleBack} />}
        {step === 5 && <TransferStep />}

      </div>
      <div className='flex sm:flex-col md:flex-row justify-between mt-2'>
        <Button onClick={switchToBuy} className="bg-[#039FFF] hover:bg-[#94c7e7] text-white flex items-center m-1">
          <ArrowLeftRight size={16} /> BUY
        </Button>
        <Button onClick={switchToSell} className="bg-[#b160d6] hover:bg-[#0a3047af] text-white flex items-center m-1">
          <ArrowLeftRight size={16} /> SELL

        </Button>
        <Button onClick={switchToTransfer} className="bg-[#6066be] hover:bg-[#0a3047af] text-white flex items-center m-1" >
          <ArrowLeftRight size={16} /> TRANSFER
        </Button>


        <Button onClick={switchToCrossBorder} className="bg-[#176133] hover:bg-[#0a3047af] text-white flex items-center m-1">
        <MapPinned size={16} /> CROSS BORDER
        </Button>
      </div>
      </>) 
      :
      (<>
      <div className='flex justify-center items-center w-full h-screen'>
      <PresetConnectButton/>
      </div>
      </>)}
      

    </>
  );
};

export default OnOffRampForm;