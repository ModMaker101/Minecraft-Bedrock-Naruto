import { world } from "@minecraft/server";

const emojiList = [
    { name: "Sup", code: String.fromCodePoint(0xE090), command: ":hi_emoji:" },
    { name: "Good Job", code: String.fromCodePoint(0xE091), command: ":thumbs_up:" },
    { name: "Sharingan", code: String.fromCodePoint(0xE092), command: ":sharingan:" },
    { name: "frog", code: String.fromCodePoint(0xE093), command: ":frog:" },
    { name: "kunai", code: String.fromCodePoint(0xE094), command: ":kunai:" },
    // Add more emojis as needed
];

const validCommands = emojiList.map(emoji => emoji.command);

export function setupCustomEmojiCommand(commandName, emojiCodePoint) {
    world.beforeEvents.chatSend.subscribe((event) => {
        const message = event.message;
        const player = event.sender;

        // Check if the message contains the custom command
        const commandIndex = message.indexOf(commandName);
        if (commandIndex !== -1) {
            // Extract the text before and after the command
            const beforeText = message.substring(0, commandIndex).trim();
            const afterText = message.substring(commandIndex + commandName.length).trim();

            // Cancel the original chat message
            event.cancel = true;

            // Use String.fromCodePoint to include the custom emoji
            const emoji = String.fromCodePoint(emojiCodePoint);
            const playerName = player.name;

            // Send the custom message with the text before, emoji, and text after
            world.sendMessage(`<${playerName}> ${beforeText} ${emoji} ${afterText}`);
        }
    });
}

function setupEmojiListCommand() {
    world.beforeEvents.chatSend.subscribe((event) => {
        const message = event.message;
        const player = event.sender;

        // Check if the message is :emojis:
        if (message === ":emojis:") {
            // Cancel the original chat message
            event.cancel = true;

            // Send the list of emojis to the player
            emojiList.forEach(emoji => {
                player.sendMessage(`${emoji.name}: ${emoji.command} ${emoji.code}`);
            });
        }
    });
}

function setupHelpCommand() {
    world.beforeEvents.chatSend.subscribe((event) => {
        const message = event.message;
        const player = event.sender;

        // Check if the message is an invalid command
        if (!message.startsWith(":") || !message.endsWith(":")) {
            return;
        }

        if (!validCommands.includes(message)) {
            // Cancel the original chat message
            event.cancel = true;

            // Notify the player about the invalid command
            player.sendMessage(`This is not a valid command. Use :help: for a list of commands.`);
        }
    });
}

function setupHelpListCommand() {
    world.beforeEvents.chatSend.subscribe((event) => {
        const message = event.message;
        const player = event.sender;

        // Check if the message is :help:
        if (message === ":help:") {
            // Cancel the original chat message
            event.cancel = true;

            // Define the list of help commands
            const helpList = emojiList.map(emoji => `${emoji.command} - ${emoji.name} emoji`);

            // Send the list of help commands to the player
            helpList.forEach(help => {
                player.sendMessage(help);
            });
        }
    });
}

emojiList.forEach(emoji => setupCustomEmojiCommand(emoji.command, emoji.code.codePointAt(0)));
setupEmojiListCommand();
setupHelpCommand();
setupHelpListCommand();
