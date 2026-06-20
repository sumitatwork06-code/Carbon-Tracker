import { NextResponse } from "next/server"
import { validateLogInput, sanitizeInput } from "@/lib/validators"
import { calculateDailyTotal } from "@/lib/carbonEngine"
import { insertLog, deleteLog } from "@/lib/db"

export async function POST(request) {
  try {
    const body = await request.json()
    const errors = []
    if (!body) {
      return NextResponse.json({ success: false, errors: ["Request body is missing"] }, { status: 400 })
    }
    if (typeof body.user_id !== "string" || !body.user_id.trim()) {
      errors.push("user_id is required")
    }
    if (typeof body.date !== "string" || !body.date.trim()) {
      errors.push("date is required")
    }
    const validation = validateLogInput(body)
    if (!validation.valid) {
      errors.push(...validation.errors)
    }
    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }
    const sanitizedData = {
      user_id: sanitizeInput(body.user_id),
      date: sanitizeInput(body.date),
      transport_km: body.transport_km,
      transport_mode: sanitizeInput(body.transport_mode),
      diet: sanitizeInput(body.diet),
      electricity_kwh: body.electricity_kwh
    }
    const emissions = calculateDailyTotal(
      sanitizedData.transport_km,
      sanitizedData.transport_mode,
      sanitizedData.diet,
      sanitizedData.electricity_kwh
    )
    const logId = insertLog(sanitizedData)
    return NextResponse.json({
      success: true,
      data: {
        id: logId,
        ...sanitizedData,
        emissions
      }
    })
  } catch (err) {
    return NextResponse.json({ success: false, errors: [err.message] }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const idStr = searchParams.get("id")
    if (!idStr) {
      return NextResponse.json({ success: false, errors: ["log ID is required"] }, { status: 400 })
    }
    const id = parseInt(idStr, 10)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, errors: ["Invalid log ID"] }, { status: 400 })
    }
    const deleted = deleteLog(id)
    if (deleted) {
      return NextResponse.json({ success: true, message: `Log ${id} successfully deleted` })
    } else {
      return NextResponse.json({ success: false, errors: ["Log entry not found"] }, { status: 404 })
    }
  } catch (err) {
    return NextResponse.json({ success: false, errors: [err.message] }, { status: 500 })
  }
}
