import { validateLogInput, sanitizeInput } from "../lib/validators"

jest.mock("../lib/db", () => ({
  insertLog: jest.fn(),
  getLogsByDateRange: jest.fn(),
  getWeeklyLogs: jest.fn(),
  getLogById: jest.fn()
}))

describe("validators", () => {
  describe("validateLogInput", () => {
    it("should return valid: true with valid data", () => {
      const body = {
        transport_km: 10,
        transport_mode: "car",
        diet: "vegan",
        electricity_kwh: 100
      }
      const result = validateLogInput(body)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
    it("should return errors array with negative km", () => {
      const body = {
        transport_km: -10,
        transport_mode: "car",
        diet: "vegan",
        electricity_kwh: 100
      }
      const result = validateLogInput(body)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
    it("should return errors with invalid transport_mode", () => {
      const body = {
        transport_km: 10,
        transport_mode: "rocket",
        diet: "vegan",
        electricity_kwh: 100
      }
      const result = validateLogInput(body)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
    it("should return errors with missing fields", () => {
      const body = {
        transport_km: 10
      }
      const result = validateLogInput(body)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })
  describe("sanitizeInput", () => {
    it("should strip HTML tags correctly", () => {
      expect(sanitizeInput("<p>hello</p>")).toBe("hello")
      expect(sanitizeInput("<div>test</div>")).toBe("test")
    })
    it("should trim whitespace", () => {
      expect(sanitizeInput("  hello  ")).toBe("hello")
    })
  })
})
