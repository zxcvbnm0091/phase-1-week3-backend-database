// Change this line
import sqlite3 from "sqlite3";

// Initialize the database
const db = new (sqlite3.verbose().Database)("./db/database.db", (error) => {
  if (error) {
    console.error("Connection failed", error.message);
  } else {
    console.log("Connected to SQLite!");
  }
});

// Run setup logic
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS absences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    phoneNumber VARCHAR UNIQUE NOT NULL,
    position VARCHAR)`)
});

// Export the instance
export default db;
