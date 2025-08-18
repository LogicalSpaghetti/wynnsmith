EffectTypes = Object.freeze({
    CONVERSION: "conv",
});

function parseEffects(build) {
    parseConversions(build);
}

function parseConversions(build) {
    const effectData = classEffects[build.wynnClass].effects;
    const conversionEffects = build.effects
        .filter((effectId) => effectData[effectId].type === EffectTypes.CONVERSION)
        .map(effectId => effectData[effectId]);

    for (let effect of conversionEffects) {
        const attack = getOrCreateAttack(build, effect.data.internal_name);
        attack.name = effect.data.display_name ?? attack.name;
        attack.type = effect.data.type ?? attack.type;
        attack.conversion = sumConversions(attack.conversion, effect.data.conversion);

        attack.base = newMinMax();
        attack.raw = newMinMax();
    }
}

function getOrCreateAttack(build, internal_name) {
    if (!build.attacks[internal_name]) build.attacks[internal_name] = {};
    return build.attacks[internal_name];
}

function sumConversions(conversionA, conversionB) {
    if (!conversionA) return conversionB;
    if (!conversionB) return conversionA;
    return conversionA.map((a, i) => a + conversionB[i]);
}

const neutral_index = 0;

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