"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import LogForm from "@/components/LogForm"

export default function LogPage() {
  const [bgSrc, setBgSrc] = useState("/images/leaves-detail.webp")

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setBgSrc("/images/leaves-detail-mobile.webp")
      } else {
        setBgSrc("/images/leaves-detail.webp")
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="relative min-h-[85vh] py-8 px-4 sm:px-6">
      {/* Subtle nature background */}
      <div className="absolute inset-0 -z-20 pointer-events-none select-none opacity-[0.08] blur-[2px]">
        <Image
          src={bgSrc}
          alt="Leaves detail background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/30 -z-10 pointer-events-none select-none" />

      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-100 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
            Log Daily Activity
          </h1>
          <p className="text-slate-400 max-w-lg leading-relaxed text-sm">
            Log your primary environmental factors for today. We will calculate your aggregate carbon emissions in real-time.
          </p>
        </div>
        <div className="glass-panel p-8 rounded-2xl shadow-xl">
          <LogForm />
        </div>
      </div>
    </div>
  )
}
