function createConversions(build) {
    switch (build.wynnClass) {
        case "shaman":
            createShamanConversions(build);
            break;
        case "archer":
            createArcherConversions(build);
            break;
        case "mage":
            createMageConversions(build);
            break;
        case "assassin":
            createAssassinConversions(build);
            break;
        case "warrior":
            createWarriorConversions(build);
            break;
    }
}

function createShamanConversions(build) {
    addMeleeConversion(build, 33.4);
    // build, name, conv, req, sect, replace = false
    addConv(build, "Totem", [6, 0, 0, 0, 0, 6], "totem");
    addConv(build, "Totemic Smash", [120, 0, 0, 0, 30, 0], "totemicsmash");
    addConv(build, "Uproot", [80, 30, 20, 0, 0, 0], "uproot");
    addConv(build, "Aura", [150, 0, 0, 30, 0, 0], "aura");
    addConv(build, "Haul", [0, 0, 0, 0, 0, 0], "haul");
    addConv(build, "Totem Shove", [90, 0, 0, 0, 0, 30], "totemShove");
    addConv(build, "Nature's Jolt", [90, 30, 0, 0, 0, 0], "naturejolt");
    addConv(build, "Rain Dance", [30, 0, 0, 30, 0, 0], "danceOfTheRain");
    addConv(build, "Aura", [0, 0, 20, 0, 0, 0], "shockingAura");
    addConv(build, "Uproot", [-15, -30, -15, 0, 10, 0], "flamingTongue");
    addConv(build, "Puppet Knife", [16, 2, 0, 0, 0, 2], "puppetMaster");
    addConv(build, "Haunting Memory", [240, 0, 0, 0, 0, 0], "hauntingMemory");
    addConv(build, "Puppet Explosion", [150, 0, 0, 0, 50, 0], "explodingPuppet");
    addConv(build, "Uproot", [-5, 0, 5, 0, 0, 0], "lashingLance");
    addConv(build, "Aura", [0, 0, 0, 0, 0, 30], "auraPull");
    addConv(build, "Twisted Tether", [35, 0, 0, 0, 0, 15], "tether");
    addConv(build, "Crimson Effigy", [75, 0, 0, 25, 0, 0], "jungleSlayer");
    addConv(build, "Eldritch Call", [640, 0, 100, 0, 100, 0], "eldritchCall");
    addConv(build, "Totem", [4, 0, 0, 0, 0, 0], "auraDamage1"); // Imbued Totem
    addConv(build, "Bleed", [20, 0, 0, 0, 0, 0], "deeperWounds");
    addConv(build, "Twisted Tether", [20, 0, 0, 0, 0, 0], "strongerTether");
    addConv(build, "Hummingbirds", [20, 0, 5, 0, 0, 5], "hummingbirds");
    addConv(build, "Frog Dance", [150, 0, 0, 50, 0, 0], "hymnOfFreedom");
    addConv(build, "Blood Sorrow", [100, 0, 0, 20, 0, 0], "bloodLament");

    addANDConv(build, "Frog Dance", [0, 0, 400, 0, 0, 0], "Faustian Gambit", "maIds", "hymnOfFreedom", "nodes", true);
    addANDConv(build, "Blood Sorrow", [500, 0, 0, 0, 0, 0], "Lifestream", "maIds", "bloodLament", "nodes", true);
    addANDConv(build, "Totemic Smash", [40, 90, 90, 0, 60, 0], "Totemic Fuse", "maIds", "totemicSmash", "nodes", true);

    addORConv(build, "Bleed", [30, 0, 0, 0, 0, 0], "sanguineStrike", "nodes", "lashingLance", "nodes");

    addAspectConv(build, "Aspect of Lashing Fire", "flamingTongue", "Uproot", [
        [-11, 0, -1, 0, -2, 0],
        [-17, 0, -2, 0, -4, 0],
        [-20, 0, -3, 0, -6, 0],
        [-22, 0, -4, 0, -8, 0],
    ]);
}

function createArcherConversions(build) {
    addMeleeConversion(build);
    // TODO
}

function createMageConversions(build) {
    addMeleeConversion(build);
    addConv(build, "Meteor", [330, 70, 0, 0, 0, 0], "meteor");
    // TODO
}

function createAssassinConversions(build) {
    addMeleeConversion(build);
    // TODO
}

function createWarriorConversions(build) {
    addMeleeConversion(build);
    // TODO
}

function addMeleeConversion(build, conv = 100) {
    if (build.attackSpeed !== undefined) addANYConv(build, "Melee", [conv, 0, 0, 0, 0, 0]);
}

