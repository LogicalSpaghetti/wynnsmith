`use strict`;

function removeOverridenEffects(build) {
    if (
        build.nodes.includes("maskOfTheLunatic") |
        build.nodes.includes("maskOfTheFanatic") |
        build.nodes.includes("maskOfTheCoward")
    ) {
        build.nodes[build.nodes.indexOf("uproot")] = "";
    }
}

function computeOutputs(build) {
    // Setup
    precomputations(build);
    applyExternalBuffs(build);
    includeOtherGear(build);

    // Powders
    addPowderBaseDamage(build);
    addPowderDefences(build);
    addArmourSpecials(build);

    splitMergedIds(build);
    damagesToArrays(build);

    computeSPMults(build);
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

    applyStrDex(build);

    finalStatCalculations(build);
    ehpCalculations(build);
}

function precomputations(build) {
    logFluidHealing(build);
    radiance(build);
}

function logFluidHealing(build) {
    build.mults.fluidHealing = Math.min(75, build.ids.waterDamage * 0.3) / 100 + 1;
}

function radiance(build) {
    if (!build.toggles.includes("radiance")) return;
    const radiance = oddities.warrior.radiance;
    const idNames = Object.keys(build.ids);
    for (let i = 0; i < idNames.length; i++) {
        if (radiance.excludedIds.includes(idNames[i])) continue;
        if (build.ids[idNames[i]] <= 0) continue;
        build.ids[idNames[i]] = Math.floor(build.ids[idNames[i]] * (radiance.multiplier + Number.EPSILON));
    }
}

function applyExternalBuffs(build) {
    // TODO
    // Consumables
    // LR boons
    // Raid Buffs
    // etc.
}

function includeOtherGear(build) {
    includeTomes(build);
    includeCharms(build);
}

function includeTomes(build) {
    // TODO
    for (let i = 0; i < build.tomes.length; i++) {
        addIds(build, itemGroups.tome[build.tomes[i]]);
    }
}

function includeCharms(build) {
    // TODO
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
    // base
    build.base.min = [
        build.base.baseDamage.min,
        build.base.baseEarthDamage.min,
        build.base.baseThunderDamage.min,
        build.base.baseWaterDamage.min,
        build.base.baseFireDamage.min,
        build.base.baseAirDamage.min,
    ];
    build.base.max = [
        build.base.baseDamage.max,
        build.base.baseEarthDamage.max,
        build.base.baseThunderDamage.max,
        build.base.baseWaterDamage.max,
        build.base.baseFireDamage.max,
        build.base.baseAirDamage.max,
    ];

    build.final.totalDamage = {};
    build.final.totalDamage.min =
        build.base.min[0] +
        build.base.min[1] +
        build.base.min[2] +
        build.base.min[3] +
        build.base.min[4] +
        build.base.min[5];
    build.final.totalDamage.max =
        build.base.max[0] +
        build.base.max[1] +
        build.base.max[2] +
        build.base.max[3] +
        build.base.max[4] +
        build.base.max[5];

    // raw
    build.final.splitRawMainAttackDamage = [
        build.final.rawNeutralMainAttackDamage,
        build.final.rawEarthMainAttackDamage,
        build.final.rawThunderMainAttackDamage,
        build.final.rawWaterMainAttackDamage,
        build.final.rawFireMainAttackDamage,
        build.final.rawAirMainAttackDamage,
    ];

    delete build.final.rawNeutralMainAttackDamage;
    delete build.final.rawEarthMainAttackDamage;
    delete build.final.rawThunderMainAttackDamage;
    delete build.final.rawWaterMainAttackDamage;
    delete build.final.rawFireMainAttackDamage;
    delete build.final.rawAirMainAttackDamage;

    build.final.splitRawSpellDamage = [
        build.final.rawNeutralSpellDamage,
        build.final.rawEarthSpellDamage,
        build.final.rawThunderSpellDamage,
        build.final.rawWaterSpellDamage,
        build.final.rawFireSpellDamage,
        build.final.rawAirSpellDamage,
    ];

    delete build.final.rawNeutralSpellDamage;
    delete build.final.rawEarthSpellDamage;
    delete build.final.rawThunderSpellDamage;
    delete build.final.rawWaterSpellDamage;
    delete build.final.rawFireSpellDamage;
    delete build.final.rawAirSpellDamage;

    // percent
    build.final.mainAttackDamage = [
        build.final.neutralMainAttackDamage,
        build.final.earthMainAttackDamage,
        build.final.thunderMainAttackDamage,
        build.final.waterMainAttackDamage,
        build.final.fireMainAttackDamage,
        build.final.airMainAttackDamage,
    ];

    delete build.final.neutralMainAttackDamage;
    delete build.final.earthMainAttackDamage;
    delete build.final.thunderMainAttackDamage;
    delete build.final.waterMainAttackDamage;
    delete build.final.fireMainAttackDamage;
    delete build.final.airMainAttackDamage;

    build.final.spellDamage = [
        build.final.neutralSpellDamage,
        build.final.earthSpellDamage,
        build.final.thunderSpellDamage,
        build.final.waterSpellDamage,
        build.final.fireSpellDamage,
        build.final.airSpellDamage,
    ];

    delete build.final.neutralSpellDamage;
    delete build.final.earthSpellDamage;
    delete build.final.thunderSpellDamage;
    delete build.final.waterSpellDamage;
    delete build.final.fireSpellDamage;
    delete build.final.airSpellDamage;
}

