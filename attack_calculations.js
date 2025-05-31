`use strict`;

function computeOutputs(build) {
    // Powders
    addPowderBaseDamage(build);
    addPowderDefences(build);
    addArmourSpecials(build);

    splitMergedIds(build);
    damagesToArrays(build);

    addSPMults(build);

    conversions(build);

    powderConversions(build);

    applyMasteries(build);

    applySpellAttackSpeed(build);

    applyPercents(build);

    mergeAttackDamage(build);
    createHealing(build);

    applyMultipliers(build);
    addAttackVariants(build);
    zeroNegatives(build);

    // also adds crit damage min/max to each attacks (minc and maxc)
    applyStrDex(build);
}

function addPowderBaseDamage(build) {
    // Add powder base damage:
    for (let i = 0; i < build.powders.weapon.length; i++) {
        const powder = powders[build.powders.weapon[i]];
        addBase(build, powder.dmg, "base" + powder.element + "Damage");
    }
}

function addPowderDefences(build) {
    for (let i = 0; i < build.powders.armour.length; i++) {
        const powder = powders[build.powders.armour[i]];
        const powderDefs = powder.def;
        for (let j = 0; j < powderDefs.length; j++) {
            if (powderDefs[j] === 0) continue;
            addBase(build, powderDefs[j], "base" + damageTypes[j + 1] + "Defence");
        }
    }
}

function addArmourSpecials(build) {
    // TODO
}

function addWeaponSpecial(build) {
    // TODO
}

const prefixes = ["neutral", "earth", "thunder", "water", "fire", "air"];
const damageTypes = ["Neutral", "Earth", "Thunder", "Water", "Fire", "Air"];

function splitMergedIds(build) {
    const ids = build.ids;
    const final = build.final;

    // % Damages:
    prefixes.forEach((type) => {
        const typedDamage = ids.damage + ids[type + "Damage"] + (type === "neutral" ? 0 : ids.elementalDamage);

        final[type + "MainAttackDamage"] =
            ids[type + "MainAttackDamage"] +
            ids.mainAttackDamage +
            typedDamage +
            (type === "neutral" ? 0 : ids["elementalMainAttackDamage"]);
        final[type + "SpellDamage"] =
            ids[type + "SpellDamage"] +
            ids.spellDamage +
            typedDamage +
            (type === "neutral" ? 0 : ids["elementalSpellDamage"]);
    });

    // raw Damages
    damageTypes.forEach((type) => {
        const typedDamage = ids["raw" + type + "Damage"];

        final["raw" + type + "MainAttackDamage"] = ids["raw" + type + "MainAttackDamage"] + typedDamage;
        final["raw" + type + "SpellDamage"] = ids["raw" + type + "SpellDamage"] + typedDamage;
    });

    // eleDef => typeDef
    prefixes
        .filter((prefix) => prefix !== "neutral")
        .forEach((prefix) => {
            ids[prefix + "Defence"] += ids.elementalDefence;
        });
}