function addConv(build, name, conv, req, sect = "nodes", replace = false) {
    if (build.has(sect, req)) addANYConv(build, name, conv, replace);
}

function addANDConv(build, name, conv, req1, sect1, req2, sect2, replace = false) {
    if (build.has(sect1, req1) && build.has(sect2, req2)) addANYConv(build, name, conv, replace);
}

function addORConv(build, name, conv, req1, sect1, req2, sect2, replace = false) {
    if (build.has(sect1, req1) || build.has(sect2, req2)) addANYConv(build, name, conv, replace);
}

function addANYConv(build, name, conv, replace = false) {
    if (build.conversions[name] === undefined || replace) {
        build.conversions[name] = conv.slice(0);
        return;
    }

    for (let i = 0; i < build.conversions[name].length; i++) {
        build.conversions[name][i] += conv[i];
    }
}

function addAspectConv(build, aspectName, nodeReq, convName, convs) {
    const aspectTier = build.aspects[aspectName];
    if (aspectTier === undefined) return;
    addConv(build, nodeReq, convs[aspectTier - 1], convName);
}

function addMaIdConv(build, maId, nodeReq, conv, name, replace = false) {
    if (!build.has("maIds", maId)) return;
    addConv(build, nodeReq, conv, name);
}

function applyMultipliers(build) {
    // Shaman
    applySectMult(build, 1.05, "Melee", "nodes", "relikProficiency");
    const maskAspectMult =
        (aspects.shaman["Aspect of Stances"][build.aspects["Aspect of Stances"] - 1] ?? {}).lunatic ?? 0;
    applySectMult(build, 1.35 + maskAspectMult, "all", "toggles", "maskOfTheLunatic");
    applySectMult(build, 1.35 + maskAspectMult, "all", "toggles", "maskOfTheAwakened");
    applySectMult(build, 1 / (1 - 0.15), "all", "toggles", "fanaticMemory");
    applySectMult(build, 0.9, "all", "toggles", "maskOfTheCoward");
    applySectMult(build, 2, "Bleed", "toggles", "eldritchCall");
    applySectMult(build, 1.35, "Aura", "toggles", "bloodPool");
    applySectMult(build, 0.6, "Aura", "nodes", "rebound");
    const totemMult = build.nodes.includes("doubleTotem")
        ? build.nodes.includes("tripleTotem")
            ? build.aspects["Summoner's Embodiment of the Omnipotent Overseer"] !== undefined
                ? 0.45
                : 0.5
            : 0.6
        : 1;
    const auraMult = build.has("maIds", "Geocentrism") ? 1 : totemMult;
    applySectMult(build, totemMult, "Totem", "nodes", "totem");
    applySectMult(build, auraMult, "Aura", "nodes", "totem");
    applySectMult(build, 0.8, "Crimson Effigy", "nodes", "doubleTotem");
    applySectMult(build, 0.8, "Crimson Effigy", "nodes", "tripleTotem");
    applySectMult(build, 0.8, "Crimson Effigy", "aspects", "Summoner's Embodiment of the Omnipotent Overseer");
    applySectMult(build, 1.2, "Puppet Knife", "toggles", "summonFocus");
    applySectMult(build, 1.2, "Crimson Effigy", "toggles", "summonFocus");
    applySectMult(build, 1.2, "Hummingbirds", "toggles", "summonFocus");
    applySectMult(build, 1.2, "Totem", "toggles", "summonFocus");
    applySectMult(build, 1.2, "Puppet Knife", "toggles", "summonFocus");
    applySectMult(build, 1.2, "Crimson Effigy", "toggles", "summonFocus");
    applySectMult(build, 1.2, "Hummingbirds", "toggles", "summonFocus");
    applySectMult(build, 1.2, "Totem", "toggles", "summonFocus");
    applySectMult(build, 2, "Tick DPS Per Totem", "maIds", "Furious Effigy");
    applySectMult(build, 2, "Twisted Tether", "maIds", "Gruesome Knots");
    applySectMult(build, 2, "Bleed", "maIds", "Gruesome Knots");
    applySectMult(build, 0.25, "Blood Sorrow Total Damage", "maIds", "bloodLament"); // definitely not perfect since 5/s isn't divisible cleanly by 4
    applySectMult(build, 2, "Puppet Explosion", "maIds", "Strings of Fate");
    applySectMult(build, 2, "Puppet Knife", "maIds", "Strings of Fate");

    applyHealMult(build, "nodes", "rebound", "First Wave Heal", 0.6);
    applyHealMult(
        build,
        "nodes",
        "sharpHealing",
        "First Wave Heal",
        1 + Math.min(75, build.ids.waterDamage * 0.3) / 100
    );

    // Archer
    applySectMult(build, 1.05, "Melee", "nodes", "bowProficiency");
    // Mage
    applySectMult(build, 1.05, "Melee", "nodes", "wandProficiency");
    // Warrior
    applySectMult(build, 1.05, "Melee", "nodes", "spearProficiency");
    // Assassin
    // TODO: Assassin multi-hit is cooked
    applySectMult(build, 1.05, "Melee", "nodes", "daggerProficiency");
}

