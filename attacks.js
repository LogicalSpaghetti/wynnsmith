function refreshAbilities(build) {
    for (let i = 0; i < build.nodes.length; i++) {
        const nodeName = build.nodes[i];
        addProperties(build, nodeName);
    }
    for (let i = 0; i < build.majorIds.length; i++) {
        const majorIdName = build.majorIds[i];
        addProperties(build, majorIdName);
    }
}

function addProperties(build, abilityId) {
    const ability = abilities[abilityId];
    if (ability === undefined) return;
    const abilityPropertyNames = Object.keys(ability);
    for (let i = 0; i < abilityPropertyNames.length; i++) {
        const property = ability[abilityPropertyNames[i]];
        if (build[abilityPropertyNames[i]] === undefined) build[abilityPropertyNames[i]] = [];
        build[abilityPropertyNames[i]].push(property);
    }
}