`use strict`;

function getPlayerLevel() {
    const inputValue = document.getElementById("level_input").value;
    const value = Math.min(maxPlayerLevel, Math.max(1, parseInt(inputValue) || 0));
    if (inputValue !== "") document.getElementById("level_input").value = value;
    return value;
}

function getClassRequirementByWeaponName(name) {
    // noinspection JSUnresolvedReference
    return getItemInGroup("weapon", name)?.requirements?.classRequirement;
}

class Input {
    level;
    wynnClass = "";

    items;
    abilities;

    sp_assigned;
    sp_provided;
    sp_modified;

    init() {
        this.items = getItemsFromHTML();
        if (this.items.weapons.length === 0) return null;

        this.wynnClass = getClassRequirementByWeaponName(this.items.weapons[0].name);
        this.level = getPlayerLevel();

        this.abilities = getInputAbilities(this.wynnClass);

        const equipOrderInformation = getEquipOrderInformation(this.items);
        this.equip_order = equipOrderInformation.equip_order;
        this.sp_assigned = equipOrderInformation.required;
        this.sp_provided = equipOrderInformation.provided;
        this.sp_modified = getSkillPointModifiers();
    }
}

function getEquipOrderInformation(items) {
    const weaponRequirements = getSPRequirementForAllWeapons(items.weapons);

    const skillPointData = itemNamesToSkillPointData(items.equipment)
        .filter(item => itemRequiresSomething(item) || itemProvidesSomething(item));

    const providerRequirers = skillPointData
        .filter(item => itemRequiresSomething(item) && itemProvidesSomething(item));
    const exclusiveProviders = skillPointData
        .filter(item => itemProvidesSomething(item) && !itemRequiresSomething(item));
    const exclusiveRequirers = skillPointData
        .filter(item => itemRequiresSomething(item) && !itemProvidesSomething(item));

    const initialProvided = exclusiveProviders
        .reduce((total, item) => total.map((x, i) => x + item.provided[i]), [0, 0, 0, 0, 0]);
    const unhelpfulItemMinimums = exclusiveRequirers
        .reduce((total, item) => total.map((x, i) => Math.max(x, item.required[i])), [0, 0, 0, 0, 0]);

    const unhelpfulRequirements = weaponRequirements
        .map((x, i) => Math.max(x, unhelpfulItemMinimums[i]));

    const subEquipOrder = getEquipOrder(providerRequirers, initialProvided);
    const requiredSPFromPRs = getEquipOrderRequirement(providerRequirers, subEquipOrder, initialProvided);
    console.log(requiredSPFromPRs);
    const providedSP = addProvided(providerRequirers, initialProvided);
    console.log(providedSP);
    const requiredSP = addRequirements(requiredSPFromPRs, providedSP, unhelpfulRequirements);
    console.log(requiredSP);

    const equipOrder = mergeEquipOrder(exclusiveProviders, providerRequirers, exclusiveRequirers, subEquipOrder);

    return {equip_order: equipOrder, required: requiredSP, provided: providedSP};
}

function itemProvidesSomething(item) {
    return undefined !== item.provided.find(x => x !== 0);
}

function itemRequiresSomething(item) {
    return undefined !== item.required.find(x => x !== 0);
}

function itemNamesToSkillPointData(equipment) {
    return equipment.map(item => getItemAsSkillPointData(getItem(item.name)));
}

function getItemAsSkillPointData(item) {
    return {
        name: item.name,
        required: getItemSPReqs(item),
        provided: getItemAddedSP(item)
    };
}

function getSPRequirementForAllWeapons(weapons) {
    return weapons.reduce((mins, weapon) => {
        const reqs = getItemSPReqs(getItem(weapon.name));
        return mins.map((min, i) => Math.max(min, reqs[i]));
    }, [0, 0, 0, 0, 0]);
}

function getItemSPReqs(item) {
    const reqs = item?.requirements ?? {};
    return skillPointNames.map(name => Number(reqs[name] ?? 0));
}

function mergeEquipOrder(pre, central, post, centralOrder) {
    return pre.concat(centralOrder.map(i => central[i])).concat(post).map(item => item.name);
}

function permutation(pick, max, usePermutation) {
    pick = Math.floor(pick);
    max = Math.floor(max);
    if (pick > max) return console.error("Pick cannot be greater than max.");
    if (pick <= 0) return console.error("Pick must be 1 or more.");
    if (max <= 0) return console.error("Max must be 1 or more.");

    const i = new Array(pick);
    loopOneIndex(i, pick, max, 0, usePermutation);
}

