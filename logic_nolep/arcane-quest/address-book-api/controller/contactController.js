import Contact from "../model/contact.js";

class ContactController {
  static createContact(req, res) {
    try {
      const { name, phoneNumber, company, email } = req.body;
      const newContact = Contact.create(name, phoneNumber, company, email);

      return res.status(201).json({
        message: "Contact Created Successfully",
        data: newContact,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static updateContact(req, res) {
    try {
      const { id } = req.params;
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
      const status = error.message.includes("not exist") ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  }

  static deleteContact(req, res) {
    try {
      const { id } = req.params;
      Contact.delete(id);

      return res.status(200).json({ message: "Contact Deleted Successfully" });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  static getContacts(req, res) {
    try {
      const contacts = Contact.getAll();
      return res.status(200).json(contacts);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default ContactController;
