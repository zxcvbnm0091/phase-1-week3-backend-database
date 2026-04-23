import ContactController from "./controllers/ContactController.js";
import GroupsController from "./controllers/GroupsController.js";
import ContactGroupsController from "./controllers/ContactGroupsController.js";

// 1. Controller Mapping
const controllers = {
  contact: ContactController,
  groups: GroupsController,
  contactgroups: ContactGroupsController,
};

// 2. Command Alias & Schema Mapping
// This centralizes all your CLI rules in one place.
const COMMAND_MAP = {
  // Shorthand commands
  showContact: { cmd: "show", type: "contact", minArgs: 0 },
  showGroups: { cmd: "show", type: "groups", minArgs: 0 },
  showContactGroups: { cmd: "show", type: "contactgroups", minArgs: 0 },
  showGroupMembers: {
    cmd: "showGroupMembers",
    type: "contactgroups",
    minArgs: 1,
    msg: "<groupId/Name>",
  },
  showContactMembership: {
    cmd: "showContactMembership",
    type: "contactgroups",
    minArgs: 1,
    msg: "<contactId/Name>",
  },

  create: { isCRUD: true },
  update: { isCRUD: true },
  delete: { isCRUD: true },
  show: { isCRUD: true },
};

const CRUD_SCHEMA = {
  contact: {
    create: { min: 4, msg: "<name> <phone> <company> <email>" },
    update: { min: 5, msg: "<id> <name> <phone> <company> <email>" },
    delete: { min: 1, msg: "<id>" },
  },
  groups: {
    create: { min: 1, msg: "<groupName>" },
    update: { min: 2, msg: "<id> <groupName>" },
    delete: { min: 1, msg: "<id>" },
  },
  contactgroups: {
    create: { min: 2, msg: "<contactId> <groupId>" },
    update: { min: 3, msg: "<id> <contactId> <groupId>" },
    delete: { min: 1, msg: "<id>" },
  },
};

// --- Execution Logic ---

const [rawCommand, rawType, ...rawArgs] = process.argv.slice(2);

let finalCommand = rawCommand;
let finalType = rawType;
let finalArgs = rawArgs;

// Handle not CRUD command (e.g showContactMembership, showGroupMembers)
if (COMMAND_MAP[rawCommand] && !COMMAND_MAP[rawCommand].isCRUD) {
  const config = COMMAND_MAP[rawCommand];
  finalCommand = config.cmd;
  finalType = config.type;
  finalArgs = [rawType, ...rawArgs].filter(Boolean); // add rawType as the first argument if the command is not CRUD
}

const activeController = controllers[finalType?.toLowerCase()];

// Validation Helper
const validate = (args, min, usage) => {
  if (args.length < min) {
    console.error(`\x1b[31mError: Missing arguments!\x1b[0m`);
    console.log(`Usage: node index.js ${rawCommand} ${usage || ""}`);
    return false;
  }
  return true;
};

if (activeController) {
  const typeKey = finalType.toLowerCase();

  switch (finalCommand) {
    case "create":
    case "update":
      const schema = CRUD_SCHEMA[typeKey]?.[finalCommand];
      if (validate(finalArgs, schema.min, `${finalType} ${schema.msg}`)) {
        activeController[finalCommand](finalArgs);
      }
      break;

    case "delete":
      if (validate(finalArgs, 1, `${finalType} <id>`)) {
        activeController.delete(finalArgs[0]);
      }
      break;

    case "show":
      activeController.show();
      break;

    case "showGroupMembers":
    case "showContactMembership":
      const aliasConfig = COMMAND_MAP[rawCommand];
      if (validate(finalArgs, aliasConfig.minArgs, aliasConfig.msg)) {
        activeController[finalCommand](finalArgs[0]);
      }
      break;

    default:
      console.log(`Unknown command: ${finalCommand}`);
  }
} else {
  if (rawCommand === "help" || !rawCommand) {
    console.log("\x1b[36m=== ADDRESS BOOK CLI ===\x1b[0m");
    ContactController.help();
  } else {
    console.log(
      `\x1b[31mUnknown type: ${rawType}. Use 'Contact', 'Groups', or 'ContactGroups'.\x1b[0m`,
    );
  }
}
