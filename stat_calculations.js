`use strict`;

function computeOutputs(build) {
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

//
function computeDamageOutputs() {
    // Radiance probably applies at the start?
    // =>
    // Consus surely apply here
    // =>
    // add base[netwfa]Damages to base[netwfa](Spell/Melee)Damages
    // =>
    // Powders convert a % of the neutral damage into their element, up to 100% of it.
    // Powders add a bit of base elemental damage to their element
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

function computeOtherOutputs(build) {
    
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