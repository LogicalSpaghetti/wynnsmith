import * as search from "../read_write/item_search.js";
import classEffects from "../data/effects.js";

export function newMinMax() {
    return [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ];
}

const EffectTypes = Object.freeze({
    EMPTY: "",
    CONVERSION: "conv",
    VARIANT: "variant",
    DISPLAY: "display",
    MASTERY: "mastery",
    HEAL: "heal",
    ID_HEAL: "id-heal-multiplier",
    HEAL_VARIANT: "heal-variant",
    RESISTANCE: "resistance",
    PERSONAL_MULTIPLIER: "personal-multiplier",
    TEAM_MULTIPLIER: "team-multiplier",
    COST: "cost",
    COST_MULTIPLIER: "cost-multiplier",
    ID_MULTIPLIER: "id-multiplier"
});

export function getAbilities(inputAbilities, weapon, equipment) {
    const items = equipment.concat(weapon);

    inputAbilities.majorIds = getMajorIds(items);
    inputAbilities.powderSpecials = items.map(item => item?.special).filter(item => item != null);

    return inputAbilities;
}

function getMajorIds(items) {
    if (!items.length) return search.getItemByName(items.name)?.majorIds;
    return items.reduce((arr, item) => arr.concat(search.getItemByName(item?.name)?.majorIds), [])
        .filter(item => item != null);
}

export function getBuildEffects(abilities, wynnClass) {
    let effects = getEffects(abilities, wynnClass);
    return getWithoutBlockedEffects(effects, wynnClass);
}

function getEffects(abilities, wynnClass) {
    const effectsData = classEffects[wynnClass]?.effects;
    if (!effectsData) throw new Error(`Effects not found for class: ${wynnClass}!`);
    const unvalidatedEffectIds = Object.keys(effectsData);

    const effects = [];
    for (let i = 0; i < unvalidatedEffectIds.length;) {
        const id = unvalidatedEffectIds[i];
        const effect = effectsData[id];
        let hasAllParents = true;
        let hasAnyParents = false;
        for (let parent of effect.parents)
            if (abilities[parent.section].includes(parent.id)) {
                hasAnyParents = true;
            } else {
                hasAllParents = false;
            }
        if ((hasAnyParents && !effect.requires_all) || hasAllParents) {
            effects.push(id);
            unvalidatedEffectIds.splice(i, 1);
            i = 0;
        } else i++;
    }

    return effects;
}

export function getSplitEffects(effects, toggles, wynnClass) {
    // TODO: remove "effects" from splitEffects
    const splitEffects = {
        effects: effects,

        attacks: [],
        variants: {},
        displays: [],
        masteries: [],
        heals: [],
        resistances: [],
        personal_multipliers: [],
        team_multipliers: [],
        spell_costs: [0, 0, 0, 0],
        spell_cost_modifiers: [0, 0, 0, 0],
        spell_cost_multipliers: [],
        id_multipliers: []
    };

    const effectData = classEffects[wynnClass].effects;

    for (const effectId of effects) {
        const effect = effectData[effectId];

        if (effect.toggle_name && !toggles.includes(effect.toggle_name)) continue;

        switch (effect.type) {
            case EffectTypes.EMPTY:
                break;
            case EffectTypes.CONVERSION:
                parseConversionEffect(splitEffects, effect, effectId);
                break;
            case EffectTypes.VARIANT:
                parseVariantEffect(splitEffects, effect, effectId);
                break;
            case EffectTypes.DISPLAY:
                parseDisplayEffect(splitEffects, effect, effectId);
                break;
            case EffectTypes.MASTERY:
                parseMasteryEffect(splitEffects, effect);
                break;
            case EffectTypes.HEAL:
                parseHealEffect(splitEffects, effect);
                break;
            case EffectTypes.HEAL_VARIANT:
                parseHealVariantEffect(splitEffects, effect);
                break;
            case EffectTypes.ID_HEAL:
                parseIdRelativeHealEffect(splitEffects, effect);
                break;
            case EffectTypes.RESISTANCE:
                parseResistanceEffect(splitEffects, effect);
                break;
            case EffectTypes.TEAM_MULTIPLIER:
                parseTeamDamageMultiplierEffect(splitEffects, effect);
                break;
            case EffectTypes.PERSONAL_MULTIPLIER:
                parsePersonalDamageMultiplierEffect(splitEffects, effect);
                break;
            case EffectTypes.COST:
                parseSpellCostEffect(splitEffects, effect);
                break;
            case EffectTypes.COST_MULTIPLIER:
                parseSpellCostMultiplierEffect(splitEffects, effect);
                break;
            case EffectTypes.ID_MULTIPLIER:
                parseIdMultiplierEffect(splitEffects, effect);
                break;
            default:
                throw new Error("Unknown effect type: " + effect.type + ", id: " + effectId);
        }
    }

    return splitEffects;
}

