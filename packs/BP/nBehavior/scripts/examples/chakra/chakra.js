import { world, system } from "@minecraft/server";

const MAX_CHAKRA = 100;
const CHAKRA_REGEN_RATE = 1; // Chakra per second

// Dictionary to store player chakra levels
let playerChakra = new Map();

// Function to initialize chakra for players
function initializeChakra(player) {
    if (!playerChakra.has(player.id)) {
        playerChakra.set(player.id, MAX_CHAKRA);
    }
}

// Function to regenerate chakra over time
function regenChakra() {
    for (let player of world.getPlayers()) {
        let currentChakra = playerChakra.get(player.id) ?? MAX_CHAKRA;
        if (currentChakra < MAX_CHAKRA) {
            playerChakra.set(player.id, currentChakra + CHAKRA_REGEN_RATE);
        }
    }
    system.runTimeout(regenChakra, 20); // Run every second
}

// Function to reduce chakra when using abilities
function useChakra(player, amount) {
    let currentChakra = playerChakra.get(player.id) ?? MAX_CHAKRA;
    if (currentChakra >= amount) {
        playerChakra.set(player.id, currentChakra - amount);
        return true;
    }
    return false; // Not enough chakra
}

// Show chakra in the UI (chakra bar)
function updateChakraDisplay() {
    for (let player of world.getPlayers()) {
        let currentChakra = playerChakra.get(player.id) ?? MAX_CHAKRA;
        let chakraWidth = (currentChakra / MAX_CHAKRA) * 200; // 200 is the full width of the chakra bar

        // Update the chakra bar's full width dynamically based on the player's chakra
        player.onScreenDisplay.setCustomWidget("chakra_full_bar", {
            "x": "50%",
            "y": "95%",
            "size": [chakraWidth, 20]
        });
    }
    system.runTimeout(updateChakraDisplay, 5); // Update every 5 ticks
}

// Event: Player joins the world
world.afterEvents.playerSpawn.subscribe(event => {
    initializeChakra(event.player);
});

// Start chakra regeneration and UI updates
regenChakra();
updateChakraDisplay();
