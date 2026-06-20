import { NextResponse } from "next/server"
import { getWeeklyLogs } from "@/lib/db"
import { GoogleGenAI } from "@google/genai"

const fallbackInsights = [
  {
    title: "Optimize Your Car Travel",
    description: "Your logs show frequent car usage. Consider carpooling or walking for trips under 2 km.",
    potentialSavingKg: 12.4,
    difficulty: "easy",
    category: "transport"
  },
  {
    title: "Introduce Meatless Days",
    description: "Switching to a vegetarian or vegan diet for just 2 days a week significantly reduces daily diet emissions.",
    potentialSavingKg: 6.8,
    difficulty: "medium",
    category: "diet"
  },
  {
    title: "Unplug Idle Devices",
    description: "Phantom electricity loads from plugged-in devices contribute up to 10% of household energy consumption.",
    potentialSavingKg: 3.5,
    difficulty: "easy",
    category: "electricity"
  }
]

export async function GET(request) {
  try {
    const logs = getWeeklyLogs()
    
    // Create an aggregated signature and summary
    let totalCarKm = 0
    let totalBusKm = 0
    let totalTrainKm = 0
    let totalBikeKm = 0
    let totalWalkKm = 0
    let dietTypes = { vegan: 0, vegetarian: 0, omnivore: 0 }
    let totalElectricityKwh = 0
    let logCount = logs.length

    logs.forEach(log => {
      totalElectricityKwh += log.electricity_kwh || 0
      if (log.diet && dietTypes[log.diet] !== undefined) {
        dietTypes[log.diet]++
      }
      const km = log.transport_km || 0
      if (log.transport_mode === "car") totalCarKm += km
      else if (log.transport_mode === "bus") totalBusKm += km
      else if (log.transport_mode === "train") totalTrainKm += km
      else if (log.transport_mode === "bike") totalBikeKm += km
      else if (log.transport_mode === "walk") totalWalkKm += km
    })

    const summaryText = `
Weekly Activity Summary:
- Number of logged days: ${logCount}
- Transport: Car: ${totalCarKm} km, Bus: ${totalBusKm} km, Train: ${totalTrainKm} km, Bike: ${totalBikeKm} km, Walk: ${totalWalkKm} km
- Diet Breakdown: Omnivore days: ${dietTypes.omnivore}, Vegetarian days: ${dietTypes.vegetarian}, Vegan days: ${dietTypes.vegan}
- Electricity Consumed: ${totalElectricityKwh} kWh
`

    // Simple signature to detect log changes
    const totalEmissionsEstimated = totalCarKm * 0.21 + totalBusKm * 0.089 + totalTrainKm * 0.041 + totalElectricityKwh * 0.233 + (dietTypes.omnivore * 7.19 + dietTypes.vegetarian * 3.81 + dietTypes.vegan * 2.89)
    const logSignature = `${logCount}_${totalEmissionsEstimated.toFixed(1)}`

    const { searchParams } = new URL(request.url)
    const sigOnly = searchParams.get("sigOnly") === "true"
    if (sigOnly) {
      return NextResponse.json({ signature: logSignature })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ insights: fallbackInsights, signature: logSignature })
    }

    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: summaryText,
      config: {
        systemInstruction: "You are a carbon footprint reduction expert. Analyze the weekly activity summary of the user and return exactly 3 highly personalized, actionable insights as a JSON array. Focus your calculations and advice on their main carbon producers (e.g. if they drive a lot of car km, suggest vehicle efficiency or carpooling; if they consume lots of electricity, focus on home energy). Do not suggest carpooling if they have 0 car km. Return exactly a JSON array of 3 elements, where each element has: { title, description, potentialSavingKg (as a float representing weekly CO2e savings in kg), difficulty: 'easy'|'medium'|'hard', category: 'transport'|'diet'|'electricity' }",
        responseMimeType: "application/json"
      }
    })

    const insights = JSON.parse(response.text)
    return NextResponse.json({ insights, signature: logSignature })
  } catch (err) {
    // Return fallback with an empty/default signature
    return NextResponse.json({ insights: fallbackInsights, signature: "fallback" })
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