function parseConversionEffect(build, effect) {
    const attack = getOrCreateNamedEffect(build.attacks, effect.data.id);
    attack.type = effect.data.type ?? attack.type;
    attack.is_melee = effect.data.is_melee ?? attack.is_melee;
    attack.conversion = sumConversions(attack.conversion, effect.data.conversion);

    if (effect.data.extra_hits) attack.extra_hits = (attack.extra_hits ?? 0) + effect.data.extra_hits;
    if (effect.data.frequency) attack.frequency = (attack.frequency ?? 1) * effect.data.frequency;
    if (effect.data.duration) attack.duration = (attack.duration ?? 0) + effect.data.duration;

    attack.base = newMinMax();
    attack.raw = [0, 0, 0, 0, 0, 0];
    attack.damage = newMinMax();
}

function sumConversions(conversionA, conversionB) {
    if (!conversionA) return conversionB;
    if (!conversionB) return conversionA;
    return conversionA.map((a, i) => a + conversionB[i]);
}

function parseVariantEffect(build, effect, effectId) {
    const variant = build.variants[effectId] = {};
    variant.type = effect.data.type;
    variant.attack = effect.data.attack;
    variant.label = effect.data.label;
    if (effect.data.second_attack) variant.second_attack = effect.data.second_attack;
    if (effect.data.multiplier) variant.multiplier = effect.data.multiplier;
}

function parseDisplayEffect(build, effect, effectId) {
    const display = getOrCreateNamedEffect(build.displays, effectId);
    display.name = effect.data.name || display.name;
    display.variants = (display.variants ?? []).concat(effect.data.variants);
    display.label = effect.data.label || display.label;

    if (effect.data.spell) display.spell = effect.data.spell;
    if (effect.data.parent) display.parent = effect.data.parent;
    display.children = {};
}

function parseMasteryEffect(build, effect) {
    createUnnamedEffect(build.masteries,
        {
            element: effect.data.element,
            base: effect.data.base,
            pct: effect.data.pct
        });
}

function parseHealEffect(build, effect) {
    const heal = getOrCreateNamedEffect(build.heals, effect.data.id);
    heal.percent = (heal.percent ?? 0) + effect.data.percent;
}

function parseHealVariantEffect(build, effect) {
    createUnnamedEffect(build.heal_variants, effect.data);
}

function parseIdRelativeHealEffect(build, effect) {
    createUnnamedEffect(build.heal_id_multipliers, effect.data);
}

function parseResistanceEffect(build, effect) {
    const resistance = getOrCreateNamedEffect(build.resistances, effect.data.internal_name);
    resistance.multiplier = (resistance.multiplier ?? 0) + effect.data.multiplier;
}

function parseTeamDamageMultiplierEffect(build, effect) {
    const teamMultiplier = getOrCreateNamedEffect(build.team_multipliers, effect.data.internal_name);
    teamMultiplier.multiplier = (teamMultiplier.multiplier ?? 0) + effect.data.multiplier;
    teamMultiplier.type = effect.data.type ?? teamMultiplier.type;
}

function parsePersonalDamageMultiplierEffect(build, effect) {
    const personalMultiplier = getOrCreateNamedEffect(build.personal_multipliers, effect.data.internal_name);
    personalMultiplier.multiplier = (personalMultiplier.multiplier ?? 0) + effect.data.multiplier;
    personalMultiplier.target = effect.data.target ?? personalMultiplier.target;
}

function parseSpellCostEffect(build, effect) {
    if (effect.data.is_base_spell) {
        build.spell_costs[effect.data.spell_number] += effect.data.cost;
    } else {
        build.spell_cost_modifiers[effect.data.spell_number] += effect.data.cost;
    }
}

function parseSpellCostMultiplierEffect(build, effect) {
    createUnnamedEffect(build.spell_cost_multipliers, effect.data);
}

function parseIdMultiplierEffect(build, effect) {
    createUnnamedEffect(build.id_multipliers, effect.data);
}

function getOrCreateNamedEffect(effectArray, internal_name) {
    const found = effectArray.find(effect => effect.internal_name === internal_name);
    if (!found) {
        const result = {internal_name: internal_name};
        effectArray.push(result);
        return result;
    }
    return found;
}

function createUnnamedEffect(effectArray, data) {
    effectArray.push(data);
}

function getWithoutBlockedEffects(effects, wynnClass) {
    const blockedIndexes = effects.reduce((arr, id) =>
        arr.concat(classEffects[wynnClass].effects[id].blocks), []);

    return effects.filter(id => !blockedIndexes.includes(id));
}