import Group from "../model/group.js";

class GroupController {
  static async createGroups(req, res) {
    try {
      const { groupName } = req.body;

      const newGroup = Group.create(groupName);

      return res.status(201).json({
        message: "Group Created Successfully",
        data: newGroup,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async updateGroups(req, res) {
    try {
      const { id } = req.params;
      const { name, phoneNumber, company, email } = req.body;

      const updatedGroup = Group.update(id, name, phoneNumber, company, email);

      return res.status(200).json({
        message: "Group Updated Successfully",
        data: updatedGroup,
      });
    } catch (error) {
      const status = error.message.includes("not exist") ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  }

  static async deleteGroups(req, res) {
    try {
      const { id } = req.params;
      Group.delete(id);

      return res.status(200).json({ message: "Group Deleted Successfully" });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  static async getGroups(req, res) {
    try {
      const Groups = Group.getAll();
      return res.status(200).json(Groups);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export const { createGroups, updateGroups, deleteGroups, getGroups } =
  GroupController;
