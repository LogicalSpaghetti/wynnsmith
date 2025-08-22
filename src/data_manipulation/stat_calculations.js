const player_bps = 5.612;

function calculateSustainStats(build) {
    statCalculations(build);

    calculateEHp(build);
    calculateSpellCosts(build);
}

function calculateEHp(build) {
    const agility = build.sp_multipliers[SkillPointIndexes.Agility];
    const defence = build.sp_multipliers[SkillPointIndexes.Defence];

    build.stats.ehp_no_agi =
        build.stats.health
        / getEHpFactor(build)
        / (1 - defence);
    build.stats.ehp =
        build.stats.health
        / getEHpFactor(build)
        / ((1 - defence) * (1 - agility) + (0.1 * agility));
}

function getEHpFactor(build) {
    return getClassEHp(build) *
        build.resistances.reduce((a, b) => a * (1 - b), 1);
}

function getClassEHp(build) {
    return build.wynnClass === "shaman" ? 2 - 0.6
        : build.wynnClass === "archer" ? 2 - 0.7
            : build.wynnClass === "mage" ? 2 - 0.8
                : 1;
}

function calculateSpellCosts(build) {
    for (let i in build.spell_costs) {
        let cost = build.spell_costs[i];

        cost *= 1 - (0.5 * (build.sp_multipliers[SkillPointIndexes.Intelligence] / spMultipliers[150]));

        cost += build.ids["raw" + costNames[i] + "SpellCost"];

        cost *= 1 + build.ids[costNames[i] + "SpellCost"] / 100;

        cost += build.spell_cost_modifiers[i];

        cost = Math.max(cost, 1);

        build.spell_costs[i] = cost;
    }

    for (const data of build.spell_cost_multipliers)
        build.spell_costs[data.spell_number] *= data.cost_multiplier;
}

function statCalculations(build) {
    const ids = build.ids;

    build.stats.health = Math.max(5, build.base.baseHealth + ids.rawHealth);
    build.stats.healthRegen = computeHpr(ids.healthRegenRaw, ids.healthRegen / 100);

    mergeElementalDefences(build);

    const maxManaMod = ids.rawMaxMana + build.sp_multipliers[SkillPointIndexes.Intelligence] * 100;
    build.stats.maxMana = 100 + maxManaMod;

    build.stats.trueManaRegen = ids.manaRegen + 25;
    build.stats.manaPerHit = ids.manaSteal / 3 / attackSpeedMultipliers[build.attackSpeed];
    build.stats.lifePerHit = ids.lifeSteal / 3 / attackSpeedMultipliers[build.attackSpeed];

    // TODO: effect stat modifiers
    // if (build.has("toggles", "maskOfTheCoward"))
    //     ids.walkSpeed +=
    //         80 + ((aspects.shaman["Aspect of Stances"][build.aspects["Aspect of Stances"] - 1] ?? {}).heratic ?? 0);
    // if (build.has("toggles", "maskOfTheAwakened"))
    //     ids.walkSpeed +=
    //         80 + ((aspects.shaman["Aspect of Stances"][build.aspects["Aspect of Stances"] - 1] ?? {}).heratic ?? 0);
    // if (build.has("toggles", "maskOfTheFanatic")) ids.walkSpeed -= 35;
    // if (build.has("toggles", "cowardMemory")) ids.slowEnemy += 30;

    build.stats.effectiveWS = player_bps * (ids.walkSpeed / 100 + 1);
}

function mergeElementalDefences(build) {
    for (let i = 1; i < damage_type_count; i++) {
        const baseDefense = build.base[`base${damageTypeNames[i]}Defense`];
        const percentDefense = 1 + ((build.ids.elementalDefence + build.ids[`${damageTypePrefixes[i]}Defence`]) / 100);

        build.stats[`total${damageTypeNames[i]}Defense`] = baseDefense * (Math.sign(baseDefense) * percentDefense);
    }
}

function computeHpr(base, percent) {
    return base <= 0 && percent >= 1 ? 0 :
        base * (1 + percent * Math.sign(base));
}