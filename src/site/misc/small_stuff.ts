export type ElementalArray = [number, number, number, number, number, number]

export const damageTypeCount = 6;
export const elementTypeCount = 5;

export type LowerCaseElement = typeof damageTypePrefixes[number]
export type CapitalizedElement = typeof damageTypeNames[number]
export const damageTypePrefixes = ["neutral", "earth", "thunder", "water", "fire", "air"] as const;
export const damageTypeNames = ["Neutral", "Earth", "Thunder", "Water", "Fire", "Air"] as const;

export const damageTypes = {
    NEUTRAL: "Neutral",
    EARTH: "Earth",
    THUNDER: "Thunder",
    WATER: "Water",
    FIRE: "Fire",
    AIR: "Air",
} as const;

export const damageTypeIndexes = {
    NEUTRAL: 0,
    EARTH: 1,
    THUNDER: 2,
    WATER: 3,
    FIRE: 4,
    AIR: 5,
} as const;

export const attackSpeedMultipliers = {
    superFast: 4.3,
    veryFast: 3.1,
    fast: 2.5,
    normal: 2.05,
    slow: 1.5,
    verySlow: 0.83,
    superSlow: 0.51,
} as const;

export const attackSpeedMap = {
    superFast: "Super Fast",
    veryFast: "Very Fast",
    fast: "Fast",
    normal: "Normal",
    slow: "Slow",
    verySlow: "Very Slow",
    superSlow: "Super Slow",
} as const;
export const orderedAttackSpeed = [
    "superSlow",
    "verySlow",
    "slow",
    "normal",
    "fast",
    "veryFast",
    "superFast",
] as const;

export const maxPlayerLevel = 106;
