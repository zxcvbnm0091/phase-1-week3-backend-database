import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function initDb() {
  // Open the database connection
  const db = await open({
    filename: "database_karyawan.db",
    driver: sqlite3.Database,
  });

  // Pass the 'db' instance to your logic function
  await runApp(db);

  await db.close();
  console.log("Koneksi ditutup.");
}

async function runApp(db) {
  try {
    // 1. Create Tables (Crucial: use await)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Karyawan (
        IDKaryawan INTEGER PRIMARY KEY AUTOINCREMENT,
        Nama TEXT NOT NULL,
        Usia INTEGER,
        Jabatan TEXT
      );

      CREATE TABLE IF NOT EXISTS Proyek (
        IDProyek INTEGER PRIMARY KEY AUTOINCREMENT,
        NamaProyek TEXT NOT NULL,
        IDKaryawanPenanggung INTEGER,
        FOREIGN KEY (IDKaryawanPenanggung) REFERENCES Karyawan (IDKaryawan)
      );

      CREATE TABLE IF NOT EXISTS Pekerjaan (
        IDPekerjaan INTEGER PRIMARY KEY AUTOINCREMENT,
        NamaPekerjaan TEXT NOT NULL,
        IDProyek INTEGER,
        IDKaryawan INTEGER,
        FOREIGN KEY (IDProyek) REFERENCES Proyek (IDProyek),
        FOREIGN KEY (IDKaryawan) REFERENCES Karyawan (IDKaryawan)
      );
    `);
    console.log("Tabel berhasil dibuat.");

    // 2. Insert Data (Crucial: use await)
    await db.run("BEGIN TRANSACTION");

    await db.run(
      "INSERT INTO Karyawan (Nama, Usia, Jabatan) VALUES (?, ?, ?)",
      ["John Doe", 30, "Manager"],
    );
    await db.run(
      "INSERT INTO Karyawan (Nama, Usia, Jabatan) VALUES (?, ?, ?)",
      ["Jane Smith", 25, "Programmer"],
    );
    await db.run(
      "INSERT INTO Karyawan (Nama, Usia, Jabatan) VALUES (?, ?, ?)",
      ["Bob Johnson", 35, "Sales"],
    );
    await db.run(
      "INSERT INTO Karyawan (Nama, Usia, Jabatan) VALUES (?, ?, ?)",
      ["Alice Brown", 28, "Designer"],
    );

    await db.run(
      "INSERT INTO Proyek (NamaProyek, IDKaryawanPenanggung) VALUES (?, ?)",
      ["Proyek A", 2],
    );
    await db.run(
      "INSERT INTO Proyek (NamaProyek, IDKaryawanPenanggung) VALUES (?, ?)",
      ["Proyek B", 4],
    );

    await db.run(
      "INSERT INTO Pekerjaan (NamaPekerjaan, IDProyek, IDKaryawan) VALUES (?, ?, ?)",
      ["Pekerjaan 1", 1, 2],
    );
    await db.run(
      "INSERT INTO Pekerjaan (NamaPekerjaan, IDProyek, IDKaryawan) VALUES (?, ?, ?)",
      ["Pekerjaan 2", 2, 4],
    );

    await db.run("COMMIT");
    console.log("Data berhasil dimasukkan.");

    // 3. Display Data
    const karyawanRows = await db.all("SELECT * FROM Karyawan");
    console.log("\nData Karyawan:");
    console.table(karyawanRows);

    const proyekRows = await db.all("SELECT * FROM Proyek");
    console.log("\nData Proyek:");
    console.table(proyekRows);
  } catch (error) {
    await db.run("ROLLBACK").catch(() => {});
    console.error("Kesalahan:", error.message);
  }
}

// Start the application
initDb();
