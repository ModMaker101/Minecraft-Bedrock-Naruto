import { system, world, ItemStack } from "@minecraft/server";

const itemsToRename = [
  {
    id: "naruto:kunai",
    lore: [
      "§r§l§0hi this is 1 line",
      "wow a second line",
      "you can only have 20 lines and 50 characters"
    ]
  },
  {
    id: "minecraft:diamond_sword",
    lore: [
      "§r§l§1Legendary Blade",
      "Forged in the depths of the Nether!"
    ]
  },
  {
    id: "minecraft:apple",
    lore: [
      "§r§l§6Golden Apple?",
      "No, just a regular one."
    ]
  }
];

export function checkPlayerInventory() {
    system.run(() => {
        try {
            const players = world.getPlayers();
            for (const player of players) {
                const inventory = player.getComponent("minecraft:inventory")?.container;
                if (!inventory) continue;

                for (let i = 0; i < inventory.size; i++) {
                    const item = inventory.getItem(i);
                    if (item) {
                        const matchingItem = itemsToRename.find(entry => entry.id === item.typeId);
                        if (matchingItem) {
                            item.setLore(matchingItem.lore);
                            inventory.setItem(i, item);
                        }
                    }
                }
            }
            system.runTimeout(checkPlayerInventory); 
        } catch (error) {
            console.warn("Error accessing players:", error);
        }
    });
}
