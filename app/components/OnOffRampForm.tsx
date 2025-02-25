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
import { ArrowLeftRight, MapPinned } from 'lucide-react';
import { useActiveAccount } from 'thirdweb/react';
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

  const styles = {
    buy: 'rounded-lg shadow-md bg-[#039FFF]/20 border backdrop-blur-sm border-[#039FFF] w-11/12 md:w-2/3 lg:w-1/2 ',
    sell: 'rounded-lg shadow-md bg-[#039FFF]/20 border backdrop-blur-sm border-[#039FFF] w-11/12 md:w-2/3 lg:w-1/2 ',
    transfer: 'rounded-lg shadow-md bg-[#6066be]/20 border backdrop-blur-sm border-[#6066be] w-11/12 md:w-2/3 lg:w-1/2 ',
    'cross-border': 'rounded-lg shadow-md bg-[#176133]/20 border backdrop-blur-sm border-[#176133] w-11/12 md:w-2/3 lg:w-1/2 '
  };


  return (
    <>
      
      {account ?
        (<>
          {/* <div className="rounded-lg shadow-md bg-[#039FFF]/20 border backdrop-blur-sm border-[#039FFF] w-11/12 md:w-2/3 lg:w-1/2 "
          > */}
          <div className={styles[formData.action]}>
            
            {/* <h1 className="text-2xl font-bold mb-4 text-center">Universal</h1> */}
            <div className='w-full flex justify-center items-center'>
            {formData.action === 'buy' && (
              <>
              <div className='flex items-center justify-center rounded-full border p-2 text-white font-extrabold text-center mb-4 bg-[#039FFF] w-1/3 mt-1'>
              <ArrowLeftRight size={15} className='mx-2'/> BUY
            </div>
              </>
            )}
            {formData.action === 'sell' && (
              <>
              <div className='flex items-center justify-center rounded-full border p-2 text-white font-extrabold text-center mb-4 bg-[#b160d6] w-1/3 mt-1'>
              <ArrowLeftRight size={15} className='mx-2'/> SELL
            </div>
              </>
            )}
            {formData.action === 'transfer' && (
              <>
              <div className='flex items-center justify-center rounded-full border p-2 text-white font-extrabold text-center mb-4 bg-[#6066be] w-1/3 mt-1'>
              <ArrowLeftRight size={15} className='mx-2'/> TRANSFER
            </div>
              </>
            )}
            {formData.action === 'cross-border' && (
              <>
              <div className='flex items-center justify-center rounded-full border p-2 text-white font-extrabold text-center mb-4 bg-[#0a3047af] mt-1 px-4'>
              <ArrowLeftRight size={15} className='mx-2'/> CROSS-BORDER
            </div>
              </>
            )}
            </div>
            <div className="steps flex justify-center">
              <StepIndicator currentStep={step} />
            </div>
            {step === 1 && <AmountStep onNext={handleNext} />}
            {step === 2 && <WalletStep onNext={handleNext} onBack={handleBack} />}
            {step === 3 && <VerifyStep onNext={handleNext} onBack={handleBack} />}
            {step === 4 && <OrderStep onBack={handleBack} />}
            {step === 5 && <TransferStep />}

          </div>
          <div className='flex flex-col md:flex-row justify-center justify-items-center mt-2 w-full p-6'>
            <div className='flex flex-row md:flex-row items-end'>
            <Button onClick={switchToBuy} className="bg-[#039FFF] rounded-full hover:bg-[#94c7e7] text-white flex items-center m-1 w-1/2">
              <ArrowLeftRight size={16} /> BUY
            </Button>
            <Button onClick={switchToSell} className="bg-[#b160d6] hover:bg-[#0a3047af] text-white flex items-center m-1 w-1/2">
              <ArrowLeftRight size={16} /> SELL
            </Button>
            </div>
            

            <div className='flex flex-row md:flex-row items-start'>
            <Button onClick={switchToTransfer} className="bg-[#6066be] hover:bg-[#0a3047af] text-white flex items-center m-1 w-1/2" >
              <ArrowLeftRight size={16} /> TRANSFER
            </Button>


            <Button onClick={switchToCrossBorder} className="bg-[#176133] hover:bg-[#0a3047af] text-white flex items-center m-1 w-1/2">
              <MapPinned size={16} /> CROSS BORDER
            </Button>
            </div>

            
          </div>
          
        </>)
        :
        (<>
          <div className='flex justify-center items-center w-full h-screen'>
            <PresetConnectButton />
          </div>
        </>)}


    </>
  );
};

export default OnOffRampForm;