import { NextResponse } from "next/server"
import { getWeeklyLogs, getLogsByDateRange } from "@/lib/db"
import { calculateWeeklyAggregate } from "@/lib/carbonEngine"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    let logs
    if (startDate && endDate) {
      logs = getLogsByDateRange(startDate, endDate)
    } else {
      logs = getWeeklyLogs()
    }
    const aggregate = calculateWeeklyAggregate(logs)
    return NextResponse.json({ aggregate, logs })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
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
