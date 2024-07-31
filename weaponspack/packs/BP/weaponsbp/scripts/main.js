import { world, system } from '@minecraft/server';

system.run(() => {
  const kunaiEntities = [];

  // Event to handle the creation of the kunai entity
  world.events.entityCreate.subscribe((event) => {
    const entity = event.entity;
    if (entity.typeId === "nt:thrown_blue_kunai") {
      kunaiEntities.push(entity);
      // Assuming a single player for simplicity
      const player = world.getPlayers()[0];
      if (player) {
        player.runCommandAsync('clear @p nt:blue_kunai 0 1');
      }
      entity.addTag('kunai');
    }
  });

  // Interval to check and handle the kunai return logic
  system.runInterval(() => {
    kunaiEntities.forEach((entity, index) => {
      const players = world.getPlayers();
      if (players.length > 0) {
        const player = players[0]; // Assuming a single player for simplicity
        if (player && entity.hasTag('kunai') && entity.location.distanceTo(player.location) < 2) {
          player.runCommandAsync('give @p nt:blue_kunai 1 0');
          player.runCommandAsync('clear @p arrow 0 1');
          entity.triggerEvent('minecraft:despawn');
          kunaiEntities.splice(index, 1); // Remove the entity from the list
        }
      }
    });
  }, 20); // Run every second
});
