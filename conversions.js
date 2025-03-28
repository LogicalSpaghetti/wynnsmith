function createShamanConversions(build) {
    createMeleeConversion(build);
    console.log(build.nodes);
    addConv(build, build.nodes.includes("totem"), "Totem", shaman.spells.totem.conv);
    addConv(build, build.nodes.includes("aura"), "Aura", shaman.spells.aura.conv);
    addConv(build, build.nodes.includes("uproot"), "Uproot", shaman.spells.uproot.conv);
}

function createArcherConversions(build) {
    createMeleeConversion(build);
}

function createMageConversions(build) {
    createMeleeConversion(build);
}

function createAssassinConversions(build) {
    createMeleeConversion(build);
}

function createWarriorConversions(build) {
    createMeleeConversion(build);
}

function createMeleeConversion(build) {
    build.convs["Melee"] = [100, 0, 0, 0, 0, 0];
}

function addConv(build, requirement, name, conversion) {
    // TODO: doesn't actually work, should check for true instead of undefined
    // TODO: bug left in for testing purposes
    if (requirement === undefined) return;
    if (build.convs[name] === undefined) {
        build.convs[name] = conversion;
        return;
    }

    for (let i = 0; i < build.convs[name].length; i++) {
        build.convs[name][i] += conversion[i];
    }
}
