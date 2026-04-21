import { Router } from "express";
const router = Router();
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../controller/contactController.js";
import {
  getGroups,
  createGroups,
  updateGroups,
  deleteGroups,
} from "../controller/groupController.js";
import {
  createContactGroup,
  updateContactGroup,
  deleteContactGroup,
} from "../controller/contactGroupController.js";

router.route("/contact").get(getContacts).post(createContact);

router.put("/contact/:id", updateContact);
router.delete("/contact/:id", deleteContact);

router.route("/groups").get(getGroups).post(createGroups);
router.put("/groups/:id", updateGroups);
router.delete("/groups/:id", deleteGroups);

router.post("/contactGroup", createContactGroup);
router.put("/contactGroup/:id", updateContactGroup);
router.delete("/contactGroup/:id", deleteContactGroup);

export default router;