// splits base damage into a min and max array
function damagesToArrays(build) {
    const final = build.final;
    const base = build.base;

    // base
    base.min = [
        base.baseDamage.min,
        base.baseEarthDamage.min,
        base.baseThunderDamage.min,
        base.baseWaterDamage.min,
        base.baseFireDamage.min,
        base.baseAirDamage.min,
    ];
    base.max = [
        base.baseDamage.max,
        base.baseEarthDamage.max,
        base.baseThunderDamage.max,
        base.baseWaterDamage.max,
        base.baseFireDamage.max,
        base.baseAirDamage.max,
    ];

    final.totalDamage = {};
    final.totalDamage.min = base.min[0] + base.min[1] + base.min[2] + base.min[3] + base.min[4] + base.min[5];
    final.totalDamage.max = base.max[0] + base.max[1] + base.max[2] + base.max[3] + base.max[4] + base.max[5];

    // raw
    final.splitRawMainAttackDamage = [
        final.rawNeutralMainAttackDamage,
        final.rawEarthMainAttackDamage,
        final.rawThunderMainAttackDamage,
        final.rawWaterMainAttackDamage,
        final.rawFireMainAttackDamage,
        final.rawAirMainAttackDamage,
    ];

    delete final.rawNeutralMainAttackDamage;
    delete final.rawEarthMainAttackDamage;
    delete final.rawThunderMainAttackDamage;
    delete final.rawWaterMainAttackDamage;
    delete final.rawFireMainAttackDamage;
    delete final.rawAirMainAttackDamage;

    final.splitRawSpellDamage = [
        final.rawNeutralSpellDamage,
        final.rawEarthSpellDamage,
        final.rawThunderSpellDamage,
        final.rawWaterSpellDamage,
        final.rawFireSpellDamage,
        final.rawAirSpellDamage,
    ];

    delete final.rawNeutralSpellDamage;
    delete final.rawEarthSpellDamage;
    delete final.rawThunderSpellDamage;
    delete final.rawWaterSpellDamage;
    delete final.rawFireSpellDamage;
    delete final.rawAirSpellDamage;

    // percent
    final.mainAttackDamage = [
        final.neutralMainAttackDamage,
        final.earthMainAttackDamage,
        final.thunderMainAttackDamage,
        final.waterMainAttackDamage,
        final.fireMainAttackDamage,
        final.airMainAttackDamage,
    ];

    delete final.neutralMainAttackDamage;
    delete final.earthMainAttackDamage;
    delete final.thunderMainAttackDamage;
    delete final.waterMainAttackDamage;
    delete final.fireMainAttackDamage;
    delete final.airMainAttackDamage;

    final.spellDamage = [
        final.neutralSpellDamage,
        final.earthSpellDamage,
        final.thunderSpellDamage,
        final.waterSpellDamage,
        final.fireSpellDamage,
        final.airSpellDamage,
    ];

    delete final.neutralSpellDamage;
    delete final.earthSpellDamage;
    delete final.thunderSpellDamage;
    delete final.waterSpellDamage;
    delete final.fireSpellDamage;
    delete final.airSpellDamage;
}

function addSPMults(build) {
    for (let i = 0; i < 5; i++) {
        var mult = build.sp.mults[i] * 100;

        build.final.mainAttackDamage[i + 1] += mult;
        build.final.spellDamage[i + 1] += mult;
    }
}

function conversions(build) {
    createConversions(build);
    convertBase(build);
    convertRaw(build);
}

function convertBase(build) {
    build.base.attacks = {};
    Object.keys(build.convs).forEach((convName) => {
        // [a, b, c, d, e, f]
        build.base.attacks[convName] = {};
        const conv = build.base.attacks[convName];
        conv.min = [0, 0, 0, 0, 0, 0];
        conv.max = [0, 0, 0, 0, 0, 0];

        // elemental conversions
        for (let i = 1; i < 6; i++) {
            conv.min[i] = (build.convs[convName][i] / 100) * build.final.totalDamage.min;
            conv.max[i] = (build.convs[convName][i] / 100) * build.final.totalDamage.max;
        }

        // neutral conversion
        const neutralConversion = build.convs[convName][0] / 100;
        for (let i = 0; i < 6; i++) {
            conv.min[i] += build.base.min[i] * neutralConversion;
            conv.max[i] += build.base.max[i] * neutralConversion;
        }
    });
}

