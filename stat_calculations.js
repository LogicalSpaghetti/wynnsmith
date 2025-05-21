function calculateStats(build) {
    precomputations(build);

    applyExternalBuffs(build);
    includeOtherGear(build);

    statCalculations(build);

    calculateEHp(build);
}

function precomputations(build) {
    radiance(build);
}

function radiance(build) {
    if (!build.toggles.includes("radiance")) return;
    const radiance = oddities.warrior.radiance;
    Object.keys(build.ids).forEach((idName) => {
        if (radiance.excludedIds.includes(idName)) return;
        if (build.ids[idName] <= 0) return;
        build.ids[idName] = Math.floor(build.ids[idName] * (radiance.multiplier + Number.EPSILON));
    });
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

function statCalculations(build) {
    const ids = build.ids;
    const base = build.base;
    const final = build.final;

    final.health = Math.max(5, base.baseHealth + ids.rawHealth);
    final.healthRegen = computeHpr(ids.healthRegenRaw, ids.healthRegen / 100);

    mergeElementalDefences(build);

    const maxManaMod = getSPMult(build.sp.mults[2]) * 100 + (ids.rawMaxMana === undefined ? 0 : ids.rawMaxMana);
    if (maxManaMod !== 0) final.maxMana = 100 + maxManaMod;
    if (final.maxMana > 400) final.maxMana = 400;

    final.trueManaRegen = ids.manaRegen + 25;
    final.manaPerHit = Math.round(ids.manaSteal / 3 / attackSpeedMultipliers[build.attackSpeed]);
    final.lifePerHit = Math.round(ids.lifeSteal / 3 / attackSpeedMultipliers[build.attackSpeed]);

    const baseWS = 5.612;
    if (ids.walkSpeed !== undefined) final.effectiveWS = baseWS * (ids.walkSpeed / 100 + 1);
}

function calculateEHp(build) {
    const final = build.final;
    final.ehp = final.health;

    final.ehp /= build.wynnClass === "shaman" ? 2 - 0.6 : build.wynnClass === "archer" ? 2 - 0.7 : build.wynnClass === "mage" ? 2 - 0.8 : 1;
}