function loopOneIndex(indices, pick, max, count, usePermutation) {
    for (indices[count] = 0; indices[count] < max; indices[count]++) {
        if (checkOverlap(indices, count)) {
            if (count < pick - 1)
                loopOneIndex(indices, pick, max, count + 1, usePermutation);
            if (count === pick - 1) usePermutation(indices);
        }
    }
}

function checkOverlap(indices, count) {
    if (count <= 0) return true;
    if (indices.length <= count) return false;
    for (let i = 0; i < count; i++)
        if (indices[count] === indices[i]) return false;
    return true;
}

// TODO: sets
function getEquipOrder(itemRanges, initialProvided = [0, 0, 0, 0, 0]) {
    if (itemRanges.length < 1) return [];

    let currentMinRequirement;
    let currentBest;

    const tryOrder = function (orderedIndexes) {
        const requiredSP = getEquipOrderRequirement(itemRanges, orderedIndexes, initialProvided)
            .reduce((a, b) => a + b);

        if (currentMinRequirement == null || currentMinRequirement > requiredSP) {
            currentMinRequirement = requiredSP;
            currentBest = [...orderedIndexes]; // TODO: why is it that if we don't clone it, the result ends up being an array of length n full of n?
        }
    };

    permutation(itemRanges.length, itemRanges.length, tryOrder);

    return currentBest;
}

function getEquipOrderRequirement(itemRanges, orderedIndexes, initialProvided) {
    const required = [0, 0, 0, 0, 0];
    const provided = [...initialProvided];

    for (const index of orderedIndexes)
        for (let i = 0; i < required.length; i++) {
            const itemRequired = itemRanges[index].required[i];
            const itemProvided = itemRanges[index].provided[i];
            if (itemRequired > 0) required[i] = getNewRequired(required[i], provided[i], itemRequired);
            if (required[i] > 0 && itemProvided < 0) required[i] += -itemProvided;
            provided[i] += itemProvided;
        }

    return required;
}

function addRequirements(required, provided, otherRequired) {
    const newRequired = [];
    for (let i = 0; i < required.length; i++) if (otherRequired[i] > 0)
        newRequired[i] = Math.max(required[i] + provided[i], otherRequired[i]) - provided[i];
    else newRequired[i] = required[i];
    return newRequired;
}

function getNewRequired(oldRequired, provided, itemRequired) {
    return Math.max(oldRequired + provided, itemRequired) - provided;
}

function addProvided(itemRanges, initialProvided) {
    const provided = [...initialProvided];
    for (const item of itemRanges) for (let i = 0; i < provided.length; i++) provided[i] += item.provided[i];
    return provided;
}

function balanceSP() {
    const remainingSP = document.getElementById("remaining_sp").dataset.value;
    if (remainingSP < 1) return;

    const spInputs = document.getElementById("sp_section");
    const strengthCluster = spInputs.querySelector(".sp_cluster[data-element='earth']");
    const strength = parseInt(strengthCluster.querySelector(".total_display").textContent);
    const dexterityCluster = spInputs.querySelector(".sp_cluster[data-element='thunder']");
    const dexterity = parseInt(dexterityCluster.querySelector(".total_display").textContent);

    let newStrength;
    let newDexterity;

    const difference = Math.max(0, Math.abs(strength - dexterity));
    const overBalance = remainingSP - difference;

    // TODO: I hate this, rework it.
    if (strength < 0 && dexterity < 0) {
        newStrength = 0;
        newDexterity = 0;
    } else if (strength < 0 && dexterity >= 0) {
        newStrength = 0;
        newDexterity = remainingSP;
    } else if (dexterity < 0 && strength >= 0) {
        newStrength = remainingSP;
        newDexterity = 0;
    } else if (strength >= dexterity + remainingSP) {
        newStrength = 0;
        newDexterity = remainingSP;
    } else if (dexterity >= strength + remainingSP) {
        newStrength = remainingSP;
        newDexterity = 0;
    } else if (strength > dexterity) {
        newStrength = overBalance / 2;
        newDexterity = overBalance / 2 + difference;
    } else if (dexterity > strength) {
        newStrength = overBalance / 2 + difference;
        newDexterity = overBalance / 2;
    } else { // strength === dexterity
        newStrength = remainingSP / 2;
        newDexterity = remainingSP / 2;
    }

    strengthCluster.querySelector(".sp_input").value =
        parseInt(strengthCluster.querySelector(".sp_input").value) + Math.ceil(newStrength);
    dexterityCluster.querySelector(".sp_input").value =
        parseInt(dexterityCluster.querySelector(".sp_input").value) + Math.floor(newDexterity);
}
