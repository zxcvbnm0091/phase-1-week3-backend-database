import db from "../connection/connection.js";

class Contact {
  static getAll() {
    return db.prepare("SELECT * FROM Contact").all();
  }

  static findById(id) {
    const row = db.prepare("SELECT * FROM Contact WHERE id = ?").get(id);
    if (!row) {
      throw new Error(`Contact with id ${id} not found.`);
    }
    return row;
  }

  static create(name, phoneNumber, company, email) {
    const checkSql = `SELECT 1 FROM Contact WHERE name = ? OR phoneNumber = ? OR email = ? LIMIT 1`;
    const existingRecord = db.prepare(checkSql).get(name, phoneNumber, email);

    if (existingRecord) {
      throw new Error("A contact with this data already exists.");
    }

    const insertSql = `INSERT INTO Contact (name, phoneNumber, company, email) VALUES (?, ?, ?, ?)`;
    const info = db.prepare(insertSql).run(name, phoneNumber, company, email);

    return {
      id: info.lastInsertRowid,
      name,
      phoneNumber,
      company,
      email,
    };
  }

  static update(id, name, phoneNumber, company, email) {
    const updateSql = `
      UPDATE Contact
      SET name = ?, phoneNumber = ?, company = ?, email = ?
      WHERE id = ?
    `;

    const info = db
      .prepare(updateSql)
      .run(name, phoneNumber, company, email, id);

    if (info.changes === 0) {
      throw new Error(`Contact with id ${id} does not exist.`);
    }

    return { id, name, phoneNumber, company, email };
  }

  static delete(id) {
    const info = db.prepare("DELETE FROM Contact WHERE id = ?").run(id);

    if (info.changes === 0) {
      throw new Error(`Contact with id ${id} does not exist.`);
    }

    return { id, success: true };
  }
}

export default Contact;
