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

// Function to set Chakra as a dynamic property
function setChakra(player, amount) {
    player.setDynamicProperty("chakra", Math.max(0, Math.min(100, amount)));
}

// Function to get Chakra value
function getChakra(player) {
    return player.getDynamicProperty("chakra") ?? 100;
}

// Function to update the Chakra display (runs every second)
function updateChakraDisplay(player) {
    let chakra = getChakra(player);
    player.onScreenDisplay.setActionBar(`§bChakra: ${chakra}`);
}

world.afterEvents.itemCompleteUse.subscribe(event => {
    const player = event.source;
    const item = event.itemStack;

    if (item.typeId === "naruto:ramen") {
        let currentChakra = getChakra(player);
        setChakra(player, Math.min(currentChakra + 25, 100));
        player.sendMessage("You ate Ramen! +25 Chakra");
    }
});


// Continuously update the Chakra UI every second
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        updateChakraDisplay(player);
    }
});

// Cancel use if player doesn't have enough chakra
world.beforeEvents.itemUse.subscribe(e => {
    const player = e.source;
    const item = e.itemStack;

    if (item.typeId === "naruto:fireball_jutsu") {
        const chakra = getChakra(player);
        if (chakra < 50) {
            e.cancel = true;
            player.sendMessage("Not enough Chakra! You need at least 50.");
        }
    }
});

// Subtract chakra right when the item is used
world.afterEvents.itemUse.subscribe(e => {
    const player = e.source;
    const item = e.itemStack;

    if (item.typeId === "naruto:fireball_jutsu") {
        const currentChakra = getChakra(player);
        setChakra(player, currentChakra - 50);
        player.sendMessage("You used Fireball Jutsu! -50 Chakra");
    }
});


