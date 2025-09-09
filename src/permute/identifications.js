`use strict`;

function modifyIdentifications(build) {
    radiance(build);
    addOtherIdSources(build);

    getMeleeAttackSpeed(build);
}

const radianceExcludedIds = Object.freeze([
    "xpBonus", "lootBonus", "lootQuality", "gatherXpBonus", "gatherSpeed",
    "rawStrength", "rawDexterity", "rawIntelligence", "rawDefense", "rawAgility"
]);

function radiance(build) {
    for (let radiance of build.id_multipliers) for (let idName in build.identifications) {
        if (radianceExcludedIds.includes(idName)) continue;
        if (build.identifications[idName] <= 0) continue;
        const multiplier = (1 + radiance.multiplier / 100) + Number.EPSILON;
        build.identifications[idName] = Math.floor(build.identifications[idName] * multiplier);
    }
}

function addOtherIdSources(build) {
    addBasePlayerStats(build);

    addPowderDefences(build);

    applyExternalBuffs(build);

    includeTomes(build);
    includeCharms(build);

    addSkillPointPercents(build);

    applyStatEffects(build);
}

function addBasePlayerStats(build) {
    build.base.baseHealth += 5 + build.level * 5;
}

function addPowderDefences(build) {
    for (let equipment of build.equipment) if (equipment) for (let powder of equipment.powders) for (let i in powders[powder].def)
        addBaseToObject(build.base, `base${damageTypeNames[i]}Defence`, powders[powder].def[i]);
}

function applyExternalBuffs(build) {
    // TODO
    // Consumables
    // LR boons
    // Raid Buffs
    // etc.
}

function includeTomes(build) {
    for (let tome of build.tomes) if (tome)
        build.identifications = addIdsToObject(build.identifications, getItem(tome.name).identifications);
}

function includeCharms(build) {
    // TODO
}

function addSkillPointPercents(build) {
    for (let i = 0; i < build.sp_multipliers.length; i++) {
        const multiplier = build.sp_multipliers[i] * 100;

        build.identifications[damageTypePrefixes[i + 1] + "MainAttackDamage"] += multiplier;
        build.identifications[damageTypePrefixes[i + 1] + "SpellDamage"] += multiplier;
    }
}

function getMeleeAttackSpeed(build) {
    build.stats.attackSpeed =
        Math.max(0, Math.min(Object.keys(attackSpeedMultipliers).length - 1,
                orderedAttackSpeed.indexOf(build.base.attackSpeed) + build.identifications.rawAttackSpeed
            )
        );
}

function applyStatEffects(build) {
    // TODO: effect stat modifiers
    // if (build.has("toggles", "maskOfTheCoward"))
    //     ids.walkSpeed +=
    //         80 + ((aspects.shaman["Aspect of Stances"][build.aspects["Aspect of Stances"] - 1] ?? {}).heretic ?? 0);
    // if (build.has("toggles", "maskOfTheAwakened"))
    //     ids.walkSpeed +=
    //         80 + ((aspects.shaman["Aspect of Stances"][build.aspects["Aspect of Stances"] - 1] ?? {}).heretic ?? 0);
    // if (build.has("toggles", "maskOfTheFanatic")) ids.walkSpeed -= 35;
    // if (build.has("toggles", "cowardMemory")) ids.slowEnemy += 30;
}

// TODO: loop through all tomes, equipment, and the weapon, and add their getItemAddedSP to the build.skill_points
function calculateIdSkillPoints(build) {
    getItemAddedSP()
}