import { world } from "@minecraft/server";
// Define a list of emojis with their names, codes, and commands
const emojiList = [
    { name: "Sup", code: String.fromCodePoint(0xE090), command: ":hi_emoji:" },
    { name: "Good Job", code: String.fromCodePoint(0xE091), command: ":thumbs_up:" },
    { name: "Sharingan", code: String.fromCodePoint(0xE092), command: ":sharingan:" },
    { name: "frog", code: String.fromCodePoint(0xE093), command: ":frog:" },
    { name: "kunai", code: String.fromCodePoint(0xE094), command: ":kunai:" },
];
// Create a list of valid commands from the emojiList
const validCommands = emojiList.map(emoji => emoji.command);
// Function to handle custom emoji commands
// This function checks if the command is used and sends the formatted message with the emoji
export function setupCustomEmojiCommand(commandName, emojiCode) {
    // @ts-ignore
    world.beforeEvents.chatSend.subscribe((event) => {
        const message = event.message;
        const player = event.sender;
        // Check if the message contains the emoji command
        if (message.includes(commandName)) {
            const beforeText = message.split(commandName)[0].trim();
            const afterText = message.split(commandName)[1].trim();
            const emoji = String.fromCodePoint(emojiCode);
            // Cancel the original message and send the new formatted message with emoji
            event.cancel = true;
            world.sendMessage(`<${player.name}> ${beforeText} ${emoji} ${afterText}`);
        }
    });
}
// Function to handle the ":emojis:" command and display available emojis
// This function checks if the command is ":emojis:" and sends the list of available emojis
export function setupEmojiListCommand() {
    // @ts-ignore
    world.beforeEvents.chatSend.subscribe((event) => {
        const message = event.message;
        const player = event.sender;
        if (message === ":emojis:") {
            event.cancel = true; // Cancel the original message so it doesn't show up in chat
            player.sendMessage("Available Emojis:"); // Send the header message
            // Loop through the emoji list and send the emoji details to the player
            emojiList.forEach(emoji => {
                player.sendMessage(`${emoji.name}:${emoji.command} ${emoji.code}`); // Send each emoji's details
            });
        }
    });
}
// Function to handle the ":help:" command and display a list of help options
// This function checks if the command is ":help:" and sends the help list to the player
export function setupHelpListCommand() {
    // @ts-ignore
    world.beforeEvents.chatSend.subscribe((event) => {
        const message = event.message;
        const player = event.sender;
        if (message === ":help:") {
            event.cancel = true; // Cancel the original message so it doesn't show up in chat
            const helpList = emojiList.map(emoji => `${emoji.command} - ${emoji.name} emoji`); // Create a list of help info
            // Send each help option to the player
            helpList.forEach(help => {
                player.sendMessage(help); // Send each help message to the player
            });
        }
    });
}
// Function to handle invalid commands and remind the player about the help command
// This function ensures that if a player sends an invalid command (e.g., ":invalid_command:"), 
// it will cancel the message and display a message telling them to use ":help:".
export function setupHelpCommand() {
    // @ts-ignore
    world.beforeEvents.chatSend.subscribe((event) => {
        const message = event.message;
        const player = event.sender;
        // Check if the message starts with a colon and isn't a valid command
        // We also ensure ":help:" and ":emojis:" aren't flagged as invalid
        if (message.startsWith(":") && !validCommands.includes(message.split(' ')[0]) && message !== ":help:" && message !== ":emojis:") {
            event.cancel = true; // Cancel the original message so it doesn't show in chat
            player.sendMessage("This is not a valid command. Use :help: for a list of commands."); // Inform the player
        }
    });
}
// Loop through all emojis and set up the commands for each emoji
emojiList.forEach(emoji => {
    // Fallback to 0 if codePointAt returns undefined, but this should not happen
    const codePoint = emoji.code.codePointAt(0) ?? 0;
    setupCustomEmojiCommand(emoji.command, codePoint);
});
