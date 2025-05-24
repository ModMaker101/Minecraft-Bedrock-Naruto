// @ts-ignore
import { checkPlayerInventory } from "./items/lore";
import { system, world } from "@minecraft/server";
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
// Run the kunai_pickup.mcfunction for each player who has an arrow (from kunai pickup)
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
                            if (firstArrowSlot === -1)
                                firstArrowSlot = i;
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
            }
            catch (e) { }
        }
    }
}, 5); // Check every 5 ticks (0.25 seconds)
import { ActionFormData } from "@minecraft/server-ui";
function showActionForm(log, targetLocation) {
    const playerList = world.getPlayers();
    if (playerList.length >= 1) {
        const form = new ActionFormData()
            .title("Test Title")
            .body("Body text here!")
            .button("btn 1")
            .button("btn 2")
            .button("btn 3")
            .button("btn 4")
            .button("btn 5");
        form.show(playerList[0]).then((result) => {
            if (result.canceled) {
                log("Player exited out of the dialog. Note that if the chat window is up, dialogs are automatically canceled.");
                return -1;
            }
            else {
                log("Your result was: " + result.selection);
            }
        });
    }
}
world.beforeEvents.chatSend.subscribe((event) => {
    if (event.message === "!showform") {
        const player = event.sender;
        event.cancel = true;
        const log = (msg) => player.sendMessage(msg);
        const location = {
            x: player.location.x,
            y: player.location.y,
            z: player.location.z,
            dimension: player.dimension
        };
        showActionForm(log, location);
    }
});
