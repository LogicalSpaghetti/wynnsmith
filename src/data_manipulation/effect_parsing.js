EffectTypes = Object.freeze({
    CONVERSION: "conv",
    MASTERY: "mastery",
});

function parseEffects(build) {
    parseConversions(build);
}

function parseConversions(build) {
    if (build.wynnClass === "") return;
    const effectData = classEffects[build.wynnClass].effects;

    const conversionEffects = build.effects
        .filter((effectId) => effectData[effectId].type === EffectTypes.CONVERSION)
        .map(effectId => effectData[effectId]);
    for (let effect of conversionEffects) {
        const attack = getOrCreateAttack(build.attacks, effect.data.internal_name);
        attack.type = effect.data.type ?? attack.type;
        attack.is_melee = effect.data.type ?? attack.is_melee;
        attack.conversion = sumConversions(attack.conversion, effect.data.conversion);

        attack.base = newMinMax();
        attack.raw = newMinMax();
    }

    const masteryEffects = build.effects
        .filter((effectId) => effectData[effectId].type === EffectTypes.MASTERY)
        .map(effectId => effectData[effectId]);
    for (let effect of masteryEffects) {
        build.masteries.push({
            element: effect.data.element,
            base: effect.data.base,
            pct: effect.data.pct,
        });
    }
}

function getOrCreateAttack(attacks, internal_name) {
    const found = attacks.find(attack => attack.internal_name === internal_name);
    if (!found) {
        const result = {internal_name: internal_name};
        attacks.push(result);
        return result;
    }
    return found;
}

function sumConversions(conversionA, conversionB) {
    if (!conversionA) return conversionB;
    if (!conversionB) return conversionA;
    return conversionA.map((a, i) => a + conversionB[i]);
}

const neutral_index = 0;
const damage_type_count = 6; // TODO: rename

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