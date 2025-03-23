`use strict`;

function computeOutputs(build) {
    splitMergedStats(build);
    // Radiance
    ohLookAtMeIAmRadianceAndIAmDifferentAndSpecialAndNeedAnEntireFunctionJustForMe(build);
    // Consumables
    // Damage
    computeDamageOutputs(build);
    // Support/General
    computeOtherOutputs(build);
}

function ohLookAtMeIAmRadianceAndIAmDifferentAndSpecialAndNeedAnEntireFunctionJustForMe(build) {
    if (!build.toggles.includes('radiance')) return;
    const idNames = Object.keys(build.identifications);
    for (let i = 0; i < idNames.length; i++) {
        multiplyMinAndMaxBy(build.identifications[idNames[i]], abilities.protectiveBash.radiance)
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
    if (build.base.baseDamage !== undefined) {
        var percentUsed = 0;
        for (let i = 0; i < build.powders.weapon.length; i++) {
            const powder = powders[build.powders.weapon[i]];
            const remainingPercent = 100 - percentUsed;
            const conversionPercent = 0 + remainingPercent < powder.conversion ? remainingPercent : powder.conversion;
            percentUsed += conversionPercent
            const id = {
                "min": build.base.baseDamage.min * conversionPercent / 100,
                "max": build.base.baseDamage.max * conversionPercent / 100
            }
            addIdToBuildSection(build, id, 'base' + powder.element + 'Damage', 'base')
    
            if (percentUsed >= 100) break;
        }
        multiplyMinAndMaxBy(build.base.baseDamage, 1 - (percentUsed / 100))
        // if (build.base.baseDamage.min + build.base.baseDamage.max === 0) delete build.base.baseDamage;
    }

    // Add powder base damage:
    for (let i = 0; i < build.powders.weapon.length; i++) {
        const powder = powders[build.powders.weapon[i]];
        addIdToBuildSection(build, powder.dmg, 'base' + powder.element + 'Damage', 'base')
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
            addIdToBuildSection(build, getAsMinMax(powderDefs[j]), 'base' + capitalizedElements[j] + 'Defence', 'base');
        }
    }
}

function splitMergedStats(build) {
    // TODO
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
    target.min *= multiplier;
    target.max *= multiplier;
}