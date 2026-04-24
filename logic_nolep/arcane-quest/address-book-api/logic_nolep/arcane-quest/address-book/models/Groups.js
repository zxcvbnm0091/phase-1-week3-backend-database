import db from "../db.js";

class Groups {
  static create(groupName) {
    try {
      const checkSql = `SELECT groupName FROM Groups WHERE groupName = ? LIMIT 1`;
      const existingRecord = db.prepare(checkSql).get(groupName);

      if (existingRecord) {
        throw new Error(`A group with the name '${groupName}' already exists.`);
      }

      const insertSql = `INSERT INTO Groups (groupName) VALUES (?)`;
      const info = db.prepare(insertSql).run(groupName);

      return {
        id: info.lastInsertRowid,
        groupName,
      };
    } catch (error) {
      throw error;
    }
  }

  static findById(id) {
    const sql = `SELECT * FROM Groups WHERE id = ?`;
    return db.prepare(sql).get(id);
  }

  static update(id, groupName) {
    try {
      const existingRecord = this.findById(id);

      if (!existingRecord) {
        throw new Error(`Group with id: ${id} does not exist`);
      }

      const updateSql = `UPDATE Groups SET groupName = ? WHERE id = ?`;
      db.prepare(updateSql).run(groupName, id);

      return { id, groupName };
    } catch (error) {
      throw error;
    }
  }

  static delete(id) {
    try {
      const existingRecord = this.findById(id);

      if (!existingRecord) {
        throw new Error(`Group with id: ${id} does not exist`);
      }

      const deleteSql = `DELETE FROM Groups WHERE id = ?`;
      db.prepare(deleteSql).run(id);

      return { id, success: true };
    } catch (error) {
      throw error;
    }
  }

  static show() {
    try {
      const sql = `
        SELECT 
          g.id, g.groupName,
          COUNT(gc.contactId) AS TotalMembers,
          GROUP_CONCAT(c.name, ', ') AS Members
        FROM Groups g
        LEFT JOIN GroupContact gc ON g.id = gc.groupId
        LEFT JOIN Contact c ON gc.contactId = c.id
        GROUP BY g.id;
      `;
      return db.prepare(sql).all();
    } catch (error) {
      throw error;
    }
  }
}

export default Groups;
