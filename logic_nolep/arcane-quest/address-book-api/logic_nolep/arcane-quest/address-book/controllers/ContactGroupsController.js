import AddressBookView from "../view/AddressBookView.js";
import ContactGroups from "../models/ContactGroups.js";

class ContactGroupsController {
  static async create(argument) {
    try {
      const [contactId, groupId] = argument;
      const data = ContactGroups.create(contactId, groupId);

      AddressBookView.showView(
        `Relationship Created! ID: ${data.id} (Contact: ${data.contactId} ↔ Group: ${data.groupId})`,
      );
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }

  static async update(argument) {
    try {
      const [id, contactId, groupId] = argument;
      const data = ContactGroups.update(id, contactId, groupId);

      AddressBookView.showView(
        `Relationship Updated! ID: ${data.id} is now (Contact: ${data.contactId} ↔ Group: ${data.groupId})`,
      );
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }

  static async delete(id) {
    try {
      const data = ContactGroups.delete(id);

      AddressBookView.showView(`Relationship Deleted! ID: ${data.id}`);
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }

  static async show() {
    try {
      const data = ContactGroups.masterView();
      AddressBookView.showView(data);
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }

  static async showGroupMembers(identifier) {
    try {
      const data = ContactGroups.getMemberByGroup(identifier);
      AddressBookView.showView(data);
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }

  static async showContactMembership(identifier) {
    try {
      const data = ContactGroups.getGroupByMember(identifier);
      AddressBookView.showView(data);
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }
}

export default ContactGroupsController;
