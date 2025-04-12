import { checkPlayerInventory } from "./items/lore";
import { system, world, Player } from "@minecraft/server";
checkPlayerInventory();

import { setupEmojiListCommand, setupHelpCommand, setupHelpListCommand } from "./emojis";
// Setup the list and help commands
setupEmojiListCommand();
setupHelpListCommand();
setupHelpCommand();

import { fireballHandler } from "./fireball_jutsu";
fireballHandler();

import { chakraHandler } from "./chakra/chakra";

chakraHandler();