`use strict`;

// TODO: remove all non-damage sections to a separate function
function calculateDamageConversions(build) {

    splitMergedIds(build);
    damagesToArrays(build);

    sortPowders(build);
    powderConversions(build);
    addSkillPointPercents(build);
    addWeaponSpecial(build);

    conversions(build);

    applyMasteries(build);

    applySpellAttackSpeed(build);

    applyPercents(build);

    mergeAttackDamage(build);
    createHealing(build);

    applyMultipliers(build);
    applyOverridingDamageBuffs(build);
    addAttackVariants(build);
    zeroNegatives(build);

    applyStrDex(build);
}

// TODO: Move elsewhere
function splitMergedIds(build) {
    const ids = build.ids;
    const final = build.final;

    // % Damages:
    elementalPrefixes.forEach((type) => {
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
    elementalNames.forEach((type) => {
        const typedDamage = ids["raw" + type + "Damage"];

        final["raw" + type + "MainAttackDamage"] = ids["raw" + type + "MainAttackDamage"] + typedDamage;
        final["raw" + type + "SpellDamage"] = ids["raw" + type + "SpellDamage"] + typedDamage;
    });

    // split eleDef
    elementalPrefixes.filter((prefix) => prefix !== "neutral")
        .forEach((prefix) => {
            ids[prefix + "Defence"] += ids.elementalDefence;
        });
}

// TODO: refactor and move to a different file
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

function sortPowders(build) {
    sortPowderGroup(build.powders.weapon);
    build.powders.armour
}

function sortPowderGroup(group) {
    const order = []
    group.forEach((powder) => {
        if (order.indexOf(powder[0]) === -1) order.push(powder[0]);
    });
    group.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
}

function addWeaponSpecial(build) {
    const tiered = build.powders.weapon.filter(powder => powder[1] > 3)
    let first = tiered[0];
    for (let i = 1; i < tiered.length; i++) {
        if (tiered[i][0] === first[0]) {
            build.specials.weapon = first[0] + (parseInt(tiered[i][1]) + parseInt(first[1]) - 7);
            return;
        }
        first = tiered[i];
    }
}

function addArmourSpecials(build) {
    // TODO
}

function powderConversions(build) {
    const base = build.base;

    const weaponPowders = build.powders.weapon;

    let neutral = 100;
    let modifierPercents = [0, 0, 0, 0, 0, 0];

    for (let i in weaponPowders) {
        const powder = powders[weaponPowders[i]];
        const elementalIndex = elementalNames.indexOf(powder.element);

        base.min[elementalIndex] += powder.dmg.min;
        base.max[elementalIndex] += powder.dmg.max;

        if (neutral < 1) continue;

        const modPercent = Math.min(neutral, powder.conversion);
        neutral -= modPercent;
        modifierPercents[elementalIndex] += modPercent;
    }

    const oldNeutral = {min: base.min[0], max: base.max[0]};

    base.min[0] *= neutral / 100;
    base.max[0] *= neutral / 100;

    for (let i in modifierPercents) {
        const modifier = modifierPercents[i] / 100;
        base.min[i] += modifier * oldNeutral.min;
        base.max[i] += modifier * oldNeutral.max;
    }
}

function addSkillPointPercents(build) {
    for (let i = 0; i < 5; i++) {
        const mult = build.sp.mults[i] * 100;

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
    Object.keys(build.conversions).forEach((convName) => {
        // [a, b, c, d, e, f]
        build.base.attacks[convName] = {};
        const conv = build.base.attacks[convName];
        conv.min = [0, 0, 0, 0, 0, 0];
        conv.max = [0, 0, 0, 0, 0, 0];

        // elemental conversions
        for (let i = 1; i < 6; i++) {
            conv.min[i] = (build.conversions[convName][i] / 100) * build.base.min.reduce((a, b) => a + b);
            conv.max[i] = (build.conversions[convName][i] / 100) * build.base.max.reduce((a, b) => a + b);
        }

        // neutral conversion
        const neutralConversion = build.conversions[convName][0] / 100;
        for (let i = 0; i < 6; i++) {
            conv.min[i] += build.base.min[i] * neutralConversion;
            conv.max[i] += build.base.max[i] * neutralConversion;
        }
    });
}

function convertRaw(build) {
    const rawAttacks = (build.rawAttacks = {});
    Object.keys(build.conversions).forEach((convName) => {
        const conv = build.conversions[convName];
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
            // damage
            rawAttacks[convName].min[i] += percentage * build.ids.rawDamage;
            // elemental damage
            if (i > 0) {
                rawAttacks[convName].min[i] +=
                    percentage * (build.ids.rawElementalDamage + build.ids["rawElemental" + type + "Damage"]);
            }
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
        for (let i = 1; i < elementalPrefixes.length; i++) {
            // skip any zeros
            if (attack.max[i] === 0) continue;

            // ensure the node has been taken
            if (!build.nodes.includes(build.wynnClass + elementalNames[i] + "Path")) continue;

            const prefix = elementalPrefixes[i];
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
    Object.keys(build.conversions).forEach((attackName) => {
        const baseAttack = build.base.attacks[attackName];
        const rawAttack = build.rawAttacks[attackName];

        build.attacks[attackName] = {min: [0, 0, 0, 0, 0, 0], max: [0, 0, 0, 0, 0, 0]};

        for (let i = 0; i < 6; i++) {
            build.attacks[attackName].min[i] = baseAttack.min[i] + rawAttack.min[i];
            build.attacks[attackName].max[i] = baseAttack.max[i] + rawAttack.max[i];
        }
    });
}

// TODO: min, max, minc, and maxc are stupid and I want a better system
function applyStrDex(build) {
    const strMult = 1 + build.sp.mults[0];
    const dexMult = 1 + build.ids.criticalDamageBonus / 100;

    Object.keys(build.attacks).forEach((attackName) => {
        const attack = build.attacks[attackName];

        attack.minc = attack.min.slice(0);
        attack.maxc = attack.max.slice(0);

        for (let i = 0; i < 6; i++) {
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

function mergeElementalDefences(build) {
    for (let i = 1; i < 6; i++) {
        build.final["total" + elementalNames[i] + "Defence"] =
            build.base["base" + elementalNames[i] + "Defence"] *
            (Math.sign(build.base["base" + elementalNames[i] + "Defence"]) * (build.ids[elementalPrefixes[i] + "Defence"] / 100) +
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

function getAsMax(possibleInt) {
    if (Number.isInteger(possibleInt)) return possibleInt;
    return possibleInt.max;
}
