import Contact from "../model/contact.js";

class ContactController {
  // We remove the view calls and return the raw data or success status

  static async createContact(req, res) {
    try {
      // In an API, arguments usually come from the request body
      const { name, phoneNumber, company, email } = req.body;

      const newContact = Contact.create(name, phoneNumber, company, email);

      // 201 Created is the standard status code for successful creation
      return res.status(201).json({
        message: "Contact Created Successfully",
        data: newContact,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async updateContact(req, res) {
    try {
      const { id } = req.params; // IDs usually come from the URL path
      const { name, phoneNumber, company, email } = req.body;

      const updatedContact = Contact.update(
        id,
        name,
        phoneNumber,
        company,
        email,
      );

      return res.status(200).json({
        message: "Contact Updated Successfully",
        data: updatedContact,
      });
    } catch (error) {
      // 404 if not found, 400 for bad data
      const status = error.message.includes("not exist") ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  }

  static async deleteContact(req, res) {
    try {
      const { id } = req.params;
      Contact.delete(id);

      return res.status(200).json({ message: "Contact Deleted Successfully" });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  static async getContacts(req, res) {
    try {
      const contacts = Contact.getAll(); // Changed from .show() to match previous refactor
      return res.status(200).json(contacts);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

// Instead of export default ContactController;
export const { createContact, updateContact, deleteContact, getContacts } =
  ContactController;
