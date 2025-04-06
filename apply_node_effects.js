function createConversions(build) {
    switch (build.class) {
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
    // TODO: should be 33.4, left as 33 to match Wynnbuilder

    if (build.attackSpeed !== undefined) build.convs["Melee"] = [33.4, 0, 0, 0, 0, 0];
    addConv(build, "totem", [6, 0, 0, 0, 0, 6], "Totem");
    addConv(build, "relikProficiency", [1.67, 0, 0, 0, 0, 0], "Melee");
    addConv(build, "totemicsmash", [120, 0, 0, 0, 30, 0], "Totemic Smash");
    addConv(build, "uproot", [80, 30, 20, 0, 0, 0], "Uproot");
    addConv(build, "aura", [150, 0, 0, 30, 0, 0], "Aura");
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

function applyNodeMultipliers(build) {
    applyGlobalMultipliers(build);
    switch (build.class) {
        case "shaman":
            applyShamanMultipliers(build);
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

function applyGlobalMultipliers(build) {
    applySectMult(build, 1.2, "all", "toggles", "vengefulspirit");
    // TODO
}

function applyShamanMultipliers(build) {
    applySectMult(build, 1.35, "all", "toggles", "maskOfTheLunatic");
    applySectMult(build, 1.35, "Aura", "toggles", "bloodPool");
    // TODO
}

function applyArcherMultipliers(build) {
    // TODO
}

function applyMageMultipliers(build) {
    // TODO
}

function applyWarriorMultipliers(build) {
    // TODO
}

function applyAssassinMultipliers(build) {
    // TODO
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
    for (let i = 0; i < 6; i++) {
        build.attacks[attackName].min[i] *= mult;
        build.attacks[attackName].max[i] *= mult;
    }
}

function addAttackVariants(build) {
    if (build.class === "shaman") {
        addShamanMelees(build);
    } else {
        addMeleeDPS(build, "Melee");
    }
    addAttackVariant(build, "Aura", "hymnOfHate", "nodes", "Hymn of Hate", 0.5);
    addSliderVariant(build, "Puppet Knife", "puppetMaster", "nodes", "Total Puppet DPS", "puppetMaster", 2)
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
    console.log(attackSpeed);
    build.attackSpeedMult = attackSpeedMultipliers[Object.keys(attackSpeedMultipliers)[attackSpeed]];
    addAttackVariant(build, meleeName, "", true, "Melee DPS", build.attackSpeedMult);
}

function addAttackVariant(build, rootName, variantId, variantSource, variantName, variantMult) {
    const root = build.attacks[rootName];
    if (root === undefined) return;
    if (!variantSource && !build[variantSource].includes(variantId)) return;
    build.attacks[variantName] = { min: [0, 0, 0, 0, 0, 0], max: [0, 0, 0, 0, 0, 0] };
    const variant = build.attacks[variantName];
    for (let i = 0; i < 6; i++) {
        variant.min[i] = root.min[i] * variantMult;
        variant.max[i] = root.max[i] * variantMult;
    }
}

function addSliderVariant(build, rootName, variantId, variantName, variantSource, slider, additionalMult) {
    if (build.sliders[slider] === undefined) return;
    addAttackVariant(build, rootName, variantId, variantName, variantSource, build.sliders[slider] * (additionalMult === undefined ? 1 : additionalMult))
}