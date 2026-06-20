import { Sparkles, Bike, Utensils, Zap, Check } from "lucide-react"

export default function InsightCard({ title, description, potentialSavingKg, difficulty, category, isCommitted, onToggleCommit }) {
  const categoryIcon = () => {
    switch (category) {
      case "transport":
        return <Bike className="w-5 h-5 text-sky-400" />
      case "diet":
        return <Utensils className="w-5 h-5 text-emerald-400" />
      case "electricity":
        return <Zap className="w-5 h-5 text-yellow-400" />
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />
    }
  }
  const difficultyBadgeColor = () => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20"
      case "hard":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20"
      default:
        return "bg-slate-800 text-slate-400 border-slate-700"
    }
  }
  return (
    <article className={`glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all duration-300 group ${
      isCommitted ? "border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.08)] bg-emerald-950/5" : ""
    }`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div 
            className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center animate-float group-hover:scale-110 group-hover:rotate-12 group-hover:border-emerald-500/30 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all duration-300"
            style={{ animationDuration: "4s" }}
          >
            {categoryIcon()}
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyBadgeColor()}`}>
            {difficulty}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-100 transition-colors group-hover:text-emerald-400 duration-300">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="pt-4 border-t border-slate-800 space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 uppercase tracking-wider font-semibold">Potential Saving</span>
          <span className="text-emerald-400 font-bold text-sm">{potentialSavingKg} kg CO2e</span>
        </div>
        
        <button
          onClick={onToggleCommit}
          className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] ${
            isCommitted
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:bg-emerald-500/20"
              : "bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-slate-100 hover:border-slate-700"
          }`}
        >
          {isCommitted ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 animate-[scaleIn_0.2s_ease-out]" />
              <span>Committed!</span>
            </>
          ) : (
            <span>Commit to Task</span>
          )}
        </button>
      </div>
    </article>
  )
}

