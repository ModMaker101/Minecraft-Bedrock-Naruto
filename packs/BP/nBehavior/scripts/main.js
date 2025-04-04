import { checkPlayerInventory } from "./items/lore";
import { system, world  } from "@minecraft/server";
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
    player.onScreenDisplay.setActionBar(`Chakra: ${chakra}`);
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

// Subscribe to the beforeEvents.itemUse event (beta)
// world.beforeEvents.itemUse.subscribe((eventData) => {
//     const player = eventData.source;
//     const item = eventData.item;

//     // Check if the used item is "naruto:fireball_jutsu"
//     if (item.id === "naruto:fireball_jutsu") {
//         let currentChakra = getChakra(player);
//         if (currentChakra < 50) {
//             player.sendMessage("Not enough Chakra to use Fireball Jutsu!");
//             eventData.cancel = true; // Cancel the use
//         } else {
//             setChakra(player, currentChakra - 50);
//             player.sendMessage("Fireball Jutsu used! -50 Chakra");
//         }
//     }
// });
// Continuously update the Chakra UI every second
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        updateChakraDisplay(player);
    }
}, 20);





// system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
//     itemComponentRegistry.registerCustomComponent("wiki:unbreakable", {
//         onUse(){
//             const item = evd.itemStack;
//             const player = eventData.sourcel

//         }
//     });
// });








// Define the custom component
const FireballJutsuComponent = {
    onUse(eventData) {
        const item = eventData.itemStack;
        if (item.id === 'naruto:fireball_jutsu') {
            eventData.cancel = true; // Cancel the item use action
            // Optionally, send a message to the player
            eventData.source.sendMessage('The Fireball Jutsu cannot be used.');
        }
    }
};

// Register the custom component
world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("naruto:fireball_jutsu_component", FireballJutsuComponent);
});
