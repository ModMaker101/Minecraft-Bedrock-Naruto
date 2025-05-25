import { world, Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

function showNinjaMenu(player: Player) {
    const form = new ActionFormData()
        .title("Custom Form")
        .body("Select Something Here")
        .button("Rewards", "textures/ui/promo_holiday_gift_small")
        .button("Shop", "textures/ui/icon_deals")
        .button("Ban Tool", "textures/ui/hammer_l")
        .button("Skins", "textures/ui/icon_hangar")
        .button("Skins", "textures/ui/icon_hangar")
        .button("Skins", "textures/ui/icon_hangar")
        .button("Skins", "textures/ui/icon_hangar")
        .button("Skins", "textures/ui/icon_hangar")
        .button("Skins", "textures/ui/icon_hangar");

    form.show(player).then(response => {
        if (response.canceled) return;

        switch (response.selection) {
            case 0:
                player.runCommand("give @s naruto:kunai 1");
                break;
            case 1:
                player.runCommand("give @s naruto:shuriken 1");
                break;
            // Add more cases as needed
        }
    });
}

// Open the Ninja Tools UI when a player uses the ramen block item
world.beforeEvents.itemUse.subscribe((event) => {
    const { source, itemStack } = event;
    
    // if (itemStack?.typeId === "naruto:ichiraku_ramen_menu_item") {
    if (itemStack?.typeId === "minecraft:diamond") {
        showNinjaMenu(source);
    }
});
