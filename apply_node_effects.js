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
    if (build.attackSpeed !== undefined) build.convs["Melee"] = [33.4, 0, 0, 0, 0, 0];
    addConv(build, "totem", [6, 0, 0, 0, 0, 6], "Totem");
    // TODO: does this work?
    // addConv(build, "relikProficiency", [1.67, 0, 0, 0, 0, 0], "Melee");
    addConv(build, "totemicsmash", [120, 0, 0, 0, 30, 0], "Totemic Smash");
    addConv(build, "uproot", [80, 30, 20, 0, 0, 0], "Uproot");
    addConv(build, "aura", [150, 0, 0, 30, 0, 0], "Aura");
    addConv(build, "haul", [0, 0, 0, 0, 0, 0], "Haul");
    addConv(build, "totemShove", [90, 0, 0, 0, 0, 30], "Totem Shove");
    addConv(build, "naturejolt", [90, 30, 0, 0, 0, 0], "Nature's Jolt");
    addConv(build, "danceOfTheRain", [30, 0, 0, 30, 0, 0], "Rain Dance");
    addConv(build, "shockingAura", [0, 0, 20, 0, 0, 0], "Aura");
    addConv(build, "flamingTongue", [-15, -30, -15, 0, 10, 0], "Uproot");
    addConv(build, "puppetMaster", [16, 2, 0, 0, 0, 2], "Puppet Knife");
    addConv(build, "hauntingMemory", [240, 0, 0, 0, 0, 0], "Haunting Memory");
    addConv(build, "explodingPuppet", [150, 0, 0, 0, 50, 0], "Puppet Explosion");
    addConv(build, "lashingLance", [-5, 0, 5, 0, 0, 0], "Uproot");
    addConv(build, "auraPull", [0, 0, 0, 0, 0, 30], "Aura");
    addConv(build, "tether", [35, 0, 0, 0, 0, 15], "Twisted Tether");
    addConv(build, "jungleSlayer", [75, 0, 0, 25, 0, 0], "Crimson Effigy");
    addConv(build, "eldritchCall", [640, 0, 100, 0, 100, 0], "Eldritch Call");
    addConv(build, "auraDamage1", [4, 0, 0, 0, 0, 0], "Totem"); // Imbued Totem
    addConv(build, "deeperWounds", [20, 0, 0, 0, 0, 0], "Bleed");
    addConv(build, "strongerTether", [20, 0, 0, 0, 0, 0], "Twisted Tether");
    addConv(build, "hummingbirds", [20, 0, 5, 0, 0, 5], "Hummingbirds");
    addConv(build, "hymnOfFreedom", [150, 0, 0, 50, 0, 0], "Frog Dance");
    addConv(build, "bloodLament", [100, 0, 0, 20, 0, 0], "Blood Sorrow");

    addAspectConv(build, "Aspect of Lashing Fire", "flamingTongue", "Uproot", [
        [-11, 0, -1, 0, -2, 0],
        [-17, 0, -2, 0, -4, 0],
        [-20, 0, -3, 0, -6, 0],
        [-22, 0, -4, 0, -8, 0],
    ]);

    if (build.nodes.includes("lashingLance") || build.nodes.includes("sanguineStrike")) {
        build.convs["Bleed"] = [30, 0, 0, 0, 0, 0];
    }
}

function createArcherConversions(build) {
    addMeleeConversion(build);
    // TODO
}

