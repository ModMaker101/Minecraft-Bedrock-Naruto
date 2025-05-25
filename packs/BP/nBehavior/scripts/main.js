// @ts-ignore
import { checkPlayerInventory } from "./items/lore";
import { system, world } from "@minecraft/server";
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
import { getRyo, setRyo } from "./ryoHandler"; // Make sure this path matches your project structure
function showNinjaMenu(player) {
    const ryo = getRyo(player);
    const form = new ActionFormData()
        .title("Ichiraku Ramen Menu")
        .body(`§6Your Current Ryo: §e${ryo}\n\n§fSelect a category:`)
        .button("Food", "textures/items/misc/ramen")
        .button("Food Supplies", "textures/ui/icon_deals")
        .button("Refresh", "textures/ui/refresh");
    form.show(player).then(response => {
        if (response.canceled)
            return;
        switch (response.selection) {
            case 0:
                showFoodMenu(player);
                break;
            case 1:
                showFoodSuppliesMenu(player);
                break;
            case 2:
                showNinjaMenu(player); // Refresh
                break;
        }
    });
}
import { trySpendRyo } from "./ryoHandler";
function showFoodMenu(player) {
    const ramenCost = 150;
    const ryo = getRyo(player);
    const form = new ActionFormData()
        .title("Food Menu")
        .body(`§6Your Current Ryo: §e${ryo}\n\n§rChoose your favorite dish!`)
        .button(`Ramen - §e${ramenCost} Ryo`, "textures/items/misc/ramen")
        .button("Back", "textures/ui/icon_import");
    form.show(player).then(response => {
        if (response.canceled)
            return;
        const ryo = getRyo(player);
        switch (response.selection) {
            case 0:
                if (ryo >= ramenCost) {
                    setRyo(player, ryo - ramenCost);
                    player.runCommand("give @s naruto:ramen 1");
                    player.sendMessage(`§aYou bought Ramen for §e${ramenCost} Ryo§a!`);
                }
                else {
                    player.sendMessage(`§cNot enough Ryo! You need §e${ramenCost} Ryo§c.`);
                }
                break;
            case 1:
                showNinjaMenu(player);
                break;
        }
    });
}
function showFoodSuppliesMenu(player) {
    const steakCost = 5;
    const bowlCost = 8;
    const noodlesCost = 3;
    const ryo = getRyo(player);
    const form = new ActionFormData()
        .title("Food Supplies")
        .body(`§6Your Current Ryo: §e${ryo}\n\n§fChoose your supplies:`)
        .button(`Steak - §e${steakCost} Ryo`, "textures/items/beef_cooked") // Replace with rice texture if available
        .button(`Glass Bowl - §e${bowlCost} Ryo`, "textures/items/misc/glass_bowl")
        .button(`Noodles - §e${noodlesCost} Ryo`, "textures/items/misc/noodles") // Replace with custom noodles texture if available
        .button("Back", "textures/ui/icon_import");
    form.show(player).then(response => {
        if (response.canceled)
            return;
        switch (response.selection) {
            case 0:
                if (trySpendRyo(player, steakCost)) {
                    player.runCommand("give @s minecraft:cooked_beef 1");
                    player.sendMessage(`§aYou bought Steak for §e${steakCost} Ryo§a!`);
                }
                break;
            case 1:
                if (trySpendRyo(player, bowlCost)) {
                    player.runCommand("give @s bowl 1");
                    player.sendMessage(`§aYou bought a Bowl for §e${bowlCost} Ryo§a!`);
                }
                break;
            case 2:
                if (trySpendRyo(player, noodlesCost)) {
                    player.runCommand("give @s stick 1"); // Replace with custom chopsticks item if available
                    player.sendMessage(`§aYou bought Noodles for §e${noodlesCost} Ryo§a!`);
                }
                break;
            case 3:
                showNinjaMenu(player);
                break;
        }
    });
}
// Open the Ninja Tools UI when a player uses a diamond
world.afterEvents.itemUse.subscribe((event) => {
    const { source, itemStack } = event;
    if (itemStack.typeId === "naruto:ichiraku_ramen_menu_item") {
        showNinjaMenu(source);
    }
});
