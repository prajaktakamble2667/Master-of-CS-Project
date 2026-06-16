import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/sql-js";
import initSqlJs from "sql.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Schema
export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role", { enum: ["patient", "admin"] }).notNull().default("patient"),
});

export const sessionsTable = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id"),
  userName: text("user_name"),
  patientName: text("patient_name"),
  result: text("result", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Database connection
const dbPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "data.db"
);

let fileBuffer;
try {
  fileBuffer = fs.readFileSync(dbPath);
} catch (e) {
  fileBuffer = null;
}

const SQL = await initSqlJs();
const sqlite = new SQL.Database(fileBuffer ? fileBuffer : undefined);

// Create tables if they don't exist
sqlite.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient'
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_name TEXT,
    patient_name TEXT,
    result TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
`);

if (!fileBuffer) {
  const data = sqlite.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

// Since sql.js is in memory, we need to manually persist when Drizzle makes changes.
// We intercept the Drizzle setup by saving on exit or periodially, or we use standard sqlite.
// A simpler robust local db without native compiling is SQLite3 but we tried it.
export const db = drizzle(sqlite);
