function calculateStats(build) {
    precomputations(build);

    applyExternalBuffs(build);
    includeOtherGear(build);

    computeSPMults(build);

    statCalculations(build);

    calculateEHp(build);

    calculateSpellCosts(build);
}

function computeSPMults(build) {
    for (let i = 0; i < 5; i++) {
        const textInt = parseInt(spInputs[i].value > 150 ? 150 : spInputs[i].value < 0 ? 0 : spInputs[i].value);

        var mult = textInt === undefined ? 0 : spMultipliers[textInt];
        if (i === 3) mult *= 0.867;
        if (i === 4) mult *= 0.951;

        build.sp.mults[i] = mult;
        build.sp.ints[i] = textInt;
    }
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

    const maxManaMod = build.sp.mults[2] * 100 + (ids.rawMaxMana === undefined ? 0 : ids.rawMaxMana);
    console.log();
    if (maxManaMod !== 0) final.maxMana = 100 + maxManaMod;
    if (final.maxMana > 400) final.maxMana = 400;
    if (maxManaMod === 0) final.maxMana = undefined;

    final.trueManaRegen = ids.manaRegen + 25;
    final.manaPerHit = Math.round(ids.manaSteal / 3 / attackSpeedMultipliers[build.attackSpeed]);
    final.lifePerHit = Math.round(ids.lifeSteal / 3 / attackSpeedMultipliers[build.attackSpeed]);

    if (build.sectionContains("toggles", "maskOfTheCoward")) ids.walkSpeed += 80;
    if (build.sectionContains("toggles", "maskOfTheFanatic")) ids.walkSpeed -= 35;

    const baseWS = 5.612;
    if (ids.walkSpeed !== undefined) final.effectiveWS = baseWS * (ids.walkSpeed / 100 + 1);
}

function calculateEHp(build) {
    const final = build.final;
    final.ehp = final.health;

    final.ehp /= build.wynnClass === "shaman" ? 2 - 0.6 : build.wynnClass === "archer" ? 2 - 0.7 : build.wynnClass === "mage" ? 2 - 0.8 : 1;

    applyEHpModifiers(build);

    //hp/((1-def%)(1-agi%)+0.1(agi%)(1-counter%))
}

function applyEHpModifiers(build) {
    applyEHpDivider(build, "toggles", "maskOfTheLunatic", 1 + 0.2);
    applyEHpDivider(build, "toggles", "maskOfTheFanatic", 1 - 0.35);
}

function applyEHpDivider(build, section, checkName, div) {
    if (!build.sectionContains(section, checkName)) return;
    build.final.ehp /= div;
}

const costNames = ["1st", "2nd", "3rd", "4th"];

function calculateSpellCosts(build) {
    addSpellNames(build);
    sumCostModNodes(build);

    for (let i = 0; i < 4; i++) {
        const costName = costNames[i];
        const spell = castedSpells[build.wynnClass][i];

        // get the base cost of the spell
        var cost = spell.mana;
        // apply Intelligence cost reduction
        cost *= 1 - 0.5 * (build.sp.ints[2] / 150);
        // apply raw cost modifier
        cost += build.ids["raw" + costName + "SpellCost"];
        // apply percent cost modifier
        cost *= 1 + build.ids[costName + "SpellCost"] / 100;
        // apply tree cost modifier
        cost += build.spells[costName].mod;
        // TODO: Mask costs
        cost = Math.max(1, cost);
        if (build.sectionContains("toggles", "maskOfTheLunatic") && spell.name === "Aura") cost *= 0.7;
        if (build.sectionContains("toggles", "maskOfTheFanatic") && spell.name === "Totem") cost *= 0.35;
        if (build.sectionContains("toggles", "maskOfTheCoward") && spell.name === "Haul") cost *= 0.5;

        build.spells[costName].cost = cost;
    }
}

function sumCostModNodes(build) {
    addCostMod(build, "totemCost1", "1st", -10);
    addCostMod(build, "totemCost2", "1st", -5);
    addCostMod(build, "haulCost1", "2nd", -5);
    addCostMod(build, "haulCost2", "2nd", -5);
    addCostMod(build, "auraCost1", "3rd", -5);
    addCostMod(build, "auraCost2", "3rd", -5);
    addCostMod(build, "uprootCost1", "4th", -5);
    addCostMod(build, "uprootCost2", "4th", -5);
}

function addCostMod(build, nodeName, spell, mod) {
    if (!build.nodes.includes(nodeName)) return;
    build.spells[spell].mod += mod;
}

function addSpellNames(build) {
    addSpellName(build, "totem", "1st", "Totem");
    addSpellName(build, "haul", "2nd", "Haul");
    addSpellName(build, "aura", "3rd", "Aura");
    addSpellName(build, "uproot", "4th", "Uproot");
}

function addSpellName(build, nodeName, spellNumber, spellName) {
    if (build.nodes.includes(nodeName)) build.spells[spellNumber].name = spellName;
}
