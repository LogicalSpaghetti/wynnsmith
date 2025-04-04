function createShamanConversions(build) {
    // TODO: should be 33.4, left as 33 to match Wynnbuilder

    build.convs["Melee"] = [33.4, 0, 0, 0, 0, 0];
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
    addConv(build, "puppetMaster", [16, 2, 0, 0, 0, 2], "Puppet");
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
        build.convs["Bleed"] = [30, 0, 0, 0, 0, 0]
    }
}

function createArcherConversions(build) {
    addMeleeConversion(build);
    addConv(build, "", [140, 0, 0, 0, 20, 0], "");
    
}

function createMageConversions(build) {
    addMeleeConversion(build);
}

function createAssassinConversions(build) {
    addMeleeConversion(build);
}

function createWarriorConversions(build) {
    addMeleeConversion(build);
}

function addMeleeConversion(build) {
    build.convs["Melee"] = [100, 0, 0, 0, 0, 0];
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
