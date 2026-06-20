"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import InsightCard from "@/components/InsightCard"
import { AlertCircle, Sparkles, RotateCw } from "lucide-react"

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null)
  
  const faqs = [
    {
      q: "What is CO2e?",
      a: "CO2e (Carbon Dioxide Equivalent) is a standard unit for measuring carbon footprints. It aggregates the impact of different greenhouse gases (like methane and nitrous oxide) into a single metric representing the amount of CO2 that would cause the same global warming effect."
    },
    {
      q: "How does diet affect emissions?",
      a: "Diet plays a major role in your footprint. Animal-based food production (meat, dairy) requires vast amounts of land and water, and produces methane. A vegan or vegetarian diet typically cuts dietary emissions in half compared to an omnivorous diet."
    },
    {
      q: "Why is the target set to 50kg?",
      a: "50kg CO2e per week is a target designed to help users transition toward a sustainable individual carbon footprint. It aligns with long-term international environmental benchmarks to reduce average per-capita emissions."
    },
    {
      q: "How are tree offset equivalents calculated?",
      a: "A mature tree absorbs about 22kg of CO2 per year, which translates to roughly 0.42kg per week. Your tree equivalent displays the total annual absorption capacity needed from mature trees to fully balance your weekly emissions."
    }
  ]

  return (
    <div className="space-y-4 max-w-3xl mx-auto pt-12 border-t border-slate-800/85">
      <h2 className="text-2xl font-bold text-slate-100 text-center mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div key={idx} className="glass-panel rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-4 flex justify-between items-center text-left text-sm font-semibold text-slate-200 hover:text-slate-100 hover:bg-slate-900/10 transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className={`text-emerald-400 font-bold transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>＋</span>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-40 border-t border-slate-850 p-6 bg-slate-950/20' : 'max-h-0'
                }`}
              >
                <p className="text-slate-400 text-xs leading-relaxed">{faq.a}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function InsightsPage() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bgSrc, setBgSrc] = useState("/images/mist-forest.webp")
  
  const [committedTasks, setCommittedTasks] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeDifficulty, setActiveDifficulty] = useState("all")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ecolife_committed_tasks")
      if (stored) {
        try {
          setCommittedTasks(JSON.parse(stored))
        } catch (e) {
          console.error("Failed to parse committed tasks from localStorage", e)
        }
      }
    }
  }, [])

  const fetchFreshInsights = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/insights")
      if (!res.ok) {
        throw new Error("Failed to load AI insights from Gemini")
      }
      const data = await res.json()
      setInsights(data.insights)
      
      if (typeof window !== "undefined" && data.signature) {
        localStorage.setItem("ecolife_cached_insights", JSON.stringify(data.insights))
        localStorage.setItem("ecolife_insights_signature", data.signature)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function loadInsights() {
      if (typeof window === "undefined") return
      
      const cachedInsights = localStorage.getItem("ecolife_cached_insights")
      const cachedSig = localStorage.getItem("ecolife_insights_signature")
      
      try {
        const sigRes = await fetch("/api/insights?sigOnly=true")
        if (sigRes.ok) {
          const { signature } = await sigRes.json()
          if (cachedInsights && cachedSig === signature) {
            setInsights(JSON.parse(cachedInsights))
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn("Failed to verify log signature, falling back to full fetch:", err)
      }
      
      await fetchFreshInsights()
    }
    loadInsights()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setBgSrc("/images/mist-forest-mobile.webp")
      } else {
        setBgSrc("/images/mist-forest.webp")
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleRegenerate = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ecolife_cached_insights")
      localStorage.removeItem("ecolife_insights_signature")
    }
    await fetchFreshInsights()
  }

  const handleToggleCommit = (title) => {
    let updated
    if (committedTasks.includes(title)) {
      updated = committedTasks.filter(t => t !== title)
    } else {
      updated = [...committedTasks, title]
    }
    setCommittedTasks(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("ecolife_committed_tasks", JSON.stringify(updated))
    }
  }

  const totalSavings = insights.reduce((acc, curr) => acc + (Number(curr.potentialSavingKg) || 0), 0)
  const easyCount = insights.filter(i => i.difficulty === "easy").length
  const mediumCount = insights.filter(i => i.difficulty === "medium").length
  const hardCount = insights.filter(i => i.difficulty === "hard").length

  const sortedInsights = [...insights].sort((a, b) => (Number(b.potentialSavingKg) || 0) - (Number(a.potentialSavingKg) || 0))

  const filteredInsights = sortedInsights.filter(insight => {
    const matchesCategory = activeCategory === "all" || insight.category === activeCategory
    const matchesDifficulty = activeDifficulty === "all" || insight.difficulty === activeDifficulty
    return matchesCategory && matchesDifficulty
  })

  return (
    <div className="relative min-h-[85vh] py-8 px-4 sm:px-6 space-y-12">
      <div className="absolute inset-0 -z-20 pointer-events-none select-none opacity-[0.1] blur-[2px]">
        <Image
          src={bgSrc}
          alt="Misty forest background"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      
      <div className="absolute inset-0 bg-slate-950/30 -z-10 pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-100 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
              AI Insights
            </h1>
            <p className="text-slate-400 max-w-lg leading-relaxed text-sm">
              Personalized advice curated by AI to help you reduce your transport, dietary, and energy footprints.
            </p>
          </div>
          
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/30 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50"
            title="Regenerate Insights"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Regenerating..." : "Refresh Insights"}</span>
          </button>
        </div>

        {loading && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 p-4 glass-panel rounded-2xl animate-pulse text-center">
              {[1, 2, 3, 4, 5].map(id => (
                <div key={id} className={`space-y-2 ${id === 1 ? "col-span-2 md:col-span-1" : ""}`}>
                  <div className="w-2/3 h-3 bg-slate-800 rounded mx-auto" />
                  <div className="w-1/2 h-6 bg-slate-800 rounded mx-auto" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((id) => (
                <div key={id} className="glass-panel p-6 rounded-2xl animate-pulse space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg" />
                    <div className="w-16 h-5 bg-slate-800 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <div className="w-3/4 h-5 bg-slate-800 rounded" />
                    <div className="w-full h-4 bg-slate-800 rounded" />
                    <div className="w-5/6 h-4 bg-slate-800 rounded" />
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                    <div className="w-1/3 h-4 bg-slate-800 rounded" />
                    <div className="w-12 h-4 bg-slate-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-100">Failed to Load Insights</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && insights.length === 0 && (
          <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-emerald-400 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-100">No Insights Available</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log your daily activities in the logger to help Gemini generate customized saving strategies.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && insights.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 p-4 glass-panel rounded-2xl text-center">
              <div className="col-span-2 md:col-span-1">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Potential Saving</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{totalSavings.toFixed(1)} kg</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Committed Tasks</span>
                <p className="text-2xl font-bold text-teal-400 mt-1">{committedTasks.length}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Easy Tasks</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{easyCount}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Medium Tasks</span>
                <p className="text-2xl font-bold text-amber-400 mt-1">{mediumCount}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Hard Tasks</span>
                <p className="text-2xl font-bold text-rose-400 mt-1">{hardCount}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 glass-panel rounded-2xl">
              <div className="space-y-2">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Filter by Category</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "All Categories" },
                    { id: "transport", label: "Transport 🚗" },
                    { id: "diet", label: "Diet 🥗" },
                    { id: "electricity", label: "Energy ⚡" }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                        activeCategory === cat.id
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                          : "bg-slate-900/40 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Filter by Difficulty</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "All Levels" },
                    { id: "easy", label: "Easy 🟢" },
                    { id: "medium", label: "Medium 🟡" },
                    { id: "hard", label: "Hard 🔴" }
                  ].map(diff => (
                    <button
                      key={diff.id}
                      onClick={() => setActiveDifficulty(diff.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                        activeDifficulty === diff.id
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                          : "bg-slate-900/40 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredInsights.length === 0 ? (
              <div className="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-xl mx-auto col-span-full">
                <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-amber-400 mx-auto">
                  <AlertCircle className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-100">No Matching Insights</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Try adjusting your category or difficulty filters to see more recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredInsights.map((insight, idx) => (
                  <InsightCard
                    key={idx}
                    title={insight.title}
                    description={insight.description}
                    potentialSavingKg={insight.potentialSavingKg}
                    difficulty={insight.difficulty}
                    category={insight.category}
                    isCommitted={committedTasks.includes(insight.title)}
                    onToggleCommit={() => handleToggleCommit(insight.title)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && !error && <FAQAccordion />}
      </div>
    </div>
  )
}
