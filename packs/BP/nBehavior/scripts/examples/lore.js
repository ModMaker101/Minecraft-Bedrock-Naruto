import { system, world, ItemComponentTypes, ItemStack } from "@minecraft/server";

const your_custom_item = "naruto:kunai";

function checkPlayerInventory() {
  for (const player of world.getPlayers()) {
    const inventory = player.getComponent('minecraft:inventory').container;
    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i);
      if (item && item.typeId === your_custom_item) {
        item.setLore(['§r§l§0hi this is 1 line', 'wow a second line', 'you can only have 20 lines and 50 characters']);

        inventory.setItem(i, item);
      }      
    }    
  }
  system.runTimeout(checkPlayerInventory, 10);
}
// Start the periodic check
checkPlayerInventory();