function convertRaw(build) {
    const rawAttacks = (build.rawAttacks = {});
    Object.keys(build.convs).forEach((convName) => {
        const conv = build.convs[convName];
        const convMult = conv.reduce((partialSum, a) => partialSum + a, 0);

        const baseConvMin = build.base.attacks[convName].min;
        const baseConvMax = build.base.attacks[convName].max;

        const baseMin = build.base.attacks[convName].min;
        const baseMax = build.base.attacks[convName].max;

        const baseMinTotal = baseMin.reduce((partialSum, a) => partialSum + a, 0);
        const baseMaxTotal = baseMax.reduce((partialSum, a) => partialSum + a, 0);
        const baseSumTotal = baseMinTotal + baseMaxTotal;

        const baseElemMinTotal = baseMin.reduce((partialSum, a) => partialSum + a, 0) - baseMin[0];
        const baseElemMaxTotal = baseMax.reduce((partialSum, a) => partialSum + a, 0) - baseMax[0];

        rawAttacks[convName] = {};
        rawAttacks[convName].min = [0, 0, 0, 0, 0, 0];
        rawAttacks[convName].max = [0, 0, 0, 0, 0, 0];

        const isMelee = meleeAttacks.includes(convName);
        const type = isMelee ? "MainAttack" : "Spell";

        for (let i = 0; i < 6; i++) {
            if (baseConvMax[i] === 0) continue;
            const percentage = (baseMin[i] + baseMax[i]) / baseSumTotal;

            // min
            // NETWFA
            rawAttacks[convName].min[i] = build.final["splitRaw" + type + "Damage"][i];
            console.log(rawAttacks[convName].min[i]);
            // damage
            rawAttacks[convName].min[i] += percentage * build.ids.rawDamage;
            console.log(JSON.stringify(rawAttacks[convName]));
            // elemental damage
            if (i > 0) {
                rawAttacks[convName].min[i] +=
                    percentage * (build.ids.rawElementalDamage + build.ids["rawElemental" + type + "Damage"]);
            }
            console.log(JSON.stringify(rawAttacks[convName]));
            // main/spell
            rawAttacks[convName].min[i] += percentage * build.ids["raw" + type + "Damage"];

            rawAttacks[convName].min[i] *= convMult / 100;

            // max
            // NETWFA
            rawAttacks[convName].max[i] = build.final["splitRaw" + type + "Damage"][i];
            // damage
            rawAttacks[convName].max[i] += percentage * build.ids.rawDamage;
            // elemental damage
            if (i > 0) {
                rawAttacks[convName].max[i] +=
                    (baseMax[i] / baseElemMaxTotal) *
                    (build.ids.rawElementalDamage + build.ids["rawElemental" + type + "Damage"]);
            }
            // main/spell
            rawAttacks[convName].max[i] += percentage * build.ids["raw" + type + "Damage"];
            rawAttacks[convName].max[i] *= convMult / 100;
        }
    });
}

function powderConversions(build) {
    // TODO
}

// Attack Speed multiplies the damage of spells relative to the weapon's base attack speed multiplier
function applySpellAttackSpeed(build) {
    const attackSpeedMultiplier = attackSpeedMultipliers[build.attackSpeed];
    Object.keys(build.base.attacks).forEach((convName) => {
        if (meleeAttacks.includes(convName)) return;
        const conv = build.base.attacks[convName];
        for (let i = 0; i < 6; i++) {
            conv.min[i] *= attackSpeedMultiplier;
            conv.max[i] *= attackSpeedMultiplier;
        }
    });
}

function applyMasteries(build) {
    Object.keys(build.base.attacks).forEach((attackName) => {
        const attack = build.base.attacks[attackName];
        const min = attack.min;
        const max = attack.max;
        for (let i = 1; i < prefixes.length; i++) {
            // skip any zeros
            if (attack.max[i] === 0) continue;

            // ensure the node has been taken
            if (!build.nodes.includes(build.wynnClass + damageTypes[i] + "Path")) continue;

            const prefix = prefixes[i];
            const mastery = masteries[build.wynnClass][prefix + "Mastery"];

            // Masteries Node base values are added to any non-zero damage values.
            // add mastery.min/max
            min[i] += mastery.base.min;
            max[i] += mastery.base.max;

            // Mastery multipliers are applied to the base conversions.
            min[i] *= mastery.mult;
            max[i] *= mastery.mult;
        }
    });
}

