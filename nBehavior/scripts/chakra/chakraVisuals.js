import { system, world } from "@minecraft/server";
import { ChakraAPI } from "./chakraAPI.js";

const updateInterval = 20; // Update every second (20 ticks)

function updateChakraVisuals() {
  for (const player of world.getPlayers()) {
    ChakraAPI.updateChakraVisual(player);
  }
  system.runTimeout(updateChakraVisuals, updateInterval);
}

// Start the visual update loop
system.runTimeout(updateChakraVisuals, updateInterval);
