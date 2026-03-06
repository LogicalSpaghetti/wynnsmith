export const genericSymbols = {
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
} as const;

export const classSymbols = {
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
} as const;

export const commonAbilityAttributes = {
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
} as const;

export const color = {
    '0': '#000000',
    '1': '#0000aa',
    '2': '#00aa00',
    '3': '#00aaaa',
    '4': '#aa0000',
    '5': '#aa00aa',
    '6': '#ffaa00',
    '7': '#aaaaaa',
    '8': '#555555',
    '9': '#5555ff',
    'a': '#55ff55',
    'b': '#55ffff',
    'c': '#ff5555',
    'd': '#ff55ff',
    'e': '#ffff55',
    'f': '#ffffff',
    'r': null,
    'g': '#87dd47',
    'h': '#ffe14d',
    'i': '#f747c2',
    'j': '#99e9ff',
    'k': '#ff4545',
} as const;

export const rarityColor = {
    "common": "§f",
    "unique": "§e",
    "set": "§a",
    "rare": "§d",
    "legendary": "§b",
    "fabled": "§c",
    "mythic": "§5",
    "crafted": "§3",
} as const;

export const reqIndicators = {
    "true": "§a✔",
    "false": "§c✖",
} as const;

export const skillPointColor = {
    "strength": "§2",
    "dexterity": "§e",
    "intelligence": "§b",
    "defence": "§c",
    "agility": "§f",
} as const;

export function positivityColor(state: boolean | "true" | "false") {
    if (typeof state === "boolean") state = state ? "true" : "false";
    return positivityColors[state];
}

export const positivityColors = {
    true: "§a",
    false: "§c",
} as const;

export const decoration = {
    "m": "line-through", "n": "underline",
} as const;
export const style = {
    "l": "fw-bold", "o": "fst-italic",
} as const;

export const minecraftDelimiters = {"§": true, "&": true} as const;
export const preferredDelimiter = "§" as const;

export const namedColors = {
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
} as const;