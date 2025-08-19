EffectTypes = Object.freeze({
    CONVERSION: "conv",
    MASTERY: "mastery",
    HEAL: "heal",
    RESISTANCE: "resistance",
    PERSONAL_MULTIPLIER: "personal-multiplier",
    TEAM_MULTIPLIER: "team-multiplier",
});

function parseEffects(build) {
    parseConversions(build);
}

function parseConversions(build) {
    if (build.wynnClass === "") return;
    const effectData = classEffects[build.wynnClass].effects;

    build.effects.forEach(effectId => {
        const effect = effectData[effectId];
        switch (effect.type) {
            case EffectTypes.CONVERSION:
                parseConversionEffect(build, effect);
                break;
            case EffectTypes.MASTERY:
                parseMasteryEffect(build, effect);
                break;
            case EffectTypes.HEAL:
                parseHealEffect(build, effect);
                break;
            case EffectTypes.RESISTANCE:
                parseResistanceEffect(build, effect);
                break;
            case EffectTypes.TEAM_MULTIPLIER:
                parseTeamDamageMultiplierEffect(build, effect);
                break;
            case EffectTypes.PERSONAL_MULTIPLIER:
                parsePersonalDamageMultiplierEffect(build, effect);
                break;
            default:
                throw new Error("Unknown effect type: " + effect.type + ", id: " + effectId);
        }
    });
}

function parseConversionEffect(build, effect) {
    const attack = getOrCreateNamedEffect(build.attacks, effect.data.internal_name);
    attack.type = effect.data.type ?? attack.type;
    attack.is_melee = effect.data.is_melee ?? attack.is_melee;
    attack.conversion = sumConversions(attack.conversion, effect.data.conversion);

    attack.base = newMinMax();
    attack.raw = newMinMax();
    attack.damage = newMinMax();
}

function sumConversions(conversionA, conversionB) {
    if (!conversionA) return conversionB;
    if (!conversionB) return conversionA;
    return conversionA.map((a, i) => a + conversionB[i]);
}

function parseMasteryEffect(build, effect) {
    createUnnamedEffect(build.masteries,
        {
            element: effect.data.element,
            base: effect.data.base,
            pct: effect.data.pct,
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

const neutral_index = 0;
const damage_type_count = 6; // TODO: rename/remove

// enum
const DamageExtremes = Object.freeze({
    MIN: 0,
    MAX: 1,
    MINC: 2,
    MAXC: 3,
});


function newMinMax() {
    return [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];
}