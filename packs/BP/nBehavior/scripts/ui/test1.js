import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

// Define the Naruto-themed UI
const narutoUi = new ActionFormData()
    .title("Naruto Themed UI")
    .body("Select an option:")
    .button("Jutsu", "textures/items/weapons/katana")
    .button("Ninja Tools", "textures/items/weapons/kunai")
    .button("Summons", "textures/ui/naruto_summons")
    .button("Clans", "textures/ui/naruto_clans");

// Define the custom UI
const customUi = new ActionFormData()
    .title("Custom Form")
    .body("Select an option:")
    .button("Rewards", "textures/ui/promo_holiday_gift_small")
    .button("Shop", "textures//icon_deals")
    .button("Ban Tool", "textures/ui/hammer_l")
    .button("Naruto UI", "textures/ui/icon_hangar"); // This button will open the Naruto-themed UI

world.afterEvents.itemUse.subscribe((event) => {
    const { source, itemStack } = event;
    switch (itemStack.typeId) {
        case "minecraft:compass":
            narutoUi.show(source).then((response) => {
                // Handle the Naruto UI button selections here
                if (response.selection !== undefined) {
                    // Process the selection, you can add specific actions for each button
                    switch (response.selection) {
                        case 0:
                            // Jutsu button pressed
                            source.runCommand('say You selected Jutsu');
                            break;
                        case 1:
                            // Ninja Tools button pressed
                            source.runCommand('say You selected Ninja Tools');
                            break;
                        case 2:
                            // Summons button pressed
                            source.runCommand('say You selected Summons');
                            break;
                        case 3:
                            // Clans button pressed
                            source.runCommand('say You selected Clans');
                            break;
                    }
                }
            });
            break;
        case "minecraft:clock":
            customUi.show(source).then((response) => {
                // Check if the "Naruto UI" button was pressed
                if (response.selection === 3) { // Index starts from 0, so the 4th button is index 3
                    narutoUi.show(source);
                }
            });
            break;
    }
});
