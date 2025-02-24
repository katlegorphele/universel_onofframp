'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeftRight, MapPinned } from 'lucide-react'
import React, { useState } from 'react'
import { useOnOffRampContext } from '../context/OnOffRampContext';

const ActionButtons = () => {
    const [step, setStep] = useState(1);
    const { setFormData } = useOnOffRampContext();

    const switchToBuy = () => {
        console.log(step) // super unnedeed doing it to avoid errors
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
    <div className='flex flex-col-reverse justify-between mt-2'>
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
  )
}

export default ActionButtons