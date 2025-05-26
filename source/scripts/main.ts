// @ts-ignore
import { checkPlayerInventory } from "./items/lore";
import { system, world, Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
checkPlayerInventory();
// @ts-ignore
import { setupEmojiListCommand, setupHelpCommand, setupHelpListCommand } from "./emojis";
// Setup the list and help commands
setupEmojiListCommand();
setupHelpListCommand();
setupHelpCommand();
// @ts-ignore
import { fireballHandler } from "./jutsu/fireball_jutsu";
fireballHandler();
// @ts-ignore
import { shadowCloneHandler } from "./jutsu/shadow_clone_jutsu";
shadowCloneHandler();
// @ts-ignore
import { chakraHandler } from "./chakra/chakra";
chakraHandler();
import { ryoHandler } from "./ryoHandler";
ryoHandler();
// Run the kunai_pickup.mcfunction for each player who has an arrow (from kunai pickup)
// import { ryoHandler } from "./ryoHandler";
// ryoHandler();

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const inventory = player.getComponent("minecraft:inventory")?.container;
        let hasArrow = false;
        if (inventory) {
            for (let i = 0; i < inventory.size; i++) {
                const item = inventory.getItem(i);
                if (item && item.typeId === "minecraft:arrow") {
                    hasArrow = true;
                    break;
                }
            }
        }
        if (hasArrow) {
            try {
                // Remove all arrows and give the same number of kunai for stacking
                let arrowCount = 0;
                let firstArrowSlot = -1;
                if (inventory) {
                    for (let i = 0; i < inventory.size; i++) {
                        const item = inventory.getItem(i);
                        if (item && item.typeId === "minecraft:arrow") {
                            if (firstArrowSlot === -1) firstArrowSlot = i;
                            arrowCount += item.amount ?? 1;
                            inventory.setItem(i, undefined);
                        }
                    }
                }
                if (arrowCount > 0 && firstArrowSlot !== -1 && inventory) {
                    // Place the kunai stack in the same slot as the first arrow found
                    inventory.setItem(firstArrowSlot, undefined); // Ensure slot is clear
                    player.runCommand(`give @s naruto:kunai ${arrowCount}`);
                    // Move the kunai to the original slot if possible
                    const newItem = inventory.getItem(inventory.size - 1); // Usually goes to last slot
                    if (newItem && newItem.typeId === "naruto:kunai") {
                        inventory.setItem(firstArrowSlot, newItem);
                        inventory.setItem(inventory.size - 1, undefined);
                    }
                }
            } catch (e) { }
        }
    }
}, 5); // Check every 5 ticks (0.25 seconds)
import { shopHandler } from "./shopHandler";
shopHandler();