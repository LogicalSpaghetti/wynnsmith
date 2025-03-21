`use strict`;

function abilityCalculations(build) {
    // effects that add on to identifications
    applyAdditiveEffects(build);

    // effects that multiply identifications
    applyMultiplicitaveEffectsThatOnlyWorkOnIds(build);

    // make sure this affects everything defined so far
    applyMultiplicitaveEffects(build);
}

function applyAdditiveEffects(build) {
    build.addedIds = {};

    // for every ability on the build
    for (let i = 0; i < build.abilities.length; i++) {
        // get the node data
        const abilityId = build.abilities[i];
        const node = nodes[abilityId];
        if (node === undefined) {
            console.log(abilityId + " does not exist in nodes");
            continue;
        }
        // add the adds from the node to addedIds
        if (node.adds === undefined) continue;
        addAllIdsToBuildSection(build, node, 'adds');
    }

    console.log('additive ids: ' + JSON.stringify(build.adds))
}

function getAsMinMax(possibleInt) {
    if (Number.isInteger(possibleInt)) {
        return {
            'min': possibleInt,
            'max': possibleInt,
        };
    }
    delete possibleInt.raw;


    return possibleInt;
}

function applyMultiplicitaveEffects(build) {}

function applyMultiplicitaveEffectsThatOnlyWorkOnIds(build) {}
