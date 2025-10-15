"use client"

import { LoginCard } from "@/components/organism"
import Image from "next/image"

export default function LoginTemplate() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-tr from-black via-transparent to-green-900">
      <div className="w-full p-6 flex justify-end ">
        <Image 
          src="/svg/logo.svg" 
          alt="Logo"
          width={80}
          height={20}
          className="object-contain"
        />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          <LoginCard/>
        </div>
      </div>
    </div>
  )
}