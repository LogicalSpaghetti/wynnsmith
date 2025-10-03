import {attackSpeedMultipliers, damageTypeNames, damageTypePrefixes, orderedAttackSpeed} from "../data/small_stuff.js";
import {getSkillPointMultiplier, SkillPointIndexes} from "./skill_points.js";
import {damage_type_count} from "./attack_calculations.js";

export const player_bps = 5.612;
const costNames = ["1st", "2nd", "3rd", "4th"];

export default function calculateStats(build) {
    statCalculations(build);

    mergeElementalDefences(build);
    healthCalculations(build);
    calculateSpellCosts(build);
}

function statCalculations(build) {
    const ids = build.identifications;

    const maxManaMod = ids.rawMaxMana + build.sp_multipliers[SkillPointIndexes.Intelligence] * 100;
    build.stats.maxMana = 100 + maxManaMod;
    // TODO: max mana with and without int, with int as a sub-stat

    build.stats.trueManaRegen = ids.manaRegen + 25;

    build.stats.manaPerHit = ids.manaSteal / 3 / attackSpeedMultipliers[orderedAttackSpeed[build.stats.attackSpeed]];
    build.stats.lifePerHit = ids.lifeSteal / 3 / attackSpeedMultipliers[orderedAttackSpeed[build.stats.attackSpeed]];

    const cappedWalkSpeed = Math.min(400, Math.max(-100, ids.walkSpeed));
    build.stats.effectiveWS = player_bps * (cappedWalkSpeed / 100 + 1);
}

function mergeElementalDefences(build) {
    build.stats.defences = [];

    for (let i = 1; i < damage_type_count; i++) {
        const baseDefence = build.base[`base${damageTypeNames[i]}Defence`];
        const percentDefence = 1 + ((build.identifications.elementalDefence + build.identifications[`${damageTypePrefixes[i]}Defence`]) / 100);

        build.stats.defences[i - 1] = baseDefence * percentDefence;
    }
}

function healthCalculations(build) {
    build.stats.health = Math.max(5, build.base.baseHealth + build.identifications.rawHealth);
    build.stats.healthRegen = computeHpr(build.identifications.healthRegenRaw, build.identifications.healthRegen / 100);

    const agility = build.sp_multipliers[SkillPointIndexes.Agility];
    const defence = build.sp_multipliers[SkillPointIndexes.Defence];

    build.stats.ehp_no_agi =
        build.stats.health
        / getEHpFactor(build)
        / (1 - defence);
    build.stats.ehp =
        build.stats.health
        / getEHpFactor(build)
        / ((1 - defence) * (1 - agility) + (0.1 * agility));

    build.stats.ehprPercent = build.stats.healthRegen / 4 / build.stats.health * 100;

    build.stats.lsPercent = build.identifications.lifeSteal / 3 / build.stats.health * 100;

    calculateHealing(build);
}

function calculateHealing(build) {
    // TODO: Fluid Healing
    for (let heal of (build.heals)) heal.heal *= build.stats.health;
}

function getEHpFactor(build) {
    return getClassEHp(build) *
        (build.resistances).reduce((a, b) => a * (1 - b.multiplier), 1);
}

const classBaseResistance = Object.freeze({
    "archer": 0.7,
    "assassin": 1,
    "mage": 0.8,
    "shaman": 0.6,
    "warrior": 1
});

function getClassEHp(build) {
    return 2 - classBaseResistance[build.wynnClass];
}

function calculateSpellCosts(build) {
    const spell_costs = build.spell_costs;

    for (let i in spell_costs) {
        let cost = spell_costs[i];

        cost *= 1 - (0.5 * (build.sp_multipliers[SkillPointIndexes.Intelligence] / getSkillPointMultiplier(150, SkillPointIndexes.Intelligence)));

        cost += build.identifications["raw" + costNames[i] + "SpellCost"];

        cost *= 1 + build.identifications[costNames[i] + "SpellCost"] / 100;

        cost += build.spell_cost_modifiers[i];

        cost = Math.max(cost, 1);

        spell_costs[i] = cost;
    }

    for (const data of build.spell_cost_multipliers)
        spell_costs[data.spell_number] *= data.cost_multiplier;
}

function computeHpr(base, percent) {
    return base <= 0 && percent >= 1 ? 0 :
        base * (1 + percent * Math.sign(base));
}
