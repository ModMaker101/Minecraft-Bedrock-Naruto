import { checkPlayerInventory } from "./items/lore";
import { system, world, Player } from "@minecraft/server";
checkPlayerInventory();

import { setupEmojiListCommand, setupHelpCommand, setupHelpListCommand } from "./emojis";
// Setup the list and help commands
setupEmojiListCommand();
setupHelpListCommand();
setupHelpCommand();

import { fireballHandler } from "./jutsu/fireball_jutsu";
fireballHandler();

import { shadowCloneHandler } from "./jutsu/shadow_clone_jutsu";
shadowCloneHandler();

import { chakraHandler } from "./chakra/chakra";
chakraHandler();

