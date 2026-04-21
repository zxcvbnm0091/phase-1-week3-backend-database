import ContactGroups from "../model/contactGroup.js";

class ContactGroup {
  static async createContactGroup(req, res) {
    try {
      const { contactId, groupId } = req.body;

      const newContactGroup = ContactGroups.create(contactId, groupId);

      return res.status(201).json({
        message: "Contact Group Created Successfully",
        data: newContactGroup,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async updateContactGroup(req, res) {
    try {
      const { id } = req.params;
      const { contactId, groupId } = req.body;

      const updatedContactGroup = ContactGroups.update(id, contactId, groupId);

      return res.status(201).json({
        message: `Contact Group Updated Successfully`,
        data: updatedContactGroup,
      });
    } catch (error) {
      const status = error.message.includes("not exist") ? 404 : 400;
      return res.status(status).json({
        error: error.message,
      });
    }
  }
  static async deleteContactGroup(req, res) {
    try {
      const { id } = req.params;
      ContactGroups.delete(id);

      return res.status(201).json({
        message: "Group Deleted Successfully",
      });
    } catch (error) {
      return res.status(404).json({
        error: error.message,
      });
    }
  }
}

export const { createContactGroup, updateContactGroup, deleteContactGroup } =
  ContactGroup;
