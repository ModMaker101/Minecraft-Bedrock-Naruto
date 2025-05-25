# Naruto Kunai Pickup Replacement
# This function replaces arrows with kunai when picked up by a player.

# Remove all arrows from the player (replaceitem is not available, so clear inventory slot by slot)
clear @a minecraft:arrow
# Give the player a kunai item
give @a naruto:kunai 1
