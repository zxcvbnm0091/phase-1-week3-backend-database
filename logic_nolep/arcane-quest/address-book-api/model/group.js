import db from "../connection/connection.js";

class Group {
  /**
   * Retrieves all contacts.
   */
  static getAll() {
    return db.prepare("SELECT * FROM Groups").all();
  }

  /**
   * Retrieves a single Group by ID.
   */
  static findById(id) {
    const row = db.prepare("SELECT * FROM Groups WHERE id = ?").get(id);
    if (!row) {
      throw new Error(`Group with id ${id} not found.`);
    }
    return row;
  }

  /**
   * Creates a new Group.
   * Note: For production, ensure your SQL schema has UNIQUE constraints
   * on email and phoneNumber to prevent race conditions.
   */
  static create(groupName) {
    const checkSql = `SELECT 1 FROM Groups WHERE groupName = ? LIMIT 1`;
    const existingRecord = db.prepare(checkSql).get(groupName);

    if (existingRecord) {
      throw new Error("A Group with this name already exists.");
    }

    const insertSql = `INSERT INTO Groups (groupName) VALUES (?)`;
    const info = db.prepare(insertSql).run(groupName);

    return {
      id: info.lastInsertRowid,
      groupName,
    };
  }

  /**
   * Updates an existing Group.
   * Uses info.changes to verify existence without an extra query.
   */
  static update(id, groupName) {
    const updateSql = `
      UPDATE Groups
      SET groupName = ?
      WHERE id = ?
    `;

    const info = db.prepare(updateSql).run(groupName, id);

    if (info.changes === 0) {
      throw new Error(`Group with id ${id} does not exist.`);
    }

    return { id, groupName };
  }

  /**
   * Deletes a Group.
   * Uses info.changes to verify existence without an extra query.
   */
  static delete(id) {
    const info = db.prepare("DELETE FROM Groups WHERE id = ?").run(id);

    if (info.changes === 0) {
      throw new Error(`Group with id ${id} does not exist.`);
    }

    return { id, success: true };
  }
}

export default Group;
