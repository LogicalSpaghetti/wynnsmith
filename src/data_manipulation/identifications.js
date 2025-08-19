`use strict`;

// TODO: remove all "build.final", fuck final, worst thing I've ever done to this project
function refactorIdentifications(build) {
    // TODO: these two should be mostly combined, and the arrays they create should go somewhere other than "final"
    splitMergedIds(build);
    damagesToArrays(build);
}

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

    build.ids.rawElementalSpellDamage += build.ids.rawElementalDamage;
    build.ids.rawElementalMainAttackDamage += build.ids.rawElementalDamage;
}

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

    base.damage = [
        base.min,
        base.max,
    ];

    // raw
    final.rawMainAttackDamages = [
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

    final.rawSpellDamages = [
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
    final.mainAttackDamages = [
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

    final.spellDamages = [
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
