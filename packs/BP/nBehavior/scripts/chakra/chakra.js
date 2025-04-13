import { system, world, Player } from "@minecraft/server";

export function chakraHandler() {
    // Jutsu Chakra Costs
    const jutsuChakraCosts = {
        "naruto:fireball_jutsu": 50,
        "naruto:shadow_clone_jutsu": 30,
    };

    // Function to set Chakra (clamped between 0 and 100)
    function setChakra(player, amount) {
        player.setDynamicProperty("chakra", Math.max(0, Math.min(100, amount)));
    }

    // Function to get Chakra value
    function getChakra(player) {
        return player.getDynamicProperty("chakra") ?? 100;
    }

    // Function to update the Chakra display
    function updateChakraDisplay(player) {
        let chakra = getChakra(player);
        player.onScreenDisplay.setActionBar(`§bChakra: ${chakra}`);
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
            updateChakraDisplay(player);
        }
    });

    // Prevent use if not enough Chakra
    world.beforeEvents.itemUse.subscribe(e => {
        const player = e.source;
        const item = e.itemStack;

        const chakraCost = jutsuChakraCosts[item.typeId];
        if (chakraCost !== undefined) {
            const chakra = getChakra(player);
            if (chakra < chakraCost) {
                e.cancel = true;
                player.sendMessage(`Not enough Chakra! You need at least ${chakraCost}.`);
            }
        }
    });

    // Deduct Chakra after use
    world.afterEvents.itemUse.subscribe(e => {
        const player = e.source;
        const item = e.itemStack;

        const chakraCost = jutsuChakraCosts[item.typeId];
        if (chakraCost !== undefined) {
            const currentChakra = getChakra(player);
            setChakra(player, currentChakra - chakraCost);
            player.sendMessage(`You used a Jutsu! -${chakraCost} Chakra`);
        }
    });
}