function createMageConversions(build) {
    addMeleeConversion(build);
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

function addMeleeConversion(build) {
    if (build.attackSpeed !== undefined) build.convs["Melee"] = [100, 0, 0, 0, 0, 0];
}

function addConv(build, nodeReq, conv, name) {
    if (!build.nodes.includes(nodeReq)) return;

    if (build.convs[name] === undefined) {
        build.convs[name] = conv.slice(0);
        return;
    }

    for (let i = 0; i < build.convs[name].length; i++) {
        build.convs[name][i] += conv[i];
    }
}

function addAspectConv(build, aspectName, nodeReq, convName, convs) {
    const aspectTier = build.aspects[aspectName];
    if (aspectTier === undefined) return;
    addConv(build, nodeReq, convs[aspectTier - 1], convName);
}

function applyMultipliers(build) {
    applyGlobalMultipliers(build);
    switch (build.wynnClass) {
        case "shaman":
            applyShamanMultipliers(build);
            break;
        case "archer":
            applyArcherMultipliers(build);
            break;
        case "mage":
            applyMageMultipliers(build);
            break;
        case "assassin":
            applyAssassinMultipliers(build);
            break;
        case "warrior":
            applyWarriorMultipliers(build);
            break;
    }
}

function applyGlobalMultipliers(build) {
    applySectMult(build, 1.2, "all", "toggles", "vengefulspirit");
    // TODO
}

function applyShamanMultipliers(build) {
    applySectMult(build, 1.05, "Melee", "nodes", "relikProficiency");
    const maskAspectMult =
        (aspects.shaman["Aspect of Stances"][build.aspects["Aspect of Stances"] - 1] ?? {}).lunatic ?? 0;
    applySectMult(build, 1.35 + maskAspectMult, "all", "toggles", "maskOfTheLunatic");
    applySectMult(build, 1.35 + maskAspectMult, "all", "toggles", "maskOfTheAwakened");
    applySectMult(build, 0.9, "all", "toggles", "maskOfTheCoward");
    applySectMult(build, 1.2, "all", "toggles", "eldritchCall");
    applySectMult(build, 1.35, "Aura", "toggles", "bloodPool");
    applySectMult(build, 0.6, "Aura", "nodes", "rebound");
    const totemMult = build.nodes.includes("doubleTotem")
        ? build.nodes.includes("tripleTotem")
            ? build.aspects["Summoner's Embodiment of the Omnipotent Overseer"] !== undefined
                ? 0.45
                : 0.5
            : 0.6
        : 1;
    applySectMult(build, totemMult, "Totem", "nodes", "totem");
    applySectMult(build, totemMult, "Aura", "nodes", "totem");
    applySectMult(build, 0.8, "Crimson Effigy", "nodes", "doubleTotem");
    applySectMult(build, 0.8, "Crimson Effigy", "nodes", "tripleTotem");
    applyAspectSectMult(build, 0.8, "Crimson Effigy", "aspects", "Summoner's Embodiment of the Omnipotent Overseer");

    applyHealMult(build, "nodes", "rebound", "First Wave Heal", 0.6);
    applyHealMult(
        build,
        "nodes",
        "sharpHealing",
        "First Wave Heal",
        1 + Math.min(75, build.ids.waterDamage * 0.3) / 100
    );
    // TODO
}

function applyArcherMultipliers(build) {
    applySectMult(build, 1.05, "Melee", "nodes", "bowProficiency");
    // TODO
}

function applyMageMultipliers(build) {
    applySectMult(build, 1.05, "Melee", "nodes", "wandProficiency");
    // TODO
}

function applyWarriorMultipliers(build) {
    applySectMult(build, 1.05, "Melee", "nodes", "spearProficiency");
    // TODO
}

function applyAssassinMultipliers(build) {
    applySectMult(build, 1.05, "Melee", "nodes", "daggerProficiency");
    // TODO
}

function applyAspectSectMult(build, mult, attackName, section, checkName) {
    if (build[section][checkName] === undefined) return;
    applyMult(build, mult, attackName);
}

function applySectMult(build, mult, attackName, section, checkName) {
    if (build[section].includes(checkName)) {
        applyMult(build, mult, attackName);
    }
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

function addShamanAttackVariants(build) {
    addShamanMelees(build);
    addAttackVariant(build, "Aura", "hymnOfHate", "nodes", "Hymn of Hate", 0.5);
    addSliderVariant(build, "Puppet Knife", "puppetMaster", "nodes", "Total Puppet DPS", "puppetMaster", 2);
    const hasTotem = build.nodes.includes("totem");
    const hasDouble = build.nodes.includes("doubleTotem");
    const hasTriple = build.nodes.includes("tripleTotem");
    const hasQuad = build.aspects["Summoner's Embodiment of the Omnipotent Overseer"] !== undefined;
    const totemCount = hasTotem + hasDouble + hasTriple + hasQuad;
    addAttackVariant(build, "Totem", "totem", "nodes", "Tick DPS Per Totem", 2.5);
    addAttackVariant(build, "Tick DPS Per Totem", "doubleTotem", "nodes", "Total Totem Tick DPS", totemCount);

    addAttackVariant(
        build,
        "Eldritch Call",
        "eldritchCall",
        "nodes",
        "Eldritch Call Single Target Total",
        4 + (build.aspects["Acolyte's Embodiment of Unwavering Adherence"] > 1 ? 1 : 0)
    );
    addAttackVariant(
        build,
        "Eldritch Call Single Target Total",
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
    const frogDanceAspect = build.aspects["Aspect of the Amphibian"];
    addAttackVariant(
        build,
        "Frog Dance",
        "hymnOfFreedom",
        "nodes",
        "Frog Dance Total Damage",
        3 + (frogDanceAspect === undefined ? 0 : 1 + frogDanceAspect)
    );

    const shamanHealMult = hasDouble ? (hasTriple ? (hasQuad ? 0.45 : 0.5) : 0.6) : 1;
    if (build.heals["Regeneration Tick"] !== undefined) {
        console.log(build.heals["Regeneration Tick"] * 2.5 * totemCount);
        build.heals["Regeneration Tick"] *= shamanHealMult;
        build.heals["Total Regeneration Per Second"] = build.heals["Regeneration Tick"] * 2.5 * totemCount;
    }
    if (build.heals["First Wave Heal"] !== undefined) {
        build.heals["First Wave Heal"] *= shamanHealMult * totemCount;
        if (totemCount > 1) build.heals["Per Totem First Wave Heal"] = build.heals["First Wave Heal"] / totemCount;
        if (build.nodes.includes("rebound"))
            build.heals["Total Rebound Heal"] =
                2 * (totemCount > 1 ? build.heals["Per Totem First Wave Heal"] : build.heals["First Wave Heal"]);
    }
}

function addShamanMelees(build) {
    if (build.neumericalAttackSpeed === undefined) return;
    addAttackVariant(build, "Melee", "", true, "Melee Total", 3 + (build.nodes.includes("relikBeams") ? 2 : 0));
    addMeleeDPS(build, "Melee Total");
}

function addMeleeDPS(build, meleeName) {
    if (build.neumericalAttackSpeed === undefined) return;
    var attackSpeed = build.neumericalAttackSpeed + -1 * build.ids.rawAttackSpeed;
    attackSpeed = Math.max(0, attackSpeed);
    attackSpeed = Math.min(6, attackSpeed);
    build.attackSpeedMult = attackSpeedMultipliers[Object.keys(attackSpeedMultipliers)[attackSpeed]];
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
