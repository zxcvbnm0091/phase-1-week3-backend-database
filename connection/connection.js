import Database from "better-sqlite3";

const db = new Database("database_address_book.db");

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS Contact (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        phoneNumber VARCHAR(255) UNIQUE,
        company TEXT,
        email VARCHAR(255) UNIQUE
    );

    CREATE TABLE IF NOT EXISTS Groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        groupName VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ContactGroup (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contactId INTEGER,
        groupId INTEGER,
        FOREIGN KEY (contactId) REFERENCES Contact (id) ON DELETE CASCADE,
        FOREIGN KEY (groupId) REFERENCES Groups (id) ON DELETE CASCADE
    );
`);

export default db;
