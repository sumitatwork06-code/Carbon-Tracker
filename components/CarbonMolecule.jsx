import React from "react"

export default function CarbonMolecule({ size = 120 }) {
  return (
    <div
      role="img"
      aria-label="Carbon dioxide absorption and oxygen release visualization"
      style={{ width: size, height: size }}
      className="relative select-none pointer-events-none"
    >
      <svg
        viewBox="0 0 120 120"
        width="100%"
        height="100%"
        className="overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Carbon dioxide absorption and oxygen release visualization</title>

        {/* CO2 Molecule - Top Section */}
        {/* Double bonds for left O-C */}
        <line x1="30" y1="38" x2="60" y2="38" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <line x1="30" y1="42" x2="60" y2="42" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

        {/* Double bonds for right C-O */}
        <line x1="60" y1="38" x2="90" y2="38" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="42" x2="90" y2="42" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

        {/* Carbon Atom */}
        <circle cx="60" cy="40" r="12" className="fill-slate-600" />
        
        {/* Oxygen Atoms (rose-400 with low opacity) */}
        <circle cx="30" cy="40" r="8" className="fill-rose-400/30" />
        <circle cx="90" cy="40" r="8" className="fill-rose-400/30" />

        {/* Leaf Shape - Bottom Section */}
        {/* Stem */}
        <path d="M60,105 C60,110 58,114 55,116" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Leaf blade */}
        <path
          d="M60,65 C45,75 45,95 60,105 C75,95 75,75 60,65 Z"
          className="fill-emerald-400"
        />
        {/* Leaf vein */}
        <path d="M60,105 L60,70" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />

        {/* Oxygen Release Bubbles (teal-300, animate-co2-rise) */}
        {/* Bubble 1 */}
        <g className="animate-co2-rise" style={{ animationDelay: "0s" }}>
          <circle cx="60" cy="62" r="4" className="fill-teal-300" />
        </g>
        {/* Bubble 2 */}
        <g className="animate-co2-rise" style={{ animationDelay: "1.3s" }}>
          <circle cx="55" cy="64" r="3.5" className="fill-teal-300" />
        </g>
        {/* Bubble 3 */}
        <g className="animate-co2-rise" style={{ animationDelay: "2.6s" }}>
          <circle cx="65" cy="65" r="3" className="fill-teal-300" />
        </g>
      </svg>
    </div>
  )
}
