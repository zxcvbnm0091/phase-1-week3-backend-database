import AddressBookView from "../view/AddressBookView.js";
import Groups from "../models/Groups.js";

class GroupsController {
  static async create(groupName) {
    try {
      const data = Groups.create(groupName);

      AddressBookView.GroupsView(
        `Groups Created! id: ${data.id}, name: ${data.groupName}`,
      );
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }
  static async update(argument) {
    try {
      const [id, groupName] = argument;
      const data = Groups.update(id, groupName);

      AddressBookView.GroupsView(
        `Groups updated! id: ${data.id}, name: ${data.groupName}`,
      );
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }

  static async delete(id) {
    try {
      const data = Groups.delete(id);

      AddressBookView.GroupsView(
        `Groups Deleted! id: ${data.id}, name: ${data.groupName}`,
      );
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }

  static async show() {
    try {
      const data = Groups.show();

      AddressBookView.showView(data);
    } catch (error) {
      AddressBookView.showError(error.message);
    }
  }
}

export default GroupsController;
