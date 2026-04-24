import Database from "better-sqlite3";

const db = new Database("database_address_book.db");

// 1. Enable Foreign Keys & WAL Mode (WAL makes it faster!)
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

// 2. Setup Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS Contact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phoneNumber TEXT UNIQUE,
    company TEXT,
    email TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS Groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    groupName TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS GroupContact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contactId INTEGER,
    groupId INTEGER,
    FOREIGN KEY (contactId) REFERENCES Contact (id) ON DELETE CASCADE, 
    FOREIGN KEY (groupId) REFERENCES Groups (id) ON DELETE CASCADE
  );
`);

export default db;