function applyPercents(build) {
    const baseAttacks = build.base.attacks;
    Object.keys(baseAttacks).forEach((attackName) => {
        const attack = baseAttacks[attackName];
        const mults = build.final[meleeAttacks.includes(attackName) ? "mainAttackDamage" : "spellDamage"];
        for (let i = 0; i < 6; i++) {
            attack.min[i] *= mults[i] / 100 + 1;
            attack.max[i] *= mults[i] / 100 + 1;
        }
    });
}

function mergeAttackDamage(build) {
    // TODO
    Object.keys(build.convs).forEach((attackName) => {
        const baseAttack = build.base.attacks[attackName];
        const rawAttack = build.rawAttacks[attackName];

        build.attacks[attackName] = { min: [0, 0, 0, 0, 0, 0], max: [0, 0, 0, 0, 0, 0] };

        for (let i = 0; i < 6; i++) {
            build.attacks[attackName].min[i] = baseAttack.min[i] + rawAttack.min[i];
            build.attacks[attackName].max[i] = baseAttack.max[i] + rawAttack.max[i];
        }
    });
}

function applyStrDex(build) {
    const strInt = parseInt(spInputs[0].value);
    const strMult = strInt === undefined ? 1 : 1 + (strInt > 150 ? spMultipliers[150] : spMultipliers[strInt]);
    const dexMult = 1 + build.ids.criticalDamageBonus / 100;

    Object.keys(build.attacks).forEach((attackName) => {
        const attack = build.attacks[attackName];

        attack.minc = attack.min.slice(0);
        attack.maxc = attack.max.slice(0);

        for (let i = 1; i < 6; i++) {
            // what is this for?
            // const textInt = parseInt(spInputs[i - 1].value > 150 ? 150 : spInputs[i - 1].value);
            // const mult = textInt === undefined ? 0 : spMultipliers[textInt];
            // attack.min[i] *= 1 + mult;
            // attack.max[i] *= 1 + mult;

            // Crit
            attack.minc[i] *= dexMult + strMult;
            attack.maxc[i] *= dexMult + strMult;

            // Strength
            attack.min[i] *= strMult;
            attack.max[i] *= strMult;
        }
    });
}

function zeroNegatives(build) {
    Object.keys(build.attacks).forEach((attackName) => {
        const attack = build.attacks[attackName];
        for (let i = 0; i < 6; i++) {
            if (attack.min[i] < 0) attack.min[i] = 0;
            if (attack.max[i] < 0) attack.max[i] = 0;
        }
    });
}

function createHealing(build) {
    addHeal(build, "nodes", "bloodPool", "First Wave Heal", 25);
    addHeal(build, "nodes", "regeneration", "Regeneration Tick", 1);
}

function addHeal(build, sect, checkName, healName, healAmount) {
    if (build[sect].includes(checkName)) {
        build.heals[healName] = healAmount;
    }
}

function mergeElementalDefences(build) {
    for (let i = 1; i < 6; i++) {
        build.final["total" + damageTypes[i] + "Defence"] =
            build.base["base" + damageTypes[i] + "Defence"] *
            (Math.sign(build.base["base" + damageTypes[i] + "Defence"]) * (build.ids[prefixes[i] + "Defence"] / 100) +
                1);
    }
}

function deleteAllZerosFromObject(source) {
    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; i++) {
        if (source[keys[i]] === 0) {
            delete source[keys[i]];
        }
    }
}

// undefined to zero
function udfZ(value) {
    return value === undefined ? 0 : value;
}

function getAsMax(possibleInt) {
    if (Number.isInteger(possibleInt)) return possibleInt;
    return possibleInt.max;
}

function getAsMinMax(possibleInt) {
    if (Number.isInteger(possibleInt)) {
        return {
            min: possibleInt,
            max: possibleInt,
        };
    }
    delete possibleInt.raw;

    return possibleInt;
}

function multiplyMinAndMaxBy(target, multiplier) {
    target.min *= multiplier + Number.EPSILON;
    target.max *= multiplier + Number.EPSILON;
}
