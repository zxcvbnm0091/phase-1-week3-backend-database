import ContactGroups from "../model/contactGroup.js";

class ContactGroupController {
  static createContactGroup(req, res) {
    try {
      const { contactId, groupId } = req.body;

      if (!contactId || !groupId) {
        return res.status(400).json({
          status: "error",
          message: "contactId and groupId are required.",
        });
      }

      const newContactGroup = ContactGroups.create(contactId, groupId);

      return res.status(201).json({
        status: "success",
        message: "Contact Group Created Successfully",
        data: newContactGroup,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  static updateContactGroup(req, res) {
    try {
      const { id } = req.params;
      const { contactId, groupId } = req.body;

      const updatedContactGroup = ContactGroups.update(id, contactId, groupId);

      return res.status(201).json({
        status: "success",
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
  static deleteContactGroup(req, res) {
    try {
      const { id } = req.params;
      ContactGroups.delete(id);

      return res.status(201).json({
        status: "success",
        message: "Group Deleted Successfully",
      });
    } catch (error) {
      return res.status(404).json({
        error: error.message,
      });
    }
  }

  static getGroupByMember(req, res) {
    try {
      const { identifier } = req.params;

      const groups = ContactGroups.getGroupByMember(identifier);

      return res.status(200).json({
        status: "success",
        requested_identifier: identifier,
        result_count: groups.length,
        message: "Showing Group by Member",
        data: groups,
      });
    } catch (error) {
      return res.status(404).json({
        error: error.message,
      });
    }
  }

  static getMemberByGroup(req, res) {
    try {
      const { identifier } = req.params;
      const members = ContactGroups.getMemberByGroup(identifier);

      return res.status(200).json({
        status: "success",
        requested_identifier: identifier,
        result_count: members.length,
        message: "Showing Member by group",
        data: members,
      });
    } catch (error) {
      return res.status(404).json({
        error: error.message,
      });
    }
  }

  static getContactGroup(req, res) {
    try {
      const contactGroup = ContactGroups.masterView();
      return res.status(200).json({
        status: "success",
        result_count: contactGroup.length,
        message: "Showing Contact Groups",
        data: contactGroup,
      });
    } catch (error) {
      return res.status(404).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default ContactGroupController;
