const player_bps = 5.612;

function calculateStats(build) {
    statCalculations(build);

    mergeElementalDefences(build);
    healthCalculations(build);
    calculateSpellCosts(build);
}

function calculateSustainStats(build) {
    statCalculations(build);

    mergeElementalDefences(build);
    healthCalculations(build);
    calculateSpellCosts(build);
}

function healthCalculations(build) {
    build.stats.health = Math.max(5, build.base.baseHealth + build.identifications.rawHealth);
    build.stats.healthRegen = computeHpr(build.identifications.healthRegenRaw, build.identifications.healthRegen / 100);

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

    calculateHealing(build);
}

function calculateHealing(build) {
    // TODO: Fluid Healing
    for (let heal of (build.heals ?? build.effects.heals)) heal.heal *= build.stats.health;
    // TODO: remove split
}

function getEHpFactor(build) {
    return getClassEHp(build) *
        (build.resistances ?? build.effects.resistances).reduce((a, b) => a * (1 - b.multiplier), 1);
    // TODO: remove split
}

function getClassEHp(build) {
    return build.wynnClass === "shaman" ? 2 - 0.6
        : build.wynnClass === "archer" ? 2 - 0.7
            : build.wynnClass === "mage" ? 2 - 0.8
                : 1;
}

function calculateSpellCosts(build) {
    // TODO: remove split
    const spell_costs = build.spell_costs ?? build.effects.spell_costs;

    for (let i in spell_costs) {
        let cost = spell_costs[i];

        cost *= 1 - (0.5 * (build.sp_multipliers[SkillPointIndexes.Intelligence] / spMultipliers[150]));

        cost += build.identifications["raw" + costNames[i] + "SpellCost"];

        cost *= 1 + build.identifications[costNames[i] + "SpellCost"] / 100;

        // TODO: remove split
        cost += (build.spell_cost_modifiers ?? build.effects.spell_cost_modifiers)[i];

        cost = Math.max(cost, 1);

        spell_costs[i] = cost;
    }

    // TODO: remove split
    for (const data of (build.spell_cost_multipliers ?? build.effects.spell_cost_modifiers))
        spell_costs[data.spell_number] *= data.cost_multiplier;
}

function statCalculations(build) {
    const ids = build.identifications;

    const maxManaMod = ids.rawMaxMana + build.sp_multipliers[SkillPointIndexes.Intelligence] * 100;
    build.stats.maxMana = 100 + maxManaMod;

    build.stats.trueManaRegen = ids.manaRegen + 25;

    build.stats.manaPerHit = ids.manaSteal / 3 / attackSpeedMultipliers[orderedAttackSpeed[build.stats.attackSpeed]];
    build.stats.lifePerHit = ids.lifeSteal / 3 / attackSpeedMultipliers[orderedAttackSpeed[build.stats.attackSpeed]];


    build.stats.effectiveWS = player_bps * (ids.walkSpeed / 100 + 1);
}

function mergeElementalDefences(build) {
    for (let i = 1; i < damage_type_count; i++) {
        const baseDefence = build.base[`base${damageTypeNames[i]}Defence`];
        const percentDefence = 1 + ((build.identifications.elementalDefence + build.identifications[`${damageTypePrefixes[i]}Defence`]) / 100);

        build.stats[`total${damageTypeNames[i]}Defence`] = baseDefence * (Math.sign(baseDefence) * percentDefence);
    }
}

function computeHpr(base, percent) {
    return base <= 0 && percent >= 1 ? 0 :
        base * (1 + percent * Math.sign(base));
}
