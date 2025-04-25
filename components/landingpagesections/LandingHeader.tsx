import React from 'react'
import Image from 'next/image'
import PrivyButton from '../custom/PrivyButton'

const LandingHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1">
      <div className="justify-between h-16 flex px-8 py-4">
        <div className="flex items-center gap-2">
          <Image src={"/logo.svg"} width={50} height={50} alt='Nitro Logo'/>
          <span className="text-xl font-bold">Nitro</span>
        </div>
        <div className="flex gap-x-4">
            <PrivyButton/>
        </div>
      </div>
    </header>
  )
}

export default LandingHeader