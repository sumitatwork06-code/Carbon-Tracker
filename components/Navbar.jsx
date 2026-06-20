import Link from "next/link"
import { Leaf, LayoutDashboard, PenTool, Sparkles } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-400 hover:scale-105 transition-transform duration-200">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="tracking-tight text-slate-100">Carbon<span className="text-emerald-400">Track</span></span>
        </Link>
        <div className="flex gap-6">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-colors text-sm font-semibold">
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link href="/log" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-colors text-sm font-semibold">
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">Log</span>
          </Link>
          <Link href="/insights" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-colors text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Insights</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
