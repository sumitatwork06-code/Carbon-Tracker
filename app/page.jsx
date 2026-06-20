"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Activity, Cpu, Sparkles, Shield } from "lucide-react"

export default function Home() {
  const [heroSrc, setHeroSrc] = useState("/images/hero-forest.webp")
  const [featuresSrc, setFeaturesSrc] = useState("/images/leaves-detail.webp")
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setHeroSrc("/images/hero-forest-mobile.webp")
        setFeaturesSrc("/images/leaves-detail-mobile.webp")
      } else {
        setHeroSrc("/images/hero-forest.webp")
        setFeaturesSrc("/images/leaves-detail.webp")
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <main className="min-h-[80vh] flex flex-col justify-center space-y-24">
      {/* Hero Section Container */}
      <div className="relative overflow-hidden w-full py-12 px-4 sm:px-6 lg:px-8">
        {/* Parallax Background Layer */}
        <div 
          className="absolute inset-0 -z-20 w-full h-[135%] -top-[15%] pointer-events-none select-none"
          style={{ 
            transform: `translateY(${-offsetY * 0.3}px) scale(1.05)`,
            willChange: 'transform'
          }}
        >
          <Image
            src={heroSrc}
            alt="Lush green forest canopy background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/70 to-slate-950 -z-10 pointer-events-none select-none" />

        {/* Animated Mountain & Waterfall SVG Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.25] select-none" style={{ zIndex: -15 }}>
          <svg className="w-full h-full" viewBox="0 0 1440 600" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Mountains */}
            <path d="M 0 500 L 250 320 L 550 460 L 850 250 L 1150 480 L 1440 380 L 1440 600 L 0 600 Z" fill="url(#mountainGrad1)" opacity="0.4" />
            <path d="M 100 550 L 450 350 L 750 480 L 1050 300 L 1380 500 L 1440 450 L 1440 600 L 100 600 Z" fill="url(#mountainGrad2)" opacity="0.6" />
            
            {/* Waterfall Structure */}
            <path d="M 740 465 L 740 600 L 760 600 L 760 465 Z" fill="url(#waterfallGrad)" />
            
            {/* Animated water flow lines using dashoffset */}
            <line x1="745" y1="465" x2="745" y2="600" stroke="#22d3ee" strokeWidth="2" strokeDasharray="12, 18" strokeDashoffset="0" className="animate-waterfall" />
            <line x1="755" y1="465" x2="755" y2="600" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="16, 22" strokeDashoffset="5" className="animate-waterfall" />
            <line x1="750" y1="465" x2="750" y2="600" stroke="#e0f2fe" strokeWidth="1.5" strokeDasharray="8, 12" strokeDashoffset="2" className="animate-waterfall-fast" />
            
            {/* Waterfall splash at the bottom */}
            <ellipse cx="750" cy="595" rx="35" ry="8" fill="#22d3ee" opacity="0.3" className="animate-pulse" />
            
            <defs>
              <linearGradient id="mountainGrad1" x1="720" y1="250" x2="720" y2="600" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#022c22" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="mountainGrad2" x1="770" y1="300" x2="770" y2="600" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#065f46" />
                <stop offset="100%" stopColor="#022c22" />
              </linearGradient>
              <linearGradient id="waterfallGrad" x1="750" y1="465" x2="750" y2="600" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <section className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Preserve Our Atmosphere</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none text-slate-100">
              Track Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">Carbon Footprint</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Every breath we take connects us to nature. Log transport, diet, and energy factors to offset emissions, restore oxygen balance, and foster a cleaner ecosystem.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/log"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-100 font-bold rounded-xl shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Log Daily Footprint
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 border border-slate-800 hover:border-slate-600 bg-slate-900/20 hover:bg-slate-900/50 text-slate-300 hover:text-slate-100 font-semibold rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                View Dashboard
              </Link>
            </div>
          </div>
          <div className="relative group">
            {/* Subtle pulse-glow ring effect on hover, layered behind the current group-hover gradient blur */}
            <div className="absolute -inset-3 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-emerald-500 animate-pulse-glow -z-10" />

            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] w-full">
              <Image
                src="/images/eco_nature_forest.png"
                alt="Lush green futuristic forest representing oxygen and carbon balance"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Features Section Container */}
      <div className="relative overflow-hidden w-full py-12 px-4 sm:px-6 lg:px-8">
        {/* Parallax Background Layer */}
        <div 
          className="absolute inset-0 -z-20 w-full h-[135%] -top-[15%] pointer-events-none select-none opacity-10 blur-sm"
          style={{ 
            transform: `translateY(${-offsetY * 0.15}px) scale(1.05)`,
            willChange: 'transform'
          }}
        >
          <Image
            src={featuresSrc}
            alt="Subtle leaves detail background"
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 -z-10 pointer-events-none select-none" />

        <section className="max-w-7xl mx-auto w-full space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">Our Environmental Core Features</h2>
            <p className="text-slate-400 text-sm">Balanced metrics designed to align consumer action with carbon offsets.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="glass-panel p-8 rounded-2xl space-y-4 hover:border-emerald-500/30 hover:bg-slate-900/40 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 animate-float" style={{ animationDuration: "4s" }}>
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Emission Logging</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Input transportation, diet types, and household energy parameters in seconds using our streamlined, accessible form.
              </p>
            </article>
            <article className="glass-panel p-8 rounded-2xl space-y-4 hover:border-teal-500/30 hover:bg-slate-900/40 transition-all duration-300">
              <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-center text-teal-400 animate-float" style={{ animationDuration: "4s" }}>
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Pattern Analytics</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Track your weekly habits through visually rich charts comparing daily scores to our default 50kg limit.
              </p>
            </article>
            <article className="glass-panel p-8 rounded-2xl space-y-4 hover:border-cyan-500/30 hover:bg-slate-900/40 transition-all duration-300">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 animate-float" style={{ animationDuration: "4s" }}>
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">AI Carbon Advisor</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Leverage Gemini Pro to receive three targeted, personalized insights focusing on cost savings and high efficiency.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}
