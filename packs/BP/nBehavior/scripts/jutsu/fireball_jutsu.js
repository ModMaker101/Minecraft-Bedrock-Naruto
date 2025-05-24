import { world } from "@minecraft/server";
export function fireballHandler() {
    world.afterEvents.itemUse.subscribe((event) => {
        const { itemStack, source: player } = event;
        console.log(itemStack.typeId);
        // Check if the used item is naruto:fireball_jutsu
        if (itemStack.typeId === 'naruto:fireball_jutsu') {
            // Execute the commands
            player.runCommand('playsound jutsu @a[x=~,y=~,z=~,r=10]');
            player.runCommand('particle minecraft:basic_smoke_particle ^^1.6^0.8');
        }
    });
}
