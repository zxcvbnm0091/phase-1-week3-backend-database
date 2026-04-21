import db from "../connection/connection.js";

class Contact {
  /**
   * Retrieves all contacts.
   */
  static getAll() {
    return db.prepare("SELECT * FROM Contact").all();
  }

  /**
   * Retrieves a single contact by ID.
   */
  static findById(id) {
    const row = db.prepare("SELECT * FROM Contact WHERE id = ?").get(id);
    if (!row) {
      throw new Error(`Contact with id ${id} not found.`);
    }
    return row;
  }

  /**
   * Creates a new contact.
   * Note: For production, ensure your SQL schema has UNIQUE constraints
   * on email and phoneNumber to prevent race conditions.
   */
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

  /**
   * Updates an existing contact.
   * Uses info.changes to verify existence without an extra query.
   */
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

  /**
   * Deletes a contact.
   * Uses info.changes to verify existence without an extra query.
   */
  static delete(id) {
    const info = db.prepare("DELETE FROM Contact WHERE id = ?").run(id);

    if (info.changes === 0) {
      throw new Error(`Contact with id ${id} does not exist.`);
    }

    return { id, success: true };
  }
}

export default Contact;
