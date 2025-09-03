`use strict`;

const codeDictionaryGenericSymbols = {
    "mana": "§b✺",
    "health": "§4⚔",

    "damage": "§c⚔",
    "neutral": "§6✣",
    "earth": "§2✤",
    "thunder": "§e✦",
    "water": "§b❉",
    "fire": "§c✹",
    "air": "§f❋",

    "effect": "§e✧",
    "duration": "§d⌛",
    "AoE": "§3☀",
    "range": "§a➼",
    "cooldown": "§3⌚",
    "heal": "§d❤",
    "blindness": "§c⬣",
    "slowness": "§c⬤",
};

const codeDictionaryClassSymbols = {
    "focus": "§e➽",

    "winded": "§b≈",
    "dilation": "§3➲",

    "resistance": "§a❁",
    "corrupted": "§4☠",
    "armorbreak": "§c✃",
    "sacred": "§6✧",
    "provoke": "§4💢",
    "invincibility": "§b☗",

    "marked": "§c✜",
    "clone": "§5",

    "puppet": "§6⚘",
    "whipped": "§6⇶",
    "awakened": "§f♚",
    "bloodpool": "§4⚕",
    "bleeding": "§c",
};
const codeDictionaryCommonAbilityAttributes = {

    "manacost": ["§b✺", "\n§b✺ §7Mana Cost: §f_"],

    "damage": ["§c⚔", "\n§c⚔ §7Total Damage: §f_% §8(of your DPS)"],
    "neuteral": ["§6✣", "\n   §8(§6✣ §8Damage: _%)"],
    "earth": ["§2✤", "\n   §8(§2✤ §8Earth: _%)"],
    "thunder": ["§e✦", "\n   §8(§e✦ §8Thunder: _%)"],
    "water": ["§b❉", "\n   §8(§b❉ §8Water: _%)"],
    "fire": ["§c✹", "\n   §8(§c✹ §8Fire: _%)"],
    "air": ["§f❋", "\n   §8(§f❋ §8Air: _%)"],

    "effect": ["§e✧", "\n§e✧ §7Effect: §f_"],
    "duration": ["§d⌛", "\n§d⌛ §7Duration: §f_s"],
    "range": ["§a➼", "\n§a➼ §7Range: §f_ Blocks"],
    "AoE": ["§3☀", "\n§3☀ §7Area of Effect: §f_ Blocks §7(Circle-Shaped)"],
    "cooldown": ["§3⌚", "\n§3⌚ §7Cooldown: §f_s"],
};

const codeDictionaryColor = {
    '0' : '#000000',
    '1' : '#0000AA',
    '2' : '#00AA00',
    '3' : '#00AAAA',
    '4' : '#AA0000',
    '5' : '#AA00AA',
    '6' : '#FFAA00',
    '7' : '#AAAAAA',
    '8' : '#555555',
    '9' : '#5555FF',
    'a' : '#55FF55',
    'b' : '#55FFFF',
    'c' : '#FF5555',
    'd' : '#FF55FF',
    'e' : '#FFFF55',
    'f' : '#FFFFFF',
    'r' : null,
    'g' : '#87DD47',
    'h' : '#FFE14D',
    'i' : '#F747C2',
    'j' : '#99E9FF',
    'k' : '#FF4545',
};

const codeDictionaryRarityColor = {
    "common": "§f",
    "unique": "§e",
    "set": "§a",
    "rare": "§d",
    "legendary": "§b",
    "fabled": "§c",
    "mythic": "§5",
    "crafted": "§3",
};

const codeDictionaryReqIndicators = {
    "true": "§a✔",
    "false": "§c✖",
};

const codeDictionarySkillPointColor = {
    "strength": "§2",
    "dexterity": "§e",
    "intelligence": "§b",
    "defence": "§c",
    "agility": "§f"
}

const codeDictionaryPositivityColors = {
    "true": "§a",
    "false": "§c",
};

const codeDictionaryDecoration = {
    "m": "line-through", "n": "underline",
};
const codeDictionaryStyle = {
    "l": "fw-bold", "o": "fst-italic",
};

const minecraftDelimiters = {"§": true, "&": true};
const preferredDelimiter = "§";

const codeDictionaryNamedColors = {
    "mana": "§b",
    "health": "§4",

    "damage": "§c",
    "neutral": "§6",
    "earth": "§2",
    "thunder": "§e",
    "water": "§b",
    "fire": "§c",
    "air": "§f",

    "effect": "§e",
    "duration": "§d",
    "AoE": "§3",
    "range": "§a",
    "cooldown": "§3",
    "heal": "§d",
    "blindness": "§c",
    "slowness": "§c",
};