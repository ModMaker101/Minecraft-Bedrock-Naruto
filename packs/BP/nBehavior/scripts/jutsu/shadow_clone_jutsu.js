import { system, world, Player } from "@minecraft/server";
export function shadowCloneHandler() {
    world.afterEvents.entityHurt.subscribe((event) => {
        const entity = event.hurtEntity;

        if (entity.typeId === "naruto:shadow_clone_entity") {
            try {
                entity.kill();
            } catch (error) {
                console.warn(`Failed to kill entity: ${error}`);
            }
        }
    });

    world.afterEvents.entitySpawn.subscribe((event) => {
        const entity = event.entity;

        if (entity.typeId === "naruto:shadow_clone_entity") {
            system.runTimeout(() => {
                try {
                    entity.kill();
                } catch (error) {
                    console.warn("Failed to kill entity:", error);
                }
            }, 1200);
        }
    });


    world.beforeEvents.itemUse.subscribe((event) => {
        const { itemStack, source } = event;

        if (itemStack.typeId === "naruto:shadow_clone_jutsu") {
            const player = source;
            const location = player.location;

            system.run(() => {
                const clone = player.dimension.spawnEntity("naruto:shadow_clone_entity", location);

                const tameable = clone.getComponent("minecraft:tameable");
                if (tameable) {
                    tameable.tame(player);
                }
            });
        }
    });
}