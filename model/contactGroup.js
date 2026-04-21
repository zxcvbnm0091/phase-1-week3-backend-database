import db from "../connection/connection.js";

class ContactGroups {
  static getAll() {
    try {
      const sql = `SELECT * FROM ContactGroup`;
      return db.prepare(sql).all();
    } catch (error) {
      throw error;
    }
  }

  static findById(id) {
    const sql = `SELECT * FROM ContactGroup WHERE id = ?`;
    return db.prepare(sql).get(id);
  }

  static create(contactId, groupId) {
    try {
      const checkSql = `
        SELECT contactId, groupId 
        FROM ContactGroup
        WHERE contactId = ? AND groupId = ? 
      `;
      const existingRecord = db.prepare(checkSql).get(contactId, groupId);

      if (existingRecord) {
        throw new Error(
          `A relationship between contact ${contactId} and group ${groupId} already exists.`,
        );
      }

      const insertSql = `
        INSERT INTO ContactGroup (contactId, groupId)
        VALUES (?, ?)
      `;
      const info = db.prepare(insertSql).run(contactId, groupId);

      return {
        id: info.lastInsertRowid,
        contactId,
        groupId,
      };
    } catch (error) {
      throw error;
    }
  }

  static update(id, contactId, groupId) {
    try {
      const existingRecord = this.findById(id);

      if (!existingRecord) {
        throw new Error(`Relationship with ID ${id} does not exist.`);
      }

      const updateSql = `
        UPDATE ContactGroup
        SET contactId = ?, groupId = ?
        WHERE id = ?
      `;
      db.prepare(updateSql).run(contactId, groupId, id);

      return { id, contactId, groupId };
    } catch (error) {
      throw error;
    }
  }

  static delete(id) {
    try {
      const info = db.prepare(`DELETE FROM ContactGroup WHERE id = ?`).run(id);

      if (info.changes === 0) {
        throw new Error("No record found to delete.");
      }

      return { id, success: true };
    } catch (error) {
      throw error;
    }
  }

  static masterView() {
    try {
      const sql = `
        SELECT
          gc.id,
          c.name AS ContactName,
          g.groupName AS  GroupName
        FROM ContactGroup gc
        JOIN Contact c ON gc.contactId = c.id
        JOIN Groups g ON gc.groupId = g.id
      `;
      return db.prepare(sql).all();
    } catch (error) {
      throw error;
    }
  }

  static getMemberByGroup(identifier) {
    try {
      const sql = `
        SELECT
          c.id AS ContactId, 
          c.name, 
          c.phoneNumber, 
          c.company, 
          c.email
        FROM Contact c
        JOIN ContactGroup gc ON c.id = gc.contactId
        JOIN Groups g ON gc.groupId = g.id
        WHERE g.id = ? OR g.groupName = ?
      `;
      return db.prepare(sql).all(identifier, identifier);
    } catch (error) {
      throw error;
    }
  }

  static getGroupByMember(identifier) {
    try {
      const sql = `
        SELECT 
          g.id,
          g.GroupName
        FROM Groups g
        JOIN ContactGroup gc ON g.id = gc.GroupId
        JOIN Contact c ON c.id = gc.ContactId
        WHERE c.id = ? OR c.name = ?
      `;
      return db.prepare(sql).all(identifier, identifier);
    } catch (error) {
      throw error;
    }
  }
}

export default ContactGroups;
