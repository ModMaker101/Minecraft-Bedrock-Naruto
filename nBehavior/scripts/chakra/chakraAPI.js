import { world, system } from "@minecraft/server";

const ChakraAPI = {
  initializePlayerChakra(player, initialChakra = 100) {
    const objective = world.scoreboard.getObjective("chakra");
    if (!objective) {
      world.scoreboard.addObjective("chakra", "dummy", "Chakra");
    }
    player.runCommand(`scoreboard players set @s chakra ${initialChakra}`);
    this.updateChakraVisual(player);
    console.log(`Initialized chakra for ${player.name}`);
  },

  getPlayerChakra(player) {
    const objective = world.scoreboard.getObjective("chakra");
    if (objective) {
      return objective.getScore(player.scoreboard);
    }
    return 0;
  },

  setPlayerChakra(player, amount) {
    const objective = world.scoreboard.getObjective("chakra");
    if (objective) {
      player.runCommand(`scoreboard players set @s chakra ${amount}`);
      this.updateChakraVisual(player);
      console.log(`Set chakra for ${player.name} to ${amount}`);
    }
  },

  addChakra(player, amount) {
    const currentChakra = this.getPlayerChakra(player);
    this.setPlayerChakra(player, currentChakra + amount);
  },

  drainChakra(player, amount) {
    const currentChakra = this.getPlayerChakra(player);
    if (currentChakra >= amount) {
      this.setPlayerChakra(player, currentChakra - amount);
      return true;
    } else {
      player.runCommand(`tellraw @s {"rawtext":[{"text":"Not enough chakra!"}]}`);
      console.log(`Not enough chakra for ${player.name}`);
      return false;
    }
  },

  updateChakraVisual(player) {
    const currentChakra = this.getPlayerChakra(player);
    player.runCommand(`title @s actionbar {"rawtext":[{"text":"Chakra: ${currentChakra}"}]}`);
    console.log(`Updated chakra visual for ${player.name} to ${currentChakra}`);
  }
};

world.afterEvents.playerSpawn.subscribe(event => {
  const player = event.player;
  system.run(() => {
    ChakraAPI.initializePlayerChakra(player);
  });
});

export { ChakraAPI };
