"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"
import { calculateDailyTotal } from "@/lib/carbonEngine"

const defaultData = [
  { date: "Mon", emissions: 0, transport: 0, diet: 0, electricity: 0 },
  { date: "Tue", emissions: 0, transport: 0, diet: 0, electricity: 0 },
  { date: "Wed", emissions: 0, transport: 0, diet: 0, electricity: 0 },
  { date: "Thu", emissions: 0, transport: 0, diet: 0, electricity: 0 },
  { date: "Fri", emissions: 0, transport: 0, diet: 0, electricity: 0 },
  { date: "Sat", emissions: 0, transport: 0, diet: 0, electricity: 0 },
  { date: "Sun", emissions: 0, transport: 0, diet: 0, electricity: 0 }
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-xl space-y-2 text-xs">
        <p className="text-slate-400 font-semibold mb-1">Date: {label}</p>
        <p className="text-emerald-400 font-bold text-sm">Total: {data.emissions.toFixed(1)} kg CO2e</p>
        <div className="pt-2 border-t border-slate-905 space-y-1 text-slate-400">
          <div className="flex justify-between gap-4">
            <span>🚗 Transport:</span>
            <span className="font-semibold text-slate-300">{data.transport.toFixed(1)} kg</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>🥗 Diet:</span>
            <span className="font-semibold text-slate-300">{data.diet.toFixed(1)} kg</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>⚡ Electricity:</span>
            <span className="font-semibold text-slate-300">{data.electricity.toFixed(1)} kg</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function EmissionsChart({ data }) {
  const chartData = data && data.length > 0
    ? (() => {
        const grouped = {}
        data.forEach(log => {
          const dateStr = log.date
          const dailyTotal = calculateDailyTotal(
            log.transport_km,
            log.transport_mode,
            log.diet,
            log.electricity_kwh
          )
          if (!grouped[dateStr]) {
            grouped[dateStr] = {
              emissions: 0,
              transport: 0,
              diet: 0,
              electricity: 0
            }
          }
          grouped[dateStr].emissions += dailyTotal.total
          grouped[dateStr].transport += dailyTotal.transport
          grouped[dateStr].diet += dailyTotal.diet
          grouped[dateStr].electricity += dailyTotal.electricity
        })

        return Object.keys(grouped)
          .sort((a, b) => a.localeCompare(b))
          .map(dateStr => ({
            date: dateStr.slice(5),
            emissions: parseFloat(grouped[dateStr].emissions.toFixed(2)),
            transport: parseFloat(grouped[dateStr].transport.toFixed(2)),
            diet: parseFloat(grouped[dateStr].diet.toFixed(2)),
            electricity: parseFloat(grouped[dateStr].electricity.toFixed(2))
          }))
      })()
    : defaultData

  return (
    <div className="w-full h-72" role="region" aria-label="Weekly carbon emissions area chart">
      {/* Screen reader only data representation */}
      <div className="sr-only">
        <h3>Weekly Carbon Emissions Data Table</h3>
        <table>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Emissions (kg CO2e)</th>
              <th scope="col">Transport (kg)</th>
              <th scope="col">Diet (kg)</th>
              <th scope="col">Electricity (kg)</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((d, index) => (
              <tr key={index}>
                <td>{d.date}</td>
                <td>{d.emissions} kg</td>
                <td>{d.transport} kg</td>
                <td>{d.diet} kg</td>
                <td>{d.electricity} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEmissions)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
