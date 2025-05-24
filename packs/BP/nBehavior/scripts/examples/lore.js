import { system, world } from "@minecraft/server";
const your_custom_item = "naruto:kunai";
function checkPlayerInventory() {
    for (const player of world.getPlayers()) {
        const inventoryComponent = player.getComponent('minecraft:inventory');
        if (!inventoryComponent)
            continue;
        const inventory = inventoryComponent.container;
        if (!inventory)
            continue;
        for (let i = 0; i < inventory.size; i++) {
            const item = inventory.getItem(i);
            if (item && item.typeId === your_custom_item) {
                item.setLore(['§r§l§0hi this is 1 line', 'wow a second line', 'you can only have 20 lines and 50 characters']);
                inventory.setItem(i, item);
            }
        }
    }
    system.runTimeout(checkPlayerInventory);
}
// Start the periodic check
checkPlayerInventory();
