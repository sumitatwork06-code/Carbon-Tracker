import {
  calculateTransportEmission,
  calculateDietEmission,
  calculateElectricityEmission,
  calculateDailyTotal,
  calculateWeeklyAggregate
} from "../lib/carbonEngine"

jest.mock("../lib/db", () => ({
  insertLog: jest.fn(),
  getLogsByDateRange: jest.fn(),
  getWeeklyLogs: jest.fn(),
  getLogById: jest.fn()
}))

describe("carbonEngine", () => {
  describe("calculateTransportEmission", () => {
    it("should calculate correct emission for car", () => {
      expect(calculateTransportEmission(10, "car")).toBeCloseTo(2.1)
    })
    it("should calculate correct emission for bike", () => {
      expect(calculateTransportEmission(10, "bike")).toBe(0)
    })
    it("should throw error for negative distance", () => {
      expect(() => calculateTransportEmission(-5, "car")).toThrow()
    })
    it("should throw error for invalid transport mode", () => {
      expect(() => calculateTransportEmission(10, "rocket")).toThrow()
    })
  })
  describe("calculateDietEmission", () => {
    it("should calculate correct emission for vegan diet", () => {
      expect(calculateDietEmission("vegan")).toBe(2.89)
    })
    it("should throw error for invalid diet type", () => {
      expect(() => calculateDietEmission("invalid")).toThrow()
    })
  })
  describe("calculateElectricityEmission", () => {
    it("should calculate correct emission for electricity usage", () => {
      expect(calculateElectricityEmission(100)).toBeCloseTo(23.3)
    })
    it("should throw error for negative usage", () => {
      expect(() => calculateElectricityEmission(-1)).toThrow()
    })
  })
  describe("calculateDailyTotal", () => {
    it("should return correct daily totals breakdown object", () => {
      const result = calculateDailyTotal(10, "car", "vegan", 100)
      expect(result).toEqual({
        transport: expect.any(Number),
        diet: expect.any(Number),
        electricity: expect.any(Number),
        total: expect.any(Number)
      })
      expect(result.transport).toBeCloseTo(2.1)
      expect(result.diet).toBe(2.89)
      expect(result.electricity).toBeCloseTo(23.3)
      expect(result.total).toBeCloseTo(2.1 + 2.89 + 23.3)
    })
  })
  describe("calculateWeeklyAggregate", () => {
    it("should calculate correct weekly aggregate summary", () => {
      const logs = [
        {
          date: "2026-06-15",
          transport_km: 10,
          transport_mode: "car",
          diet: "vegan",
          electricity_kwh: 100
        },
        {
          date: "2026-06-16",
          transport_km: 0,
          transport_mode: "walk",
          diet: "vegan",
          electricity_kwh: 0
        }
      ]
      const result = calculateWeeklyAggregate(logs)
      expect(result.totalEmissions).toBeCloseTo(2.1 + 2.89 + 23.3 + 0 + 2.89 + 0)
      expect(result.avgDaily).toBeCloseTo(result.totalEmissions / 2)
      expect(result.breakdown.transport).toBeCloseTo(2.1)
      expect(result.breakdown.diet).toBeCloseTo(5.78)
      expect(result.breakdown.electricity).toBeCloseTo(23.3)
      expect(result.highestDay).toBe("2026-06-15")
      expect(result.lowestDay).toBe("2026-06-16")
    })
  })
})
