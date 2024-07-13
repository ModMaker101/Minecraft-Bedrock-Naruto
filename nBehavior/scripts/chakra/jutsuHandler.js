import { world } from "@minecraft/server";
import { ChakraAPI } from "./chakraAPI.js";

// Jutsu handler
const JutsuHandler = {
  handleItemUse(event) {
    const player = event.source;
    const item = event.item;

    switch (item.id) {
      case "naruto:fireball_jutsu":
        this.useFireballJutsu(player);
        break;
      // Add more jutsus here
    }
  },

  useFireballJutsu(player) {
    if (ChakraAPI.drainChakra(player, 20)) {
      player.runCommand(`execute as @s run summon naruto:fireball ~ ~1 ~`);
    }
  }
};

world.events.afterItemUse.subscribe(event => JutsuHandler.handleItemUse(event));

export { JutsuHandler };
