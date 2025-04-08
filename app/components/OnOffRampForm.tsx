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

// Define action types as constants
const ACTION_TYPES = {
  BUY: 'buy',
  SELL: 'sell',
  TRANSFER: 'transfer',
  CROSS_BORDER: 'cross-border',
} as const; // Use 'as const' for stricter typing

type ActionType = typeof ACTION_TYPES[keyof typeof ACTION_TYPES];

const OnOffRampForm = () => {
  const [step, setStep] = useState(1);
  const { formData, setFormData } = useOnOffRampContext();
  const account = useActiveAccount()

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  // Single function to switch actions
  const switchToAction = (action: ActionType) => {
    const nextStep = action === ACTION_TYPES.TRANSFER ? 5 : 1;
    setStep(nextStep);
    setFormData((prev) => ({ ...prev, action }));
  };

  // Define styles using constants
  const styles: Record<ActionType, string> = {
    [ACTION_TYPES.BUY]: 'rounded-lg shadow-md bg-[#039FFF]/20 border backdrop-blur-sm border-[#039FFF] w-11/12 md:w-2/3 lg:w-1/2 ',
    [ACTION_TYPES.SELL]: 'rounded-lg shadow-md bg-[#039FFF]/20 border backdrop-blur-sm border-[#039FFF] w-11/12 md:w-2/3 lg:w-1/2 ', // Note: Sell style was same as Buy, might need adjustment
    [ACTION_TYPES.TRANSFER]: 'rounded-lg shadow-md bg-[#6066be]/20 border backdrop-blur-sm border-[#6066be] w-11/12 md:w-2/3 lg:w-1/2 ',
    [ACTION_TYPES.CROSS_BORDER]: 'rounded-lg shadow-md bg-[#176133]/20 border backdrop-blur-sm border-[#176133] w-11/12 md:w-2/3 lg:w-1/2 '
  };

  // Define step configuration
  const stepsConfig: Record<number, { component: React.ElementType; props: any }> = {
    1: { component: AmountStep, props: { onNext: handleNext } },
    2: { component: WalletStep, props: { onNext: handleNext, onBack: handleBack } },
    3: { component: VerifyStep, props: { onNext: handleNext, onBack: handleBack } },
    4: { component: OrderStep, props: { onBack: handleBack } },
    5: { component: TransferStep, props: {} }, // TransferStep takes no props currently
  };

  const CurrentStepComponent = stepsConfig[step]?.component;
  const currentStepProps = stepsConfig[step]?.props;


  return (
    <>

      {account ?
        (<>
          {/* <div className="rounded-lg shadow-md bg-[#039FFF]/20 border backdrop-blur-sm border-[#039FFF] w-11/12 md:w-2/3 lg:w-1/2 "
          > */}
          <div className={styles[formData.action as ActionType]}> {/* Assert type here */}

            {/* <h1 className="text-2xl font-bold mb-4 text-center">Universal</h1> */}
            <div className='w-full flex justify-center items-center'>
            {formData.action === ACTION_TYPES.BUY && (
              <>
              <div className='flex items-center justify-center rounded-full border p-2 text-white font-extrabold text-center mb-4 bg-[#039FFF] w-1/3 mt-1'>
              <ArrowLeftRight size={15} className='mx-2'/> BUY
            </div>
              </>
            )}
            {formData.action === ACTION_TYPES.SELL && (
              <>
              <div className='flex items-center justify-center rounded-full border p-2 text-white font-extrabold text-center mb-4 bg-[#b160d6] w-1/3 mt-1'>
              <ArrowLeftRight size={15} className='mx-2'/> SELL
            </div>
              </>
            )}
            {formData.action === ACTION_TYPES.TRANSFER && (
              <>
              <div className='flex items-center justify-center rounded-full border p-2 text-white font-extrabold text-center mb-4 bg-[#6066be] w-1/2 mt-1'>
              <ArrowLeftRight size={15} className='mx-2'/> TRANSFER
            </div>
              </>
            )}
            {formData.action === ACTION_TYPES.CROSS_BORDER && (
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
            {/* Render the current step component dynamically */}
            {CurrentStepComponent && <CurrentStepComponent {...currentStepProps} />}

          </div>
          <div className='flex flex-col md:flex-row justify-center justify-items-center mt-2 w-full p-6'>
            <div className='flex flex-row md:flex-row items-end'>
            <Button onClick={() => switchToAction(ACTION_TYPES.BUY)} className="bg-[#039FFF] rounded-full hover:bg-[#94c7e7] text-white flex items-center m-1 w-1/2">
              <ArrowLeftRight size={16} /> BUY
            </Button>
            <Button onClick={() => switchToAction(ACTION_TYPES.SELL)} className="bg-[#b160d6] rounded-full hover:bg-[#0a3047af] text-white flex items-center m-1 w-1/2">
              <ArrowLeftRight size={16} /> SELL
            </Button>
            </div>


            <div className='flex flex-row md:flex-row items-start'>
            <Button onClick={() => switchToAction(ACTION_TYPES.TRANSFER)} className="bg-[#6066be] rounded-full hover:bg-[#0a3047af] text-white flex items-center m-1 w-1/2" >
              <ArrowLeftRight size={16} /> TRANSFER
            </Button>


            <Button onClick={() => switchToAction(ACTION_TYPES.CROSS_BORDER)} className="bg-[#176133] rounded-full hover:bg-[#0a3047af] text-white flex items-center m-1 w-1/2">
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
