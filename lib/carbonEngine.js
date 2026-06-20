const TRANSPORT_FACTORS = {
  car: 0.21,
  bus: 0.089,
  train: 0.041,
  bike: 0,
  walk: 0
}

const DIET_FACTORS = {
  omnivore: 7.19,
  vegetarian: 3.81,
  vegan: 2.89
}

const ELECTRICITY_FACTOR = 0.233

export function calculateTransportEmission(km, mode) {
  if (typeof km !== "number" || isNaN(km) || km < 0) {
    throw new Error("Distance must be a non-negative number")
  }
  if (!TRANSPORT_FACTORS.hasOwnProperty(mode)) {
    throw new Error("Invalid transport mode")
  }
  return km * TRANSPORT_FACTORS[mode]
}

export function calculateDietEmission(diet) {
  if (!DIET_FACTORS.hasOwnProperty(diet)) {
    throw new Error("Invalid diet type")
  }
  return DIET_FACTORS[diet]
}

export function calculateElectricityEmission(kwh) {
  if (typeof kwh !== "number" || isNaN(kwh) || kwh < 0) {
    throw new Error("Electricity usage must be a non-negative number")
  }
  return kwh * ELECTRICITY_FACTOR
}

export function calculateDailyTotal(transport_km, transport_mode, diet, electricity_kwh) {
  const transport = calculateTransportEmission(transport_km, transport_mode)
  const dietVal = calculateDietEmission(diet)
  const electricity = calculateElectricityEmission(electricity_kwh)
  const total = transport + dietVal + electricity
  return {
    transport,
    diet: dietVal,
    electricity,
    total
  }
}

export function calculateWeeklyAggregate(logsArray) {
  if (!Array.isArray(logsArray)) {
    throw new Error("logsArray must be an array")
  }
  if (logsArray.length === 0) {
    return {
      totalEmissions: 0,
      avgDaily: 0,
      breakdown: { transport: 0, diet: 0, electricity: 0 },
      highestDay: null,
      lowestDay: null
    }
  }
  let totalTransport = 0
  let totalDiet = 0
  let totalElectricity = 0
  let maxEmissions = -Infinity
  let minEmissions = Infinity
  let highestDay = null
  let lowestDay = null
  for (const log of logsArray) {
    const dailyBreakdown = calculateDailyTotal(
      log.transport_km,
      log.transport_mode,
      log.diet,
      log.electricity_kwh
    )
    totalTransport += dailyBreakdown.transport
    totalDiet += dailyBreakdown.diet
    totalElectricity += dailyBreakdown.electricity
    if (dailyBreakdown.total > maxEmissions) {
      maxEmissions = dailyBreakdown.total
      highestDay = log.date
    }
    if (dailyBreakdown.total < minEmissions) {
      minEmissions = dailyBreakdown.total
      lowestDay = log.date
    }
  }
  const totalEmissions = totalTransport + totalDiet + totalElectricity
  const avgDaily = totalEmissions / logsArray.length
  return {
    totalEmissions,
    avgDaily,
    breakdown: {
      transport: totalTransport,
      diet: totalDiet,
      electricity: totalElectricity
    },
    highestDay,
    lowestDay
  }
}
