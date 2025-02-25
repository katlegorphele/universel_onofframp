'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import PresetConnectButton from './presetConnectButton'
import { useActiveAccount } from 'thirdweb/react'

const Header = () => {

  const account = useActiveAccount()
  const [showWalletDetails, setShowWalletDetails] = useState(false)

  useEffect(() => {
    if (account) {
      setShowWalletDetails(true)
    } else {
      setShowWalletDetails(false)
    }
  }, [account])

  return (
    <>
    <div className='flex flex-col w-full md:items-center px-4'>
      <Image src="/UniverselLogo.png" alt="Logo" width={150} height={100} className="mt-2" />
      <div className="flex items-center">
        <p className=" font-light text-sm">Powered by</p>
        <Image src="/kotaniPayLogo.png" alt="Logo" width={80
        } height={100} className="" />
      </div>  
      </div>
      <div className=" w-full flex justify-end absolute top-0 right-0 p-1">
          {showWalletDetails && <PresetConnectButton />}
      </div>    
    </>
  )
}

export default Header