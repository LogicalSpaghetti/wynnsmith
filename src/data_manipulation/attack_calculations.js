`use strict`;

function calculateDamageConversions(build) {
    addSkillPointPercents(build);

    addPowderBase(build);

    createConversions(build);
    convertBase(build);
    convertRaw(build);
    powderNeutralConversions(build);

    applyPercents(build);
    applyMasteries(build);
    applySpellAttackSpeed(build);

    mergeAttackDamage(build);

    createHealing(build);

    applyMultipliers(build);
    applyOverridingDamageBuffs(build);
    applyStrDex(build);

    addAttackVariants(build);
    zeroNegatives(build);
}

function addPowderBase(build) {

    build.powders.weapon.forEach(powderName => {
        const powder = powders[powderName];
        const elementalIndex = elementalNames.indexOf(powder.element);

        // new
        build.base.damage[DamageExtremes.MIN][elementalIndex] += powder.dmg.min;
        build.base.damage[DamageExtremes.MAX][elementalIndex] += powder.dmg.max;

        // old
        build.base.min[elementalIndex] += powder.dmg.min;
        build.base.max[elementalIndex] += powder.dmg.max;
    });
}

// TODO: once final is reworked, move to stat_calculations.js or something
function addSkillPointPercents(build) {
    for (let i = 0; i < build.sp.mults; i++) {
        const mult = build.sp.mults[i] * 100;

        build.final.mainAttackDamage[i + 1] += mult;
        build.final.spellDamage[i + 1] += mult;
    }
}

function convertBase(build) {
    // new
    Object.keys(build.attacks).forEach((attackName) => {
        const attack = build.attacks[attackName];

        const neutralConversion = attack.conversion[0] / 100;

        for (let extremeIndex in attack.base) {
            const extremeTotal = build.base.damage[extremeIndex].reduce((a, b) => a + b);

            for (let i in attack.base[extremeIndex]) attack.base[extremeIndex][i] +=
                build.base.damage[extremeIndex][i] * neutralConversion +
                (parseInt(i) !== neutral_index ? (attack.conversion[i] / 100) * extremeTotal : 0);
        }
    });

    // old
    build.base.attacks = {};
    Object.keys(build.conversions).forEach((convName) => {
        // [a, b, c, d, e, f]
        build.base.attacks[convName] = {};
        const attack = build.base.attacks[convName];
        attack.min = [0, 0, 0, 0, 0, 0];
        attack.max = [0, 0, 0, 0, 0, 0];

        // elemental conversions
        for (let i = 1; i < 6; i++) {
            attack.min[i] = (build.conversions[convName][i] / 100) * build.base.min.reduce((a, b) => a + b);
            attack.max[i] = (build.conversions[convName][i] / 100) * build.base.max.reduce((a, b) => a + b);
        }

        // neutral conversion
        const neutralConversion = build.conversions[convName][0] / 100;
        for (let i = 0; i < damage_type_count; i++) {
            attack.min[i] += build.base.min[i] * neutralConversion;
            attack.max[i] += build.base.max[i] * neutralConversion;
        }
    });
}