function computeSPMults(build) {
    for (let i = 0; i < 5; i++) {
        const textInt = parseInt(spInputs[i].value > 150 ? 150 : spInputs[i].value < 0 ? 0 : spInputs[i].value);

        var mult = textInt === undefined ? 0 : spMultipliers[textInt];
        if (i === 3) mult *= 0.867;
        if (i === 4) mult *= 0.951;

        build.sp.mults.push(mult);
    }
    build.sp.costMod = 75 / spInputs[2].value;
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
    build.rawAttacks = {};
    Object.keys(build.convs).forEach((convName) => {
        const conv = build.convs[convName];
        const convMult = conv.reduce((partialSum, a) => partialSum + a, 0);

        const baseConvMin = build.base.attacks[convName].min;
        const baseConvMax = build.base.attacks[convName].max;

        const baseMin = build.base.attacks[convName].min;
        const baseMax = build.base.attacks[convName].max;

        const baseMinTotal = baseMin.reduce((partialSum, a) => partialSum + a, 0);
        const baseMaxTotal = baseMax.reduce((partialSum, a) => partialSum + a, 0);

        const baseElemMinTotal = baseMin.reduce((partialSum, a) => partialSum + a, 0) - baseMin[0];
        const baseElemMaxTotal = baseMax.reduce((partialSum, a) => partialSum + a, 0) - baseMax[0];

        build.rawAttacks[convName] = {};
        build.rawAttacks[convName].min = [0, 0, 0, 0, 0, 0];
        build.rawAttacks[convName].max = [0, 0, 0, 0, 0, 0];

        const isMelee = meleeAttacks.includes(convName);
        const type = isMelee ? "MainAttack" : "Spell";

        for (let i = 0; i < 6; i++) {
            if (baseConvMax[i] === 0) continue;

            // min
            // NETWFA
            build.rawAttacks[convName].min[i] = build.final["splitRaw" + type + "Damage"][i];
            // damage
            build.rawAttacks[convName].min[i] += (baseMin[i] / baseMinTotal) * build.ids.rawDamage;
            // elemental damage
            if (i > 0) {
                build.rawAttacks[convName].min[i] +=
                    (baseMin[i] / baseElemMinTotal) *
                    (build.ids.rawElementalDamage + build.ids["rawElemental" + type + "Damage"]);
            }
            // main/spell
            build.rawAttacks[convName].min[i] += (baseMin[i] / baseMinTotal) * build.ids["raw" + type + "Damage"];

            build.rawAttacks[convName].min[i] *= convMult / 100;

            // max
            // NETWFA
            build.rawAttacks[convName].max[i] = build.final["splitRaw" + type + "Damage"][i];
            // damage
            build.rawAttacks[convName].max[i] += (baseMax[i] / baseMaxTotal) * build.ids.rawDamage;
            // elemental damage
            if (i > 0) {
                build.rawAttacks[convName].max[i] +=
                    (baseMax[i] / baseElemMaxTotal) *
                    (build.ids.rawElementalDamage + build.ids["rawElemental" + type + "Damage"]);
            }
            // main/spell
            build.rawAttacks[convName].max[i] += (baseMax[i] / baseMaxTotal) * build.ids["raw" + type + "Damage"];

            build.rawAttacks[convName].max[i] *= convMult / 100;
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

function createHealing(build) {
    addHeal(build, "nodes", "bloodPool", "First Wave Heal", 25);
    addHeal(build, "nodes", "regeneration", "Regeneration Tick", 1);
}

function addHeal(build, sect, checkName, healName, healAmount) {
    if (build[sect].includes(checkName)) {
        build.heals[healName] = healAmount;
    }
}

function finalStatCalculations(build) {
    const ids = build.ids;
    const base = build.base;
    const final = build.final;

    final.health = Math.max(5, base.baseHealth + ids.rawHealth);
    final.healthRegen = computeHpr(ids.healthRegenRaw, ids.healthRegen / 100);

    mergeElementalDefences(build);

    const maxManaMod = getSPMult(build.sp.mults[2]) * 100 + (ids.rawMaxMana === undefined ? 0 : ids.rawMaxMana);
    if (maxManaMod !== 0) final.maxMana = 100 + maxManaMod;
    if (final.maxMana > 400) final.maxMana = 400;

    if (ids.manaRegen !== undefined) final.trueManaRegen = ids.manaRegen + 25;
    if (ids.manaSteal !== undefined) final.manaPerHit = Math.round(ids.manaSteal / 3 / attackSpeedMultipliers[build.attackSpeed]);
    if (ids.lifeSteal !== undefined) final.lifePerHit = Math.round(ids.lifeSteal / 3 / attackSpeedMultipliers[build.attackSpeed]);

    const baseWS = 5.612;
    if (ids.walkSpeed !== undefined) final.effectiveWS = baseWS * (ids.walkSpeed / 100 + 1);
}

function computeHpr(base, percent) {
    const effectivePercent = percent * Math.sign(base);
    return base < 0 && effectivePercent < -1 ? 0 : base * (1 + effectivePercent);
}

function mergeElementalDefences(build) {
    for (let i = 1; i < 6; i++) {
        build.final["total" + damageTypes[i] + "Defence"] =
            build.base["base" + damageTypes[i] + "Defence"] *
            (Math.sign(build.base["base" + damageTypes[i] + "Defence"]) * (build.ids[prefixes[i] + "Defence"] / 100) +
                1);
    }
}

function ehpCalculations(build) {
    // TODO
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
