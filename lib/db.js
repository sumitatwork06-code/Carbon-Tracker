import fs from "fs"
import path from "path"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
let db = null
let isMock = false
let mockDb = []
const mockFilePath = path.join(process.cwd(), "logs.json")

try {
  const Database = require("better-sqlite3")
  db = new Database("carbon.db")
  db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      transport_km REAL NOT NULL,
      transport_mode TEXT CHECK(transport_mode IN ('car', 'bus', 'bike', 'walk', 'train')) NOT NULL,
      diet TEXT CHECK(diet IN ('vegan', 'vegetarian', 'omnivore')) NOT NULL,
      electricity_kwh REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
} catch (err) {
  isMock = true
  console.warn("better-sqlite3 failed to load. Falling back to JSON file mock database.", err.message)
  if (fs.existsSync(mockFilePath)) {
    try {
      mockDb = JSON.parse(fs.readFileSync(mockFilePath, "utf8"))
    } catch (e) {
      mockDb = []
    }
  }
}

export function insertLog(data) {
  if (isMock) {
    const id = mockDb.length + 1
    const newLog = {
      id,
      user_id: data.user_id,
      date: data.date,
      transport_km: data.transport_km,
      transport_mode: data.transport_mode,
      diet: data.diet,
      electricity_kwh: data.electricity_kwh,
      created_at: new Date().toISOString()
    }
    mockDb.push(newLog)
    fs.writeFileSync(mockFilePath, JSON.stringify(mockDb, null, 2), "utf8")
    return id
  }
  const stmt = db.prepare(`
    INSERT INTO logs (user_id, date, transport_km, transport_mode, diet, electricity_kwh)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  const info = stmt.run(
    data.user_id,
    data.date,
    data.transport_km,
    data.transport_mode,
    data.diet,
    data.electricity_kwh
  )
  return info.lastInsertRowid
}

export function getLogsByDateRange(startDate, endDate) {
  if (isMock) {
    return mockDb
      .filter((log) => log.date >= startDate && log.date <= endDate)
      .sort((a, b) => b.date.localeCompare(a.date))
  }
  const stmt = db.prepare("SELECT * FROM logs WHERE date BETWEEN ? AND ? ORDER BY date DESC")
  return stmt.all(startDate, endDate)
}

export function getWeeklyLogs() {
  if (isMock) {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0]
    return mockDb
      .filter((log) => log.date >= sevenDaysAgoStr)
      .sort((a, b) => b.date.localeCompare(a.date))
  }
  const stmt = db.prepare("SELECT * FROM logs WHERE date >= date('now', '-7 days') ORDER BY date DESC")
  return stmt.all()
}

export function getLogById(id) {
  if (isMock) {
    return mockDb.find((log) => log.id === id) || null
  }
  const stmt = db.prepare("SELECT * FROM logs WHERE id = ?")
  return stmt.get(id)
}

export function deleteLog(id) {
  if (isMock) {
    const initialLength = mockDb.length
    mockDb = mockDb.filter((log) => log.id !== id)
    if (mockDb.length !== initialLength) {
      fs.writeFileSync(mockFilePath, JSON.stringify(mockDb, null, 2), "utf8")
      return true
    }
    return false
  }
  const stmt = db.prepare("DELETE FROM logs WHERE id = ?")
  const info = stmt.run(id)
  return info.changes > 0
}

export default db