function applyOverridingDamageBuffs(build) {
    findHighestBuffs(build);
    applyHighestBuffs(build);
}

function findHighestBuffs(build) {
    // Shaman
    applyDamageBuff(build, 1.2, "dmg", "vengefulspirit");
    applyDamageBuff(build, 1.2, "vuln", "eldritchCall");
    applyDamageBuff(build, 1.15, "vuln", "fanaticMemory");
    // Warrior    
    applyDamageBuff(build, 1.4, "vuln", "armorBreaker");
    applyDamageBuff(build, 1.08, "dmg", "emboldeningCry");
    // Mage
    applyDamageBuff(build, 1.4, "dmg", "fortitude");
    // Archer
    applyDamageBuff(build, 1.15, "vuln", "coursingRestraints");
}

function applyHighestBuffs(build) {
    Object.keys(build.mults).forEach((multName) => {
        const mult = build.mults[multName];
        Object.keys(build.attacks).forEach((attackName) => {
            const attack = build.attacks[attackName];
            for (let i = 0; i < 6; i++) {
                attack.min[i] *= mult;
                attack.max[i] *= mult;
            }
        });
    });
}

function createHealing(build) {
    addHeal(build, "nodes", "bloodPool", "First Wave Heal", 25);
    addHeal(build, "nodes", "regeneration", "Regeneration Tick", 1);
}

function addHeal(build, sect, checkName, healName, healAmount) {
    if (build[sect].includes(checkName)) {
        build.heals[healName] = healAmount;
    }
}

function applySectMult(build, mult, attackName, section, checkName) {
    if (!build.has(section, checkName)) return;
    applyMult(build, mult, attackName);
}

function applyMult(build, mult, attackName) {
    if (attackName === "all") {
        Object.keys(build.attacks).forEach((aName) => {
            applyMult(build, mult, aName);
        });
        return;
    }
    if (build.attacks[attackName] === undefined) return;
    for (let i = 0; i < 6; i++) {
        build.attacks[attackName].min[i] *= mult;
        build.attacks[attackName].max[i] *= mult;
    }
}

function applyHealMult(build, section, checkName, healName, mult) {
    if (build[section].includes(checkName)) build.heals[healName] *= mult;
}

function addAttackVariants(build) {
    if (build.wynnClass === "shaman") {
        addShamanAttackVariants(build);
    } else {
        addMeleeDPS(build, "Melee");
    }
}

function applyDamageBuff(build, mult, type, checkName) {
    if (build.has("toggles", checkName)) {
        build.mults[type] = Math.max(build.mults[type], mult);
    }
}

