`use strict`;

function computeOutputs(build) {
    splitMergedStats(build);
    // Radiance
    radiance(build);
    // Consumables
    // Damage
    computeDamageOutputs(build);
    // Support/General
    computeOtherOutputs(build);
    removeAllZeros(build);
}

function radiance(build) {
    if (!build.toggles.includes("radiance")) return;
    const idNames = Object.keys(build.identifications);
    for (let i = 0; i < idNames.length; i++) {
        if (nodes.radiance.excludedIds.includes(idNames[i])) continue;
        if (build.identifications[idNames[i]] <= 0) continue;
        build.identifications[idNames[i]] = Math.floor(
            build.identifications[idNames[i]] * (nodes.radiance.multiplier + Number.EPSILON)
        );
    }
}

const capitalizedElements = ["Earth", "Thunder", "Water", "Fire", "Air"];

function computeDamageOutputs(build) {
    applyPowders(build);
    // =>
    // For spells, the damage values are then multiplied by a value based on the weapon's **base** attack speed
    // =>
    // All damage values are multiplied by the neutral conversion % and retain their type.
    // the sum of all damage values (before the neutral scaling) is multiplied by any elemental conversions, and becomes that type.
    // =>
    // Masteries Node base values are added to any non-zero damage values.
    // Mastery multipliers are applied.
    // Proficiencies are applied, damage is multiplicitive
    // =>
    // All elemental damages are multiplied by their coresponding % multiplier
    // =>
    // Raw damage values undergo attack conversions, and are then added on.
    // For plain melee: (Btw the application of all raw element damage is dependent on both pre and post powder conversion) ((FIGURE OUT))
    // =>
    // Apply Skill Points, Strength, Dexterity, and any other final multipliers.
}

function applyPowders(build) {
    // Convert up to 100% Neutral:
    if (build.base.baseDamage !== undefined && build.powders.weapon.length > 0) {
        var percentUsed = 0;
        for (let i = 0; i < build.powders.weapon.length; i++) {
            const powder = powders[build.powders.weapon[i]];
            const remainingPercent = 100 - percentUsed;
            const conversionPercent = 0 + remainingPercent < powder.conversion ? remainingPercent : powder.conversion;
            percentUsed += conversionPercent;
            const id = {
                min: (build.base.baseDamage.min * conversionPercent) / 100,
                max: (build.base.baseDamage.max * conversionPercent) / 100,
            };
            addBase(build, id, "base" + powder.element + "Damage");

            if (percentUsed >= 100) break;
        }
        multiplyMinAndMaxBy(build.base.baseDamage, 1 - percentUsed / 100);
        // if (build.base.baseDamage.min + build.base.baseDamage.max === 0) delete build.base.baseDamage;
    }

    // Add powder base damage:
    for (let i = 0; i < build.powders.weapon.length; i++) {
        const powder = powders[build.powders.weapon[i]];
        addBase(build, powder.dmg, "base" + powder.element + "Damage");
    }
}

function computeOtherOutputs(build) {
    // Apply all adders and multipliers
    // Sum like stats to build.output

    // Powder defs:
    for (let i = 0; i < build.powders.armor.length; i++) {
        const powder = powders[build.powders.armor[i]];
        const powderDefs = powder.def;
        for (let j = 0; j < capitalizedElements.length; j++) {
            if (powderDefs[j] === 0) continue;
            addBase(build, getAsMinMax(powderDefs[j]), "base" + capitalizedElements[j] + "Defence");
        }
    }
}

const realPercents = [
    "neutralMainAttackDamage",
    "earthMainAttackDamage",
    "thunderMainAttackDamage",
    "waterMainAttackDamage",
    "fireMainAttackDamage",
    "airMainAttackDamage",
    "neutralSpellDamage",
    "earthSpellDamage",
    "thunderSpellDamage",
    "waterSpellDamage",
    "fireSpellDamage",
    "airSpellDamage",
];
const elementalPercents = [
    "earthMainAttackDamage",
    "thunderMainAttackDamage",
    "waterMainAttackDamage",
    "fireMainAttackDamage",
    "airMainAttackDamage",
    "earthSpellDamage",
    "thunderSpellDamage",
    "waterSpellDamage",
    "fireSpellDamage",
    "airSpellDamage",
];
const lowerCaseAttackTypes = ["neutral", "earth", "thunder", "water", "fire", "air"];

