`use strict`;

const neutral_index = 0;
const damage_type_count = 6;

function newMinMax() {
    return [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ];
}

EffectTypes = Object.freeze({
    EMPTY: "",
    CONVERSION: "conv",
    MASTERY: "mastery",
    HEAL: "heal",
    RESISTANCE: "resistance",
    PERSONAL_MULTIPLIER: "personal-multiplier",
    TEAM_MULTIPLIER: "team-multiplier",
    COST: "cost",
    COST_MULTIPLIER: "cost-multiplier",
    VARIANT: "variant",
    DISPLAY: "display"
});

function getAbilities(inputAbilities, weapon, equipment) {
    const items = equipment.concat(weapon);

    inputAbilities.majorIds = getMajorIds(items);
    inputAbilities.powderSpecials = items.map(item => item?.special).filter(item => item != null);

    return inputAbilities;
}

function getBuildEffects(abilities, wynnClass) {
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

    return effects.filter(effectId =>
        !effectsData[effectId].toggle_name || !abilities.toggles.includes(effectsData[effectId].toggle_name));

}

function getSplitEffects(effects, wynnClass) {
    // TODO: remove "effects" from splitEffects
    const splitEffects = {
        effects: effects,

        attacks: [],
        masteries: [],
        heals: [],
        resistances: [],
        personal_multipliers: [],
        team_multipliers: [],
        spell_costs: [0, 0, 0, 0],
        spell_cost_modifiers: [0, 0, 0, 0],
        spell_cost_multipliers: [],
        variants: [],
        displays: []
    };

    const effectData = classEffects[wynnClass].effects;

    effects.forEach(effectId => {
        const effect = effectData[effectId];

        switch (effect.type) {
            case EffectTypes.EMPTY:
                break;
            case EffectTypes.CONVERSION:
                parseConversionEffect(splitEffects, effect);
                break;
            case EffectTypes.VARIANT:
                parseVariantEffect(splitEffects, effect);
                break;
            case EffectTypes.DISPLAY:
                parseDisplayEffect(splitEffects, effect);
                break;
            case EffectTypes.MASTERY:
                parseMasteryEffect(splitEffects, effect);
                break;
            case EffectTypes.HEAL:
                parseHealEffect(splitEffects, effect);
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
            default:
                throw new Error("Unknown effect type: " + effect.type + ", id: " + effectId);
        }
    });

    return splitEffects;
}


function parseConversionEffect(build, effect) {
    const attack = getOrCreateNamedEffect(build.attacks, effect.data.internal_name);
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

function parseVariantEffect(build, effect) {
    const variant = getOrCreateNamedEffect(build.variants, effect.data.internal_name);
    variant.type = effect.data.type;
    variant.attack = effect.data.attack;
    variant.label = effect.data.label;
    if (effect.data.second_attack) variant.second_attack = effect.data.second_attack;
}

function parseDisplayEffect(build, effect) {
    createUnnamedEffect(build.displays, effect.data);
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
    const heal = getOrCreateNamedEffect(build.heals, effect.data.internal_name);
    heal.heal = (heal.heal ?? 0) + effect.data.heal;
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