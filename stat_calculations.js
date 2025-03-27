`use strict`;

function computeOutputs(build) {
    // Pre-computations
    
    // Radiance multiplies all ids by 1.2x
    radiance(build);
    // +Consus, raid buffs, lr boons
    applyExternalBuffs(build);
    includeTomes(build);
    addArmorSpecials(build);
    applyPowderBase(build);
    splitMergedIds(build);
    createConversions(build);
    // =>
    // For spells, the damage values are then multiplied by a value based on the weapon's **base** attack speed
    // =>
    // All damage values are multiplied by the neutral conversion % and retain their type.
    // the sum of all damage values (before the neutral scaling) is multiplied by any elemental conversions, and becomes that type.
    // =>
    // Powders convert a % of the neutral damage into their element, up to 100% of it.
    // =>
    // Masteries Node base values are added to any non-zero damage values.
    // Mastery multipliers are applied.
    // Proficiencies are applied, damage is multiplicitive
    // =>
    applyPowderPercent(build);
    // Armor Powder Specials add to ids as standard %s
    // All elemental damages are multiplied by their coresponding % multiplier
    // =>
    // Raw damage values undergo attack conversions, and are then added on.
    // For plain melee: (Btw the application of all raw element damage is dependent on both pre and post powder conversion) ((FIGURE OUT))
    // =>
    // Apply Skill Points, Strength, Dexterity, and any other final multipliers.
    
    // Radiance
    
    // Consumables
    
    // Support/General
    computeOtherOutputs(build);
    removeAllZeros(build);

    
}

function radiance(build) {
    if (!build.toggles.includes("radiance")) return;
    const idNames = Object.keys(build.ids);
    for (let i = 0; i < idNames.length; i++) {
        if (nodes.radiance.excludedIds.includes(idNames[i])) continue;
        if (build.ids[idNames[i]] <= 0) continue;
        build.ids[idNames[i]] = Math.floor(build.ids[idNames[i]] * (nodes.radiance.multiplier + Number.EPSILON));
    }
}

function applyExternalBuffs(build) {
    // TODO
    // Consumables
    // LR boons
    // Raid Buffs
    // etc.
}

function includeTomes(build) {
    // TODO
}

function addArmorSpecials(build) {
    // TODO
}

function splitMergedIds(build) {
    const ids = build.ids;
    // damage
    ids.spellDamage += ids.damage;
    ids.mainAttackDamage += ids.damage;
    ids.damage = 0;

    // mainAttackDamage and spellDamage
    prefixes.forEach((prefix) => {
        ids[prefix + "MainAttackDamage"] += ids.mainAttackDamage;
        ids[prefix + "SpellDamage"] += ids.spellDamage;
    });
    ids.mainAttackDamage = 0;
    ids.spellDamage = 0;

    // typed damage
    prefixes.forEach((type) => {
        const typedDamage = ids[type + "Damage"] + (type === "neutral" ? 0 : ids.elementalDamage);

        ids[type + "MainAttackDamage"] += typedDamage + (type === "neutral" ? 0 : ids["elementalMainAttackDamage"]);
        ids[type + "SpellDamage"] += typedDamage + (type === "neutral" ? 0 : ids["elementalSpellDamage"]);
    });

    ids.neutralDamage = 0;
    ids.earthDamage = 0;
    ids.thunderDamage = 0;
    ids.waterDamage = 0;
    ids.fireDamage = 0;
    ids.airDamage = 0;
    ids.elementalDamage = 0;
    ids.elementalMainAttackDamage = 0;
    ids.elementalSpellDamage = 0;

    // eledefs
    prefixes
        .filter((prefix) => prefix !== "neutral")
        .forEach((prefix) => {
            ids[prefix + "Defence"] += ids.elementalDefence;
        });

    ids.elementalDefence = 0;
}

function createConversions(build) {

}

function applyPowderBase(build) {
    // Add powder base damage:
    for (let i = 0; i < build.powders.weapon.length; i++) {
        const powder = powders[build.powders.weapon[i]];
        addBase(build, powder.dmg, "base" + powder.element + "Damage");
    }
    // TODO: Powder elemental defence
}

function applyPowderPercent(build) {
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
}

const prefixes = ["neutral", "earth", "thunder", "water", "fire", "air"];
const capitalizedElements = ["Earth", "Thunder", "Water", "Fire", "Air"];

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

    finalMerge(build);
    roundAllForDisplay(build);
}

function finalMerge(build) {
    const ids = build.ids;
    const base = build.base;
    ids.healthRegenRaw *= 1 + ids.healthRegen / 100;
    ids.healthRegen = 0;

    base.baseHealth += ids.rawHealth;
    ids.rawHealth = 0;

    mergeElementalDefences(build);
}

function mergeElementalDefences(build) {
    for (let i = 0; i < 6; i++) {
        const base = build.base["base" + capitalizedElements[i] + "Defence"];
        const percent = build.ids[prefixes[i + 1] + "Defence"];
    }
}

function roundAllForDisplay(build) {
    const base = build.base;
    const baseNames = Object.keys(base);
    baseNames.forEach((baseName) => {
        if (!Number.isInteger(base[baseName])) return;
        base[baseName] = roundForDisplay(base[baseName]);
    });
    const ids = build.ids;
    const idNames = Object.keys(ids);
    idNames.forEach((idName) => {
        ids[idName] = roundForDisplay(ids[idName]);
    });
}

function removeAllZeros(build) {
    removeZeroIds(build);
}

function removeZeroIds(build) {
    const idNames = Object.keys(build.ids);
    for (let i = 0; i < idNames.length; i++) {
        if (build.ids[idNames[i]] === 0) {
            delete build.ids[idNames[i]];
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
