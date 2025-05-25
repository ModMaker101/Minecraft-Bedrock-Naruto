import { system, world } from "@minecraft/server";
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
    // Give Ryo every second
    system.runInterval(() => {
        for (const player of world.getPlayers()) {
            addRyo(player, 1);
        }
    }, 20); // 20 ticks = 1 second
    // Give Ryo when Ramen is eaten
    world.afterEvents.itemCompleteUse.subscribe(event => {
        const player = event.source;
        const item = event.itemStack;
        if (item.typeId === "naruto:ramen") {
            addRyo(player, 10);
            player.sendMessage("§aYou earned 10 Ryo from eating Ramen!");
        }
    });
}
