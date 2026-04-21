import db from "../db.js";

class Contact {
  static create(name, phoneNumber, company, email) {
    try {
      const checkSql = `SELECT name FROM Contact WHERE name = ? OR phoneNumber = ? OR email = ? LIMIT 1`;
      const existingRecord = db.prepare(checkSql).get(name, phoneNumber, email);

      if (existingRecord) {
        throw new Error(`A contact with this data already exists.`);
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
    } catch (error) {
      throw error;
    }
  }

  static findById(id) {
    const sql = `SELECT * FROM Contact WHERE id = ?`;
    return db.prepare(sql).get(id);
  }

  static update(id, name, phoneNumber, company, email) {
    try {
      const existingRecord = this.findById(id);

      if (!existingRecord) {
        throw new Error(`Contact with id: ${id} does not exist`);
      }

      const updateSql = `
            UPDATE Contact
            SET name = ?, phoneNumber = ?, company = ?, email = ?
            WHERE id = ?
        `;
      db.prepare(updateSql).run(name, phoneNumber, company, email, id);

      return { id, name, phoneNumber, company, email };
    } catch (error) {
      throw error;
    }
  }

  static delete(id) {
    try {
      const existingRecord = this.findById(id);

      if (!existingRecord) {
        throw new Error(`Contact with id: ${id} does not exist`);
      }

      const deleteSql = `DELETE FROM Contact WHERE id = ?`;
      const info = db.prepare(deleteSql).run(id);

      return { id, success: info.changes > 0 };
    } catch (error) {
      throw error;
    }
  }

  static show() {
    try {
      const sql = `
        SELECT 
          c.id, c.name, c.phoneNumber, c.company, c.email,
          COUNT(gc.groupId) AS TotalGroups,
          GROUP_CONCAT(g.groupName, ', ') AS Groups
        FROM Contact c
        LEFT JOIN GroupContact gc ON c.id = gc.contactId
        LEFT JOIN Groups g ON gc.groupId = g.id
        GROUP BY c.id;
      `;
      return db.prepare(sql).all();
    } catch (error) {
      throw error;
    }
  }
}

export default Contact;
