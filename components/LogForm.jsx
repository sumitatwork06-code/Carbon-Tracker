"use client"

import { useState } from "react"
import { Navigation, Truck, Utensils, Zap } from "lucide-react"

export default function LogForm() {
  const [distance, setDistance] = useState("")
  const [mode, setMode] = useState("car")
  const [diet, setDiet] = useState("omnivore")
  const [electricity, setElectricity] = useState("")
  const [status, setStatus] = useState({ type: null, message: "" })
  const [distanceError, setDistanceError] = useState("")
  const [electricityError, setElectricityError] = useState("")
  const [focusedField, setFocusedField] = useState("")

  const handleDistanceChange = (val) => {
    setDistance(val)
    if (val === "") {
      setDistanceError("")
      return
    }
    const num = parseFloat(val)
    if (isNaN(num) || num <= 0 || num > 1000) {
      setDistanceError("Please enter a distance between 0 and 1000 km.")
    } else {
      setDistanceError("")
    }
  }

  const handleElectricityChange = (val) => {
    setElectricity(val)
    if (val === "") {
      setElectricityError("")
      return
    }
    const num = parseFloat(val)
    if (isNaN(num) || num < 0 || num > 10000) {
      setElectricityError("Please enter an electricity usage between 0 and 10000 kWh.")
    } else {
      setElectricityError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const kmValue = parseFloat(distance)
    const kwhValue = parseFloat(electricity)
    
    let hasError = false
    if (distance === "" || isNaN(kmValue) || kmValue <= 0 || kmValue > 1000) {
      setDistanceError("Please enter a distance between 0 and 1000 km.")
      hasError = true
    }
    if (electricity === "" || isNaN(kwhValue) || kwhValue < 0 || kwhValue > 10000) {
      setElectricityError("Please enter an electricity usage between 0 and 10000 kWh.")
      hasError = true
    }

    if (hasError) {
      setStatus({ type: "error", message: "Please correct the errors in the form." })
      return
    }

    setStatus({ type: "loading", message: "Submitting daily log..." })

    const payload = {
      user_id: "default-user",
      date: new Date().toISOString().split("T")[0],
      transport_km: kmValue,
      transport_mode: mode,
      diet: diet,
      electricity_kwh: kwhValue
    }

    try {
      const response = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const result = await response.json()
      if (response.ok && result.success) {
        setStatus({ type: "success", message: "Log successfully submitted!" })
        setDistance("")
        setElectricity("")
      } else {
        const errorList = result.errors ? result.errors.join(", ") : "Unknown error occurred"
        setStatus({ type: "error", message: `Failed to submit: ${errorList}` })
      }
    } catch (err) {
      setStatus({ type: "error", message: `Connection error: ${err.message}` })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status.message && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-sm border font-medium transition-all ${
            status.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : status.type === "error"
              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
              : "bg-slate-800/80 text-slate-300 border-slate-700/80"
          }`}
        >
          {status.message}
        </div>
      )}
      
      {/* Distance Input */}
      <div className="space-y-2">
        <label htmlFor="distance-input" className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Navigation className={`w-4 h-4 transition-all duration-300 ${
            focusedField === "distance" 
              ? "text-emerald-400 scale-125 rotate-12 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" 
              : "text-emerald-400/80"
          }`} />
          <span>Distance traveled today (km)</span>
        </label>
        <div className="relative">
          <input
            id="distance-input"
            type="number"
            step="any"
            value={distance}
            onChange={(e) => handleDistanceChange(e.target.value)}
            onFocus={() => setFocusedField("distance")}
            onBlur={() => setFocusedField("")}
            aria-label="Distance traveled today in kilometers"
            aria-describedby={distanceError ? "distance-error-text" : "distance-desc"}
            aria-required="true"
            required
            className={`w-full pl-4 pr-12 py-3 bg-slate-950/80 border rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all text-sm ${
              distanceError 
                ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500" 
                : distance 
                ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500" 
                : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500"
            }`}
            placeholder="e.g. 15.5"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">KM</span>
        </div>
        {distanceError ? (
          <p id="distance-error-text" className="text-xs text-rose-400 mt-1 font-medium" role="alert">
            {distanceError}
          </p>
        ) : (
          <p id="distance-desc" className="text-xs text-slate-500">Allowed range: 0.1 to 1000 km</p>
        )}
      </div>

      {/* Transport Mode */}
      <div className="space-y-2">
        <label htmlFor="mode-select" className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Truck className={`w-4 h-4 transition-all duration-300 ${
            focusedField === "mode" 
              ? "text-emerald-400 scale-125 -rotate-12 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" 
              : "text-emerald-400/80"
          }`} />
          <span>Transport Mode</span>
        </label>
        <select
          id="mode-select"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          onFocus={() => setFocusedField("mode")}
          onBlur={() => setFocusedField("")}
          aria-label="Select mode of transport"
          aria-describedby="mode-desc"
          aria-required="true"
          required
          className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
        >
          <option value="car">Car</option>
          <option value="bus">Bus</option>
          <option value="bike">Bike</option>
          <option value="walk">Walk</option>
          <option value="train">Train</option>
        </select>
        <p id="mode-desc" className="text-xs text-slate-500">Your primary mode of transportation for today</p>
      </div>

      {/* Diet Type */}
      <div className="space-y-2">
        <label htmlFor="diet-select" className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Utensils className={`w-4 h-4 transition-all duration-300 ${
            focusedField === "diet" 
              ? "text-emerald-400 scale-125 rotate-6 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" 
              : "text-emerald-400/80"
          }`} />
          <span>Diet Type</span>
        </label>
        <select
          id="diet-select"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          onFocus={() => setFocusedField("diet")}
          onBlur={() => setFocusedField("")}
          aria-label="Select diet type"
          aria-describedby="diet-desc"
          aria-required="true"
          required
          className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
        >
          <option value="omnivore">Omnivore</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
        <p id="diet-desc" className="text-xs text-slate-500">Your primary dietary preference for today</p>
      </div>

      {/* Electricity Input */}
      <div className="space-y-2">
        <label htmlFor="electricity-input" className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Zap className={`w-4 h-4 transition-all duration-300 ${
            focusedField === "electricity" 
              ? "text-emerald-400 scale-125 -rotate-12 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" 
              : "text-emerald-400/80"
          }`} />
          <span>Electricity used (kWh)</span>
        </label>
        <div className="relative">
          <input
            id="electricity-input"
            type="number"
            step="any"
            value={electricity}
            onChange={(e) => handleElectricityChange(e.target.value)}
            onFocus={() => setFocusedField("electricity")}
            onBlur={() => setFocusedField("")}
            aria-label="Electricity used today in kilowatt hours"
            aria-describedby={electricityError ? "electricity-error-text" : "electricity-desc"}
            aria-required="true"
            required
            className={`w-full pl-4 pr-12 py-3 bg-slate-950/80 border rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all text-sm ${
              electricityError 
                ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500" 
                : electricity 
                ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500" 
                : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500"
            }`}
            placeholder="e.g. 4.2"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">KWH</span>
        </div>
        {electricityError ? (
          <p id="electricity-error-text" className="text-xs text-rose-400 mt-1 font-medium" role="alert">
            {electricityError}
          </p>
        ) : (
          <p id="electricity-desc" className="text-xs text-slate-500">Allowed range: 0 to 10000 kWh</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status.type === "loading"}
        aria-label="Submit daily carbon log"
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed rounded-xl font-bold text-slate-100 shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 text-sm flex items-center justify-center gap-2"
      >
        <span>Submit Daily Log</span>
      </button>
    </form>
  )
}
