EffectTypes = Object.freeze({
    CONVERSION: "conv",
    MASTERY: "mastery",
    HEAL: "heal",
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
    build.masteries.push({
        element: effect.data.element,
        base: effect.data.base,
        pct: effect.data.pct,
    });

}

function parseHealEffect(build, effect) {
    const heal = getOrCreateNamedEffect(build.heals, effect.data.internal_name);
    heal.heal = (heal.heal ?? 0) + effect.data.heal;
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