`use strict`;

function computeIdentifications(build) {
    radiance(build);
    addOtherIdSources(build);
}

// TODO: turn into an effect
function radiance(build) {
    // if (!build.toggles.includes("radiance")) return;
    // const radiance = oddities.warrior.radiance;
    // Object.keys(build.ids).forEach((idName) => {
    //     if (radiance.excludedIds.includes(idName)) return;
    //     if (build.ids[idName] <= 0) return;
    //     build.ids[idName] = Math.floor(build.ids[idName] * (radiance.multiplier + Number.EPSILON));
    // });
}

function addOtherIdSources(build) {
    addBasePlayerStats(build);

    addPowderDefences(build);

    applyExternalBuffs(build);

    includeTomes(build);
    includeCharms(build);

    addSkillPointPercents(build);
}

function addBasePlayerStats(build) {
    build.base.baseHealth += 5 + build.level * 5;
}

function addPowderDefences(build) {
    for (let powder of build.powders.armour)
        for (let i in powders[powder].def)
            addBase(build, powders[powder].def[i], "base" + damageTypeNames[i] + "Defence");
}

function applyExternalBuffs(build) {
    // TODO
    // Consumables
    // LR boons
    // Raid Buffs
    // etc.
}

function includeTomes(build) {
    const tomeClusters = document.getElementById("tome_inputs")
        .querySelectorAll(".input_cluster");

    for (let cluster of tomeClusters) {
        addItem(build, cluster);
    }
}

function includeCharms(build) {
    // TODO
}

function addSkillPointPercents(build) {
    for (let i = 0; i < build.sp_multipliers.length; i++) {
        const multiplier = build.sp_multipliers[i] * 100;

        build.ids[damageTypePrefixes[i + 1] + "MainAttackDamage"] += multiplier;
        build.ids[damageTypePrefixes[i + 1] + "SpellDamage"] += multiplier;
    }
}
