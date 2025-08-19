function calculateSupportiveStats(build) {
    precomputations(build);

    addBasePlayerStats(build);

    addPowderDefences(build);

    applyExternalBuffs(build);
    includeOtherGear(build);

    statCalculations(build);

    calculateEHp(build);

    calculateSpellCosts(build);
}

function precomputations(build) {
    radiance(build);
}

function addBasePlayerStats(build) {
    build.base["baseHealth"] = 535;
}

function addPowderDefences(build) {
    for (let powder of build.powders.armour)
        for (let i in powders[powder].def)
            addBase(build, powders[powder].def[i], "base" + damageTypeNames[i] + "Defence");
}

// TODO: turn into an effect
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
    const tomeClusters = document.getElementById("tome_inputs")
        .querySelectorAll(".input_cluster");

    for (let cluster of tomeClusters) {
        addItem(build, cluster);
    }
}

function includeCharms(build) {
    // TODO
}

const player_bps = 5.612;

function statCalculations(build) {
    const ids = build.ids;
    const base = build.base;
    const final = build.final;

    final.health = Math.max(5, base.baseHealth + ids.rawHealth);
    final.healthRegen = computeHpr(ids.healthRegenRaw, ids.healthRegen / 100);

    mergeElementalDefences(build);

    const maxManaMod = build.sp.mults[2] * 100 + (ids.rawMaxMana === undefined ? 0 : ids.rawMaxMana);
    if (maxManaMod !== 0) final.maxMana = 100 + maxManaMod;
    if (final.maxMana > 400) final.maxMana = 400;

    final.trueManaRegen = ids.manaRegen + 25;
    final.manaPerHit = Math.round(ids.manaSteal / 3 / attackSpeedMultipliers[build.attackSpeed]);
    final.lifePerHit = Math.round(ids.lifeSteal / 3 / attackSpeedMultipliers[build.attackSpeed]);

    if (build.has("toggles", "maskOfTheCoward"))
        ids.walkSpeed +=
            80 + ((aspects.shaman["Aspect of Stances"][build.aspects["Aspect of Stances"] - 1] ?? {}).heratic ?? 0);
    if (build.has("toggles", "maskOfTheAwakened"))
        ids.walkSpeed +=
            80 + ((aspects.shaman["Aspect of Stances"][build.aspects["Aspect of Stances"] - 1] ?? {}).heratic ?? 0);
    if (build.has("toggles", "maskOfTheFanatic")) ids.walkSpeed -= 35;
    if (build.has("toggles", "cowardMemory")) ids.slowEnemy += 30;

    if (ids.walkSpeed !== undefined) final.effectiveWS = player_bps * (ids.walkSpeed / 100 + 1);
}

function mergeElementalDefences(build) {
    for (let i = 1; i < 6; i++) {
        build.final["total" + damageTypeNames[i] + "Defence"] =
            build.base["base" + damageTypeNames[i] + "Defence"] *
            (Math.sign(build.base["base" + damageTypeNames[i] + "Defence"]) * (build.ids[damageTypePrefixes[i] + "Defence"] / 100) +
                1);
    }
}

function calculateEHp(build) {
    const final = build.final;
    final.ehp = final.health;

    final.ehp /=
        build.wynnClass === "shaman"
            ? 2 - 0.6
            : build.wynnClass === "archer"
                ? 2 - 0.7
                : build.wynnClass === "mage"
                    ? 2 - 0.8
                    : 1;

    applyEHpModifiers(build);

    //hp/((1-def%)(1-agi%)+0.1(agi%)(1-counter%))
}

function applyEHpModifiers(build) {
    applyEHpDivider(build, "toggles", "maskOfTheLunatic", 1 + 0.2);
    applyEHpDivider(
        build,
        "toggles",
        "maskOfTheFanatic",
        1 - 0.35 - ((aspects.shaman["Aspect of Stances"][build.aspects["Aspect of Stances"] - 1] ?? {}).fanatic ?? 0),
    );
    applyEHpDivider(
        build,
        "toggles",
        "maskOfTheAwakened",
        1 - 0.35 - ((aspects.shaman["Aspect of Stances"][build.aspects["Aspect of Stances"] - 1] ?? {}).fanatic ?? 0),
    );
    applyEHpDivider(build, "toggles", "lunaticMemory", 1 - 0.15);
    applyEHpDivider(build, "toggles", "warScream", 1 - 0.2);
    applyEHpDivider(build, "toggles", "emboldeningCry", 1 - 0.25);
}

function applyEHpDivider(build, section, checkName, div) {
    if (!build.has(section, checkName)) return;
    build.final.ehp /= div;
}

function calculateSpellCosts(build) {
    addSpellNames(build);
    sumCostModNodes(build);

    const spells = castedSpells[build.wynnClass];
    if (spells === undefined) return;
    for (let i = 0; i < 4; i++) {
        const costName = costNames[i];
        const spell = spells[i];
        if (spell === undefined) continue;

        // get the base cost of the spell
        let cost = spell.mana;
        // apply Intelligence cost reduction
        cost *= 1 - 0.5 * (build.sp.mults[2] / spMultipliers[150]);
        // apply raw cost modifier
        cost += build.ids["raw" + costName + "SpellCost"];
        // apply percent cost modifier
        cost *= 1 + build.ids[costName + "SpellCost"] / 100;
        // apply tree cost modifier
        cost += build.spells[costName].mod;
        // bound cost
        cost = Math.max(1, cost);
        // apply Mask costs (does bypass the 1 cost minimum)
        if (build.has("toggles", "maskOfTheLunatic") && spell.name === "Aura") cost *= 0.7;
        if (build.has("toggles", "maskOfTheFanatic") && spell.name === "Totem") cost *= 0.35;
        if (build.has("toggles", "maskOfTheCoward") && spell.name === "Haul") cost *= 0.5;

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

function computeHpr(base, percent) {
    const effectivePercent = percent * Math.sign(base);
    return base < 0 && effectivePercent < -1 ? 0 : base * (1 + effectivePercent);
}
