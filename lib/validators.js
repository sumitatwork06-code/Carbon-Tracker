export function validateLogInput(body) {
  const errors = []
  if (!body) {
    errors.push("Request body is missing")
    return { valid: false, errors }
  }
  const { transport_km, transport_mode, diet, electricity_kwh } = body
  if (typeof transport_km !== "number" || isNaN(transport_km) || transport_km <= 0 || transport_km > 1000) {
    errors.push("transport_km must be a positive number up to 1000")
  }
  const validModes = ["car", "bus", "bike", "walk", "train"]
  if (!validModes.includes(transport_mode)) {
    errors.push("Invalid transport_mode")
  }
  const validDiets = ["vegan", "vegetarian", "omnivore"]
  if (!validDiets.includes(diet)) {
    errors.push("Invalid diet type")
  }
  if (typeof electricity_kwh !== "number" || isNaN(electricity_kwh) || electricity_kwh < 0 || electricity_kwh > 10000) {
    errors.push("electricity_kwh must be a non-negative number up to 10000")
  }
  return {
    valid: errors.length === 0,
    errors
  }
}

export function sanitizeInput(value) {
  if (typeof value !== "string") {
    return ""
  }
  return value.replace(/<[^>]*>/g, "").trim()
}
