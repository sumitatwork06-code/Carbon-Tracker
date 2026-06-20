"use client"

import { useEffect, useState } from "react"
import EmissionsChart from "@/components/EmissionsChart"
import ProgressBar from "@/components/ProgressBar"
import { TrendingDown, Calendar, AlertCircle, ShieldAlert, Sparkles, Leaf, Trash2 } from "lucide-react"
import { calculateDailyTotal } from "@/lib/carbonEngine"
import CarbonMolecule from "@/components/CarbonMolecule"
import Image from "next/image"

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [displayToday, setDisplayToday] = useState(0)
  const [displayThisWeek, setDisplayThisWeek] = useState(0)
  const [displayComparison, setDisplayComparison] = useState(0)
  const [bgSrc, setBgSrc] = useState("/images/atmosphere.webp")

  // Target limit and simulator state hooks
  const [targetGoal, setTargetGoal] = useState(50)
  const [simTransportKm, setSimTransportKm] = useState(20)
  const [simTransportMode, setSimTransportMode] = useState("car")
  const [simDiet, setSimDiet] = useState("omnivore")
  const [simElectricityKwh, setSimElectricityKwh] = useState(10)

  // Fetch data function extracted to component scope
  const fetchData = async () => {
    try {
      const today = new Date()
      const resThisWeek = await fetch("/api/history")
      if (!resThisWeek.ok) {
        throw new Error("Failed to load emissions history")
      }
      const jsonThisWeek = await resThisWeek.json()

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(today.getDate() - 7)
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0]

      const fourteenDaysAgo = new Date()
      fourteenDaysAgo.setDate(today.getDate() - 14)
      const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().split("T")[0]

      const eightDaysAgo = new Date()
      eightDaysAgo.setDate(today.getDate() - 8)
      const eightDaysAgoStr = eightDaysAgo.toISOString().split("T")[0]

      const resLastWeek = await fetch(`/api/history?startDate=${fourteenDaysAgoStr}&endDate=${eightDaysAgoStr}`)
      if (!resLastWeek.ok) {
        throw new Error("Failed to load last week's emissions history")
      }
      const jsonLastWeek = await resLastWeek.json()

      setData({
        thisWeek: jsonThisWeek,
        lastWeek: jsonLastWeek
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Load targetGoal from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ecolife_target_goal")
      if (stored) {
        setTargetGoal(parseFloat(stored))
      }
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setBgSrc("/images/atmosphere-mobile.webp")
      } else {
        setBgSrc("/images/atmosphere.webp")
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!data) return

    const duration = 800
    let startTime = null
    let animationFrameId = null

    const logs = data.thisWeek?.logs || []
    const aggregate = data.thisWeek?.aggregate || { totalEmissions: 0, avgDaily: 0 }
    const lastWeekAggregate = data.lastWeek?.aggregate || null

    let targetToday = 0
    if (logs.length > 0) {
      const todayLog = logs[0]
      const dailyTotal = calculateDailyTotal(
        todayLog.transport_km,
        todayLog.transport_mode,
        todayLog.diet,
        todayLog.electricity_kwh
      )
      targetToday = dailyTotal.total
    }
    const targetThisWeek = aggregate.totalEmissions
    const targetLastWeek = lastWeekAggregate?.totalEmissions || 0

    const hasLastWeekData = data.lastWeek?.logs && data.lastWeek.logs.length > 0
    let targetComparison = 0
    if (hasLastWeekData) {
      if (targetLastWeek > 0) {
        targetComparison = parseFloat((((targetThisWeek - targetLastWeek) / targetLastWeek) * 100).toFixed(1))
      } else if (targetThisWeek > 0) {
        targetComparison = 100
      }
    }

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const progressPercentage = Math.min(progress / duration, 1)

      setDisplayToday(targetToday * progressPercentage)
      setDisplayThisWeek(targetThisWeek * progressPercentage)
      setDisplayComparison(targetComparison * progressPercentage)

      if (progressPercentage < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setDisplayToday(targetToday)
        setDisplayThisWeek(targetThisWeek)
        setDisplayComparison(targetComparison)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [data])

  useEffect(() => {
    fetchData()
  }, [])

  const handleTargetGoalChange = (val) => {
    setTargetGoal(val)
    if (typeof window !== "undefined") {
      localStorage.setItem("ecolife_target_goal", val.toString())
    }
  }

  const handleDeleteLog = async (id) => {
    if (!confirm("Are you sure you want to delete this activity log?")) return
    try {
      const res = await fetch(`/api/log?id=${id}`, {
        method: "DELETE"
      })
      if (!res.ok) {
        throw new Error("Failed to delete the log entry.")
      }
      const resData = await res.json()
      if (resData.success) {
        await fetchData()
      } else {
        alert(resData.errors ? resData.errors.join(", ") : "Failed to delete.")
      }
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Loading dashboard metrics...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-rose-400 gap-2">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    )
  }

  const logs = data?.thisWeek?.logs || []
  const aggregate = data?.thisWeek?.aggregate || { totalEmissions: 0, avgDaily: 0 }
  const lastWeekAggregate = data?.lastWeek?.aggregate || null

  let todayEmissions = 0
  if (logs.length > 0) {
    const todayLog = logs[0]
    const dailyTotal = calculateDailyTotal(
      todayLog.transport_km,
      todayLog.transport_mode,
      todayLog.diet,
      todayLog.electricity_kwh
    )
    todayEmissions = dailyTotal.total
  }
  const thisWeekTotal = aggregate.totalEmissions
  const lastWeekTotal = lastWeekAggregate?.totalEmissions || 0
  
  const hasLastWeekData = data?.lastWeek?.logs && data.lastWeek.logs.length > 0
  let comparison = 0
  if (hasLastWeekData) {
    if (lastWeekTotal > 0) {
      comparison = parseFloat((((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100).toFixed(1))
    } else if (thisWeekTotal > 0) {
      comparison = 100
    }
  }

  const treeEquivalents = (thisWeekTotal / (22 / 52)).toFixed(1)

  // Calculate real-time simulator values
  const simEmissions = calculateDailyTotal(
    simTransportKm,
    simTransportMode,
    simDiet,
    simElectricityKwh
  )

  return (
    <div className="relative min-h-screen space-y-8 py-8 px-4 sm:px-6">
      {/* Subtle Atmosphere Fixed Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none select-none opacity-[0.05]">
        <Image
          src={bgSrc}
          alt="Atmosphere background"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover object-center fixed"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
            Ecosystem Dashboard
          </h1>
          <p className="text-slate-400 text-sm">Real-time mapping of your carbon production and forestry offset equivalents.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 border border-slate-800/80 rounded-xl text-slate-300 text-xs font-semibold backdrop-blur-sm">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Last 7 Days</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm space-y-2 hover:border-slate-700/80 transition-colors animate-count-up"
          style={{ animationDelay: "0ms" }}
        >
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today</h3>
          <p className="text-3xl font-extrabold text-slate-100">{displayToday.toFixed(1)} <span className="text-sm font-normal text-slate-400">kg CO2e</span></p>
          <p className="text-xs text-slate-500">Based on most recent activity log</p>
        </div>
        <div
          className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm space-y-2 hover:border-slate-700/80 transition-colors animate-count-up"
          style={{ animationDelay: "100ms" }}
        >
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">This Week</h3>
          <p className="text-3xl font-extrabold text-emerald-400">{displayThisWeek.toFixed(1)} <span className="text-sm font-normal text-slate-400">kg CO2e</span></p>
          <p className="text-xs text-slate-500">Total footprint over last 7 days</p>
        </div>
        <div
          className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm space-y-2 hover:border-slate-700/80 transition-colors animate-count-up"
          style={{ animationDelay: "200ms" }}
        >
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">vs Last Week</h3>
          <div className="flex items-center gap-2">
            {hasLastWeekData ? (
              <>
                <span className={`text-3xl font-extrabold ${displayComparison <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {displayComparison > 0 ? `+${displayComparison.toFixed(1)}%` : `${displayComparison.toFixed(1)}%`}
                </span>
                {comparison !== 0 && <TrendingDown className="w-5 h-5 text-emerald-400" />}
              </>
            ) : (
              <span className="text-3xl font-extrabold text-slate-400">No prior data</span>
            )}
          </div>
          <p className="text-xs text-slate-500">Performance relative to preceding week</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm">
          <h2 className="text-lg font-bold text-slate-100 mb-6">Emissions Trend</h2>
          <EmissionsChart data={logs} />
        </div>
        
        <div className="space-y-8">
          {/* Target Slider Card */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-100">Weekly Target Progress</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adjust the goal slider below to set a custom carbon footprint limit.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Adjust Target Limit:</span>
                <span className="text-emerald-400 font-bold text-sm">{targetGoal.toFixed(0)} kg CO2e</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                value={targetGoal}
                onChange={(e) => handleTargetGoalChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all duration-200"
              />
            </div>
            
            <ProgressBar value={thisWeekTotal} max={targetGoal} label="Weekly emissions target progress" />
          </div>

          {/* Eco-Impact Simulator Card */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-slate-100">Eco-Impact Simulator</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulate daily habits to calculate emissions and tree offset equivalency instantly.
            </p>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium flex justify-between">
                  <span>Transport Mode & Distance:</span>
                  <span className="text-slate-200">{simTransportKm} km</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={simTransportMode}
                    onChange={(e) => setSimTransportMode(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="car">🚗 Car</option>
                    <option value="bus">🚌 Bus</option>
                    <option value="train">🚆 Train</option>
                    <option value="bike">🚲 Bike</option>
                    <option value="walk">🚶 Walk</option>
                  </select>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    value={simTransportKm}
                    onChange={(e) => setSimTransportKm(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 my-auto bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium flex justify-between">
                  <span>Electricity Usage:</span>
                  <span className="text-slate-200">{simElectricityKwh} kWh</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simElectricityKwh}
                  onChange={(e) => setSimElectricityKwh(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium block">Diet Type:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["omnivore", "vegetarian", "vegan"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSimDiet(d)}
                      className={`py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                        simDiet === d
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(34,211,238,0.15)]"
                          : "bg-slate-950 text-slate-400 border-slate-850 hover:text-slate-200 hover:border-slate-850"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Daily Total</span>
                <p className="text-sm font-bold text-slate-200">{simEmissions.total.toFixed(1)} <span className="text-[10px] text-slate-400">kg</span></p>
              </div>
              <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Weekly Offset</span>
                <p className="text-sm font-bold text-cyan-400">{(simEmissions.total / (22 / 52)).toFixed(1)} <span className="text-[10px] text-slate-400">trees</span></p>
              </div>
            </div>
          </div>

          {/* Forestry Equivalents Card */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <Leaf className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <h2 className="text-lg font-bold text-slate-100">Forestry Equivalents</h2>
              </div>
              <CarbonMolecule size={48} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              An average mature tree absorbs about 22kg of CO2 per year (approx. 0.42kg/week). 
            </p>
            <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-xl space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Weekly Offset Capacity</span>
              <p className="text-lg font-bold text-slate-200">{treeEquivalents} <span className="text-xs text-emerald-400 font-medium">mature trees</span></p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your weekly emissions require the total absorption capacity of {treeEquivalents} mature trees to be fully balanced.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Table Card */}
      <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-100">Recent Activity Logs</h2>
          <span className="text-xs text-slate-500 font-medium">Logged Days: {logs.length}</span>
        </div>
        
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No logs registered. Log your carbon activities on the log page.</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Transport</th>
                  <th className="py-3 px-4">Diet</th>
                  <th className="py-3 px-4">Electricity</th>
                  <th className="py-3 px-4">Total Emissions</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60">
                {logs.map((log) => {
                  const dailyTotal = calculateDailyTotal(
                    log.transport_km,
                    log.transport_mode,
                    log.diet,
                    log.electricity_kwh
                  )
                  return (
                    <tr key={log.id} className="hover:bg-slate-900/10 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-300">{log.date}</td>
                      <td className="py-3.5 px-4 text-slate-400 capitalize">
                        {log.transport_km} km ({log.transport_mode})
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 capitalize">{log.diet}</td>
                      <td className="py-3.5 px-4 text-slate-400">{log.electricity_kwh} kWh</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-semibold">{dailyTotal.total.toFixed(1)} kg</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg hover:scale-105 active:scale-95 transition-all"
                          title="Delete Log Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

