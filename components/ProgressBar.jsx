export default function ProgressBar({ value, max, label }) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100)
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="text-slate-200 font-semibold">{value.toFixed(1)} / {max} kg CO2e ({percentage}%)</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={parseFloat(value.toFixed(1))}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        tabIndex={0}
        className="w-full bg-slate-800 h-4 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all"
      >
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
