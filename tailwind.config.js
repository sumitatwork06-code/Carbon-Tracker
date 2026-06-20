module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        pulseGlow: {
          "0%, 100%": {
            opacity: "0.4",
            boxShadow: "0 0 15px 3px currentColor"
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 25px 8px currentColor"
          }
        },
        drift: {
          "0%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "100%": { transform: "translateX(20px) translateY(-30px) rotate(15deg)" }
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        co2Rise: {
          "0%": { opacity: "0", transform: "translateY(0) scale(0.8)" },
          "50%": { opacity: "0.6" },
          "100%": { opacity: "0", transform: "translateY(-120px) scale(1.2)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        drift: "drift 8s ease-in-out infinite alternate",
        "count-up": "countUp 0.6s ease-out forwards",
        "co2-rise": "co2Rise 4s ease-in infinite"
      }
    }
  },
  plugins: []
}