function splitMergedStats(build) {
    for (let i = 0; i < realPercents.length; i++) {
        if (build.identifications[realPercents[i]] === undefined) build.identifications[realPercents[i]] = 0;
    }

    // damage
    if (build.identifications.damage !== undefined) {
        for (let i = 0; i < realPercents.length; i++) {
            build.identifications[realPercents[i]] += build.identifications.damage;
        }
    }
    // mainAttackDamage
    if (build.identifications.mainAttackDamage !== undefined) {
        for (let i = 0; i < 6; i++) {
            build.identifications[realPercents[i]] += build.identifications.mainAttackDamage;
        }
    }
    // spellDamage
    if (build.identifications.spellDamage !== undefined) {
        for (let i = 6; i < 12; i++) {
            build.identifications[realPercents[i]] += build.identifications.spellDamage;
        }
    }
    // typed damage
    for (let i = 0; i < lowerCaseAttackTypes.length; i++) {
        if (build.identifications[lowerCaseAttackTypes[i] + "Damage"] !== undefined) {
            build.identifications[lowerCaseAttackTypes[i] + "MainAttackDamage"] +=
                build.identifications[lowerCaseAttackTypes[i] + "Damage"];
            build.identifications[lowerCaseAttackTypes[i] + "SpellDamage"] +=
                build.identifications[lowerCaseAttackTypes[i] + "Damage"];
        }
    }
    // elemental damages
    if (build.identifications["elementalDamage"] !== undefined) {
        for (let i = 0; i < elementalPercents.length; i++) {
            build.identifications[elementalPercents[i]] += build.identifications["elementalDamage"];
        }
    }
    if (build.identifications["elementalMainAttackDamage"] !== undefined) {
        for (let i = 0; i < 6; i++) {
            build.identifications[elementalPercents[i]] += build.identifications["elementalMainAttackDamage"];
        }
    }
    if (build.identifications["elementalSpellDamage"] !== undefined) {
        for (let i = 6; i < 12; i++) {
            build.identifications[elementalPercents[i]] += build.identifications["elementalSpellDamage"];
        }
    }

    build.identifications.damage = 0;
    build.identifications.neutralDamage = 0;
    build.identifications.earthDamage = 0;
    build.identifications.thunderDamage = 0;
    build.identifications.waterDamage = 0;
    build.identifications.fireDamage = 0;
    build.identifications.airDamage = 0;
    build.identifications.mainAttackDamage = 0;
    build.identifications.spellDamage = 0;
    build.identifications.elementalDamage = 0;
    build.identifications.elementalMainAttackDamage = 0;
    build.identifications.elementalSpellDamage = 0;

    if (build.identifications.elementalDefence !== undefined) {
        for (let i = 1; i < lowerCaseAttackTypes.length; i++) {
            build.identifications[lowerCaseAttackTypes + "Defence"] += build.identifications.elementalDefence;
        }
    }

    build.identifications.elementalDefence = 0;
}

function removeAllZeros(build) {
    removeZeroIds(build);
}

function removeZeroIds(build) {
    const idNames = Object.keys(build.identifications);
    for (let i = 0; i < idNames.length; i++) {
        if (build.identifications[idNames[i]] === 0) {
            delete build.identifications[idNames[i]];
        }
    }
    const baseNames = Object.keys(build.base);
    for (let i = 0; i < baseNames.length; i++) {
        if (build.base[baseNames[i]] === 0) {
            delete build.base[baseNames[i]];
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

function addMinAndMaxTo(target, source) {
    target.min += source.min;
    target.max += source.max;
}

function multiplyMinAndMaxBy(target, multiplier) {
    target.min *= multiplier + Number.EPSILON;
    target.max *= multiplier + Number.EPSILON;
}
