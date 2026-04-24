import { Router } from "express";
const router = Router();

import ContactController from "../controller/contactController.js";
import GroupController from "../controller/groupController.js";
import ContactGroupController from "../controller/contactGroupController.js";

// CONTACT ROUTES
router
  .route("/contact")
  .get(ContactController.getContacts)
  .post(ContactController.createContact);
router.put("/contact/:id", ContactController.updateContact);
router.delete("/contact/:id", ContactController.deleteContact);

// GROUP ROUTES
router
  .route("/groups")
  .get(GroupController.getGroups)
  .post(GroupController.createGroups);
router.put("/groups/:id", GroupController.updateGroups);
router.delete("/groups/:id", GroupController.deleteGroups);

// CONTACTGROUP ROUTES
router
  .route("/contactGroup")
  .get(ContactGroupController.getContactGroup)
  .post(ContactGroupController.createContactGroup);
router.put("/contactGroup/:id", ContactGroupController.updateContactGroup);
router.delete("/contactGroup/:id", ContactGroupController.deleteContactGroup);

router.get(
  "/groups/member/:identifier",
  ContactGroupController.getGroupByMember,
);
router.get(
  "/contact/group/:identifier",
  ContactGroupController.getMemberByGroup,
);

export default router;
