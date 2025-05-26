import { system, world, Player } from "@minecraft/server";
import {getRyo} from "../ryoHandler";
//
export function chakraHandler() {
    // Jutsu Chakra Costs
    const jutsuChakraCosts: Record<string, number> = {
        "naruto:fireball_jutsu": 50,
        "naruto:shadow_clone_jutsu": 30,
    };

    // Function to set Chakra (clamped between 0 and 100)
    function setChakra(player: Player, amount: number): void {
        player.setDynamicProperty("chakra", Math.max(0, Math.min(100, amount)));
    }

    // Function to get Chakra value
    function getChakra(player: Player): number {
        const chakra = player.getDynamicProperty("chakra");
        return typeof chakra === "number" ? chakra : 100;
    }

   function updateStatusDisplay(player: Player): void {
    const chakra = getChakra(player);
    const ryo = getRyo(player);
    player.onScreenDisplay.setActionBar(`§bChakra: §f${chakra} | §6Ryo: §f${ryo}`);
}


    // When Ramen is used
    world.afterEvents.itemCompleteUse.subscribe(event => {
        const player = event.source;
        const item = event.itemStack;

        if (item.typeId === "naruto:ramen") {
            let currentChakra = getChakra(player);
            setChakra(player, Math.min(currentChakra + 25, 100));
            player.sendMessage("You ate Ramen! +25 Chakra");
        }
    });

    // Update Chakra UI every second
    system.runInterval(() => {
        for (const player of world.getPlayers()) {
            updateStatusDisplay(player);
        }
    });

    function addChakraEverySecond(): void {
        for (const player of world.getPlayers()) {
            let currentChakra = getChakra(player);
            setChakra(player, Math.min(currentChakra + 1, 100));
        }
    }
    system.runInterval(addChakraEverySecond, 20); // 20 ticks = 1 second

    // Prevent use if not enough Chakra
    world.beforeEvents.itemUse.subscribe(event => {
        const player = event.source;
        const item = event.itemStack;

        const chakraCost = jutsuChakraCosts[item.typeId];
        if (chakraCost !== undefined) {
            const chakra = getChakra(player);
            if (chakra < chakraCost) {
                event.cancel = true;
                player.sendMessage(`§cNot enough Chakra! You need at least ${chakraCost}.`);
            }
        }
    });

    // Handle actual Jutsu effect after use
    world.afterEvents.itemUse.subscribe(event => {
        const player = event.source;
        const item = event.itemStack;

        const chakraCost = jutsuChakraCosts[item.typeId];
        if (chakraCost !== undefined) {
            const currentChakra = getChakra(player);
            setChakra(player, currentChakra - chakraCost);
            player.sendMessage(`You used a Jutsu! -${chakraCost} Chakra`);

            // Special logic for Shadow Clone Jutsu
            if (item.typeId === "naruto:shadow_clone_jutsu") {
                const location = player.location;

                system.run(() => {
                    const clone = player.dimension.spawnEntity("naruto:shadow_clone_entity", location);

                    const tameable = clone.getComponent("minecraft:tameable");
                    if (tameable) {
                        tameable.tame(player);
                    }
                });
            }
        }
    });
}

