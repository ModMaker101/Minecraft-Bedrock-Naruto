import { world, Player } from "@minecraft/server";
// === RYO FUNCTIONS ===
export function getRyo(player) {
    const ryo = player.getDynamicProperty("ryo");
    return typeof ryo === "number" ? ryo : 0;
}
export function setRyo(player, amount) {
    player.setDynamicProperty("ryo", Math.max(0, amount));
}
export function addRyo(player, amount) {
    setRyo(player, getRyo(player) + amount);
}
export function trySpendRyo(player, cost) {
    const current = getRyo(player);
    if (current >= cost) {
        setRyo(player, current - cost);
        return true;
    }
    else {
        player.sendMessage(`§cNot enough Ryo! You need §e${cost} Ryo§c.`);
        return false;
    }
}
// === RYO SYSTEM INIT ===
export function ryoHandler() {
    // Give Ryo when a mob is killed by a player
    world.afterEvents.entityDie.subscribe(event => {
        const deadEntity = event.deadEntity;
        const killer = event.damageSource.damagingEntity;
        if (killer instanceof Player) {
            // You can adjust Ryo reward or even vary it by mob type
            const reward = 5;
            addRyo(killer, reward);
            killer.sendMessage(`§aYou earned ${reward} Ryo for defeating a mob!`);
        }
    });
}