function addShamanAttackVariants(build) {
    addShamanMelees(build);
    addAttackVariant(build, "Aura", "hymnOfHate", "nodes", "Hymn of Hate", 0.5);
    addSliderVariant(build, "Puppet Knife", "puppetMaster", "nodes", "Total Puppet DPS", "puppetMaster", 2);
    const hasTotem = build.nodes.includes("totem");
    const hasDouble = build.nodes.includes("doubleTotem");
    const hasTriple = build.nodes.includes("tripleTotem");
    const hasQuad = build.aspects["Summoner's Embodiment of the Omnipotent Overseer"] !== undefined;
    const totemCount = hasTotem + hasDouble + hasTriple + hasQuad;
    const auraCount = build.has("maIds", "Geocentrism") ? 1 : totemCount;
    addAttackVariant(build, "Totem", "totem", "nodes", "Tick DPS Per Totem", 2.5);
    addAttackVariant(build, "Tick DPS Per Totem", "doubleTotem", "nodes", "Total Totem Tick DPS", totemCount);

    addAttackVariant(
        build,
        "Eldritch Call",
        "eldritchCall",
        "nodes",
        "Eldritch Call Total",
        4 + (build.aspects["Acolyte's Embodiment of Unwavering Adherence"] > 1 ? 1 : 0)
    );
    addAttackVariant(
        build,
        "Eldritch Call Total",
        "eldritchCall",
        "nodes",
        "Eldritch Call Group Total",
        4 + (build.aspects["Acolyte's Embodiment of Unwavering Adherence"] > 1 ? 1 : 0)
    );

    const lanceMult =
        3 +
        (build.nodes.includes("lashingLance") ? 1 : 0) +
        (build.aspects["Aspect of Lashing Fire"] === undefined ? 0 : build.aspects["Aspect of Lashing Fire"]);
    addAttackVariant(build, "Uproot", "flamingTongue", "nodes", "Uproot Total", lanceMult);

    const acoTier = build.aspects["Acolyte's Embodiment of Unwavering Adherence"];
    const sorrowMult = 4 + (acoTier === undefined ? 0 : acoTier > 2 ? 3 : 2);
    addAttackVariant(build, "Blood Sorrow", "bloodLament", "nodes", "Blood Sorrow DPS", 5);
    addAttackVariant(build, "Blood Sorrow DPS", "bloodLament", "nodes", "Blood Sorrow Total Damage", sorrowMult);
    addAttackVariant(
        build,
        "Hummingbirds DPS",
        "hummingbirds",
        "nodes",
        "Hummingbirds",
        4 * (build.maIds["Summoner's Embodiment of the Omnipotent Overseer"] > 1 ? 3 : 2)
    );

    const frogDanceAspect = build.aspects["Aspect of the Amphibian"];
    if (!build.has("maIds", "Faustian Gambit"))
        addAttackVariant(
            build,
            "Frog Dance",
            "hymnOfFreedom",
            "nodes",
            "Frog Dance Total Damage",
            3 + (1 + (frogDanceAspect ?? -1))
        );

    const totemHealMult = hasDouble ? (hasTriple ? (hasQuad ? 0.45 : 0.5) : 0.6) : 1;
    const auraHealMult = build.has("maIds", "Geocentrism") ? 1 : totemHealMult;
    if (build.has("heals", "Regeneration Tick")) {
        build.heals["Regeneration Tick"] *= totemHealMult;
        build.heals["Total Regeneration Per Second"] = build.heals["Regeneration Tick"] * 2.5 * totemCount;
        if (build.has("nodes", "totemicShatter")) {
            build.heals["Shatter Healing"] =
                build.heals["Regeneration Tick"] * 20 * (build.has("maIds", "Sublimation") ? 0.75 : 0.5);
        }
    }
    if (build.has("heals", "First Wave Heal")) {
        build.heals["First Wave Heal"] *= auraHealMult * auraCount;
        if (auraCount > 1) build.heals["Per Totem First Wave Heal"] = build.heals["First Wave Heal"] / auraCount;
        if (build.nodes.includes("rebound")) build.heals["Total Rebound Heal"] = 2 * build.heals["First Wave Heal"];
    }
}

function addShamanMelees(build) {
    addAttackVariant(build, "Melee", "", true, "Melee Total", 3 + (build.nodes.includes("relikBeams") ? 2 : 0));
    addMeleeDPS(build, "Melee Total");
}

function addMeleeDPS(build, meleeName) {
    let attackSpeedIndex = orderedAttackSpeed.indexOf(build.attackSpeed) + build.ids.rawAttackSpeed;
    attackSpeedIndex = Math.max(0, attackSpeedIndex);
    attackSpeedIndex = Math.min(6, attackSpeedIndex);
    build.attackSpeedMult = attackSpeedMultipliers[orderedAttackSpeed[attackSpeedIndex]];
    addAttackVariant(build, meleeName, "", true, "Melee DPS", build.attackSpeedMult);
}

function addAttackVariant(build, rootName, variantId, variantSource, variantName, variantMult) {
    const root = build.attacks[rootName];
    if (root === undefined) return;
    if (variantSource !== true && !build[variantSource].includes(variantId)) return;
    if (build.attacks[variantName] === undefined)
        build.attacks[variantName] = { min: [0, 0, 0, 0, 0, 0], max: [0, 0, 0, 0, 0, 0] };
    const variant = build.attacks[variantName];
    for (let i = 0; i < 6; i++) {
        variant.min[i] = root.min[i] * variantMult;
        variant.max[i] = root.max[i] * variantMult;
    }
}

function addSliderVariant(build, rootName, variantId, variantName, variantSource, slider, additionalMult) {
    if (build.sliders[slider] === undefined) return;
    addAttackVariant(
        build,
        rootName,
        variantId,
        variantName,
        variantSource,
        build.sliders[slider] * (additionalMult === undefined ? 1 : additionalMult)
    );
}
