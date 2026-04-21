import AddressBookView from "../view/AddressBookView.js";
import Contact from "../models/Contact.js";

class ContactController {
  static async create(argument) {
    try {
      const [name, phoneNumber, company, email] = argument;
      const data = Contact.create(name, phoneNumber, company, email);

      AddressBookView.contactView(
        `Contact Created! id: ${data.id}, name: ${data.name}`,
      );
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }

  static async update(argument) {
    try {
      const [id, name, phoneNumber, company, email] = argument;
      const data = Contact.update(id, name, phoneNumber, company, email);

      AddressBookView.contactView(
        `Contact updated! id: ${data.id}, name: ${data.name}`,
      );
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }

  static async delete(id) {
    try {
      const data = Contact.delete(id);
      AddressBookView.contactView(`Contact Deleted!`);
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }

  static async show() {
    try {
      const data = Contact.show();
      AddressBookView.showView(data);
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }

  static help() {
    console.log(
      "\n============================================================",
    );
    console.log(
      "                ADDRESS BOOK COMMAND LIST                     ",
    );
    console.log(
      "============================================================\n",
    );

    console.log("--- CONTACT COMMANDS ---");
    console.log(
      "> node index.js create Contact <name> <phoneNumber> <company> <email>",
    );
    console.log(
      "> node index.js update Contact <id> <name> <phoneNumber> <company> <email>",
    );
    console.log("> node index.js delete Contact <id>");
    console.log("> node index.js showContact");
    console.log(
      "> node index.js showContactMembership <contactId/contactName>\n",
    );

    console.log("--- GROUPS COMMANDS ---");
    console.log("> node index.js create Groups <groupName>");
    console.log("> node index.js update Groups <id> <groupName>");
    console.log("> node index.js delete Groups <id>");
    console.log("> node index.js showGroups");
    console.log("> node index.js showGroupMembers <groupId/groupName>\n");

    console.log("--- JUNCTION (CONTACT-GROUPS) COMMANDS ---");
    console.log("> node index.js create ContactGroups <contactId> <groupId>");
    console.log(
      "> node index.js update ContactGroups <id> <contactId> <groupId>",
    );
    console.log("> node index.js delete ContactGroups <id>");
    console.log("> node index.js showContactGroups\n");

    console.log("--- SYSTEM ---");
    console.log("> node index.js help");
    console.log(
      "\n============================================================",
    );
  }
}

export default ContactController;