function convertRaw(build) {
    // new
    Object.keys(build.attacks).forEach((attackName) => {
        const attack = build.attacks[attackName];

        const conversionTotal =
            attack.conversion.reduce((sum, a) => sum + parseInt(a), 0) / 100;
        const baseTotals =
            attack.base.map(extreme => extreme.reduce((partialSum, a) => partialSum + a));
        const baseElemTotals =
            attack.base.map(extreme => extreme.reduce((partialSum, a) => partialSum + a, -extreme[0]));

        for (let extremeIndex in attack.raw) {
            const extreme = attack.raw[extremeIndex];
            for (let i in extreme) {
                if (attack.base[DamageExtremes.MAX][i] === 0) continue;

                const percentage = attack.base[extremeIndex][i] / baseTotals[extremeIndex];
                const elemPercentage = attack.base[extremeIndex][i] / baseElemTotals[extremeIndex];

                // NETWFA
                extreme[i] = build.final["raw" + attack.type + "Damages"][i];
                // damage
                extreme[i] += (attack.base[extremeIndex][i] / baseTotals[extremeIndex]) * build.ids.rawDamage;
                // ElementalDamage
                if (i !== neutral_index) {
                    extreme[i] +=
                        (elemPercentage) *
                        (build.ids[`rawElemental${attack.type}Damage`]);
                }
                // main/spell
                extreme[i] += percentage * build.ids[`raw${attack.type}Damage`];
                extreme[i] *= conversionTotal;
            }
        }
    });

    // old
    const rawAttacks = build.rawAttacks = {};
    Object.keys(build.conversions).forEach((convName) => {
        const conv = build.conversions[convName];
        const convMult = conv.reduce((partialSum, a) => partialSum + a, 0);

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

        for (let i = 0; i < damage_type_count; i++) {
            if (build.base.attacks[convName].max[i] === 0) continue;
            const percentage = (baseMin[i] + baseMax[i]) / baseSumTotal;

            // min
            // NETWFA
            rawAttacks[convName].min[i] = build.final["raw" + type + "Damages"][i];
            // damage
            rawAttacks[convName].min[i] += percentage * build.ids.rawDamage;
            // elemental damage
            if (i > 0) {
                rawAttacks[convName].min[i] +=
                    (baseMin[i] / baseElemMinTotal) *
                    (build.ids["rawElemental" + type + "Damage"]);
            }
            // main/spell
            rawAttacks[convName].min[i] += percentage * build.ids["raw" + type + "Damage"];

            rawAttacks[convName].min[i] *= convMult / 100;

            // max
            // NETWFA
            rawAttacks[convName].max[i] = build.final["raw" + type + "Damages"][i];
            // damage
            rawAttacks[convName].max[i] += percentage * build.ids.rawDamage;
            // elemental damage
            if (i > 0) {
                rawAttacks[convName].max[i] +=
                    (baseMax[i] / baseElemMaxTotal) *
                    (build.ids["rawElemental" + type + "Damage"]);
            }
            // main/spell
            rawAttacks[convName].max[i] += percentage * build.ids["raw" + type + "Damage"];
            rawAttacks[convName].max[i] *= convMult / 100;
        }
    });
}

function powderNeutralConversions(build) {
    const weaponPowders = build.powders.weapon;

    let neutral = 100;
    let modifierPercents = [0, 0, 0, 0, 0, 0];

    for (let i in weaponPowders) {
        const powder = powders[weaponPowders[i]];

        const elementalIndex = elementalNames.indexOf(powder.element);
        const modPercent = Math.min(neutral, powder.conversion);

        neutral -= modPercent;
        modifierPercents[elementalIndex] += modPercent;

        if (neutral < 1) break;
    }

    for (let attackName of Object.keys(build.attacks)) {
        const attack = build.attacks[attackName];

        const convertedDamages = attack.base.map(extreme =>
            extreme.map((element, i) => extreme[neutral_index] * modifierPercents[i] / 100));

        for (let extremeIndex in attack.base)
            for (let i = 0; i < damage_type_count; i++)
                if (i === neutral_index)
                    attack.base[extremeIndex][i] *= neutral / 100;
                else
                    attack.base[extremeIndex][i] += convertedDamages[extremeIndex][i];
    }
}

function applySpellAttackSpeed(build) {
    const attackSpeedMultiplier = attackSpeedMultipliers[build.attackSpeed];
    Object.keys(build.base.attacks).forEach((convName) => {
        if (meleeAttacks.includes(convName)) return;
        const conv = build.base.attacks[convName];
        for (let i = 0; i < damage_type_count; i++) {
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
        const mults = build.final[meleeAttacks.includes(attackName) ? "mainAttackDamages" : "spellDamages"];
        for (let i = 0; i < damage_type_count; i++) {
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

        build.old_attacks[attackName] = {min: [0, 0, 0, 0, 0, 0], max: [0, 0, 0, 0, 0, 0]};

        for (let i = 0; i < damage_type_count; i++) {
            build.old_attacks[attackName].min[i] = baseAttack.min[i] + rawAttack.min[i];
            build.old_attacks[attackName].max[i] = baseAttack.max[i] + rawAttack.max[i];
        }
    });
}

// TODO: min, max, minc, and maxc are stupid and I want a better system
function applyStrDex(build) {
    const strMult = 1 + build.sp.mults[0];
    const dexMult = 1 + build.ids.criticalDamageBonus / 100;

    Object.keys(build.old_attacks).forEach((attackName) => {
        const attack = build.old_attacks[attackName];

        attack.minc = attack.min.slice(0);
        attack.maxc = attack.max.slice(0);

        for (let i = 0; i < damage_type_count; i++) {
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
    Object.keys(build.old_attacks).forEach((attackName) => {
        const attack = build.old_attacks[attackName];
        for (let i = 0; i < damage_type_count; i++) {
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
