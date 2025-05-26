import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { getRyo, setRyo, trySpendRyo } from "./ryoHandler"; // Make sure this path matches your project structure
import { ItemStack } from "@minecraft/server";
export function giveItem(player, itemId, amount = 1) {
    const inventory = player.getComponent("inventory")?.container;
    if (!inventory) {
        player.sendMessage("§cCould not access your inventory.");
        return;
    }
    const item = new ItemStack(itemId, amount); // Use string directly for item type
    const leftover = inventory.addItem(item);
    if (leftover) {
        player.sendMessage("§eYour inventory is full. Some items could not be added.");
    }
}
export function shopHandler() {
    function showNinjaMenu(player) {
        const ryo = getRyo(player);
        const form = new ActionFormData()
            .title("Ichiraku Ramen Menu")
            .body(`§6Your Current Ryo: §e${ryo}\n\n§fSelect a category:`)
            .button("Food", "textures/items/misc/ramen")
            .button("Food Supplies", "textures/ui/icon_deals")
            .button("Refresh", "textures/ui/refresh");
        form.show(player).then(response => {
            if (response.canceled)
                return;
            switch (response.selection) {
                case 0:
                    showFoodMenu(player);
                    break;
                case 1:
                    showFoodSuppliesMenu(player);
                    break;
                case 2:
                    showNinjaMenu(player); // Refresh
                    break;
            }
        });
    }
    function showFoodMenu(player) {
        const ramenCost = 150;
        const ryo = getRyo(player);
        const form = new ActionFormData()
            .title("Food Menu")
            .body(`§6Your Current Ryo: §e${ryo}\n\n§rChoose your favorite dish!`)
            .button(`Ramen - §e${ramenCost} Ryo`, "textures/items/misc/ramen")
            .button("Back", "textures/ui/icon_import");
        form.show(player).then(response => {
            if (response.canceled)
                return;
            const ryo = getRyo(player);
            switch (response.selection) {
                case 0:
                    if (ryo >= ramenCost) {
                        setRyo(player, ryo - ramenCost);
                        giveItem(player, "naruto:ramen", 1);
                        player.sendMessage(`§aYou bought Ramen for §e${ramenCost} Ryo§a!`);
                    }
                    else {
                        player.sendMessage(`§cNot enough Ryo! You need §e${ramenCost} Ryo§c.`);
                    }
                    break;
                case 1:
                    showNinjaMenu(player);
                    break;
            }
        });
    }
    function showFoodSuppliesMenu(player) {
        const steakCost = 5;
        const bowlCost = 8;
        const noodlesCost = 3;
        const ryo = getRyo(player);
        const form = new ActionFormData()
            .title("Food Supplies")
            .body(`§6Your Current Ryo: §e${ryo}\n\n§fChoose your supplies:`)
            .button(`Steak - §e${steakCost} Ryo`, "textures/items/beef_cooked")
            .button(`Glass Bowl - §e${bowlCost} Ryo`, "textures/items/misc/glass_bowl")
            .button(`Noodles - §e${noodlesCost} Ryo`, "textures/items/misc/noodles")
            .button("Back", "textures/ui/icon_import");
        form.show(player).then(response => {
            if (response.canceled)
                return;
            switch (response.selection) {
                case 0:
                    if (trySpendRyo(player, steakCost)) {
                        giveItem(player, "minecraft:cooked_beef", 1);
                        player.sendMessage(`§aYou bought Steak for §e${steakCost} Ryo§a!`);
                    }
                    break;
                case 1:
                    if (trySpendRyo(player, bowlCost)) {
                        giveItem(player, "narutos:glass_bowl", 1);
                        player.sendMessage(`§aYou bought a Bowl for §e${bowlCost} Ryo§a!`);
                    }
                    break;
                case 2:
                    if (trySpendRyo(player, noodlesCost)) {
                        giveItem(player, "naruto:noodles", 1);
                        player.sendMessage(`§aYou bought Noodles for §e${noodlesCost} Ryo§a!`);
                    }
                    break;
                case 3:
                    showNinjaMenu(player);
                    break;
            }
        });
    }
    // Open the Ninja Tools UI when a player uses a diamond
    world.afterEvents.itemUse.subscribe((event) => {
        const { source, itemStack } = event;
        if (itemStack.typeId === "naruto:ichiraku_ramen_menu_item") {
            showNinjaMenu(source);
        }
    });
}
