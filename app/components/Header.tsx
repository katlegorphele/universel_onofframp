import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <>
    <Image src="/UniverselLogo.png" alt="Logo" width={150} height={100} className="mt-2"/>
        <div className="flex items-center">
          <p className=" font-light text-sm">Powered by</p>
        <Image src="/kotaniPayLogo.png" alt="Logo" width={50
        } height={100} className=""/>
        </div>
    </>
  )
}

export default Header