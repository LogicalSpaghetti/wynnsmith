export type LowerCaseElement = "neutral" | "earth" | "thunder" | "water" | "fire" | "air"
export type CapitalizedElement = "Neutral" | "Earth" | "Thunder" | "Water" | "Fire" | "Air"
export type ElementalArray = [number, number, number, number, number, number]

export const damageTypePrefixes = ["neutral", "earth", "thunder", "water", "fire", "air"];
export const damageTypeNames = ["Neutral", "Earth", "Thunder", "Water", "Fire", "Air"];

export const attackSpeedMultipliers = {
    superFast: 4.3,
    veryFast: 3.1,
    fast: 2.5,
    normal: 2.05,
    slow: 1.5,
    verySlow: 0.83,
    superSlow: 0.51,
};

export const orderedAttackSpeed = [
    "superSlow",
    "verySlow",
    "slow",
    "normal",
    "fast",
    "veryFast",
    "superFast",
];

export const attackSpeedMap = {
    superFast: "Super Fast",
    veryFast: "Very Fast",
    fast: "Fast",
    normal: "Normal",
    slow: "Slow",
    verySlow: "Very Slow",
    superSlow: "Super Slow",
};

export const maxPlayerLevel = 106;

export const wynnClasses = [
    "archer", "assassin", "mage", "shaman", "warrior",
];