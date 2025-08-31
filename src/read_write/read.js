`use strict`;

function getPlayerLevel() {
    const inputValue = document.getElementById("level_input").value;
    const value = Math.min(maxPlayerLevel, Math.max(1, parseInt(inputValue) || 0))
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
    sp_added;
    sp_modified;

    init() {
        this.items = getItemsFromHTML();
        if (this.items.weapons.length === 0) return null;

        this.wynnClass = getClassRequirementByWeaponName(this.items.weapons[0].name);
        this.level = getPlayerLevel();

        this.abilities = getInputAbilities(this.wynnClass);

        const skillPoints = getSkillPointMinAndAdded(this.items);
        this.sp_assigned = skillPoints.required;
        this.sp_added = skillPoints.added;
        this.sp_modified = getSkillPointModifiers();
    }
}

function getSkillPointMinAndAdded(items) {
    const weaponRequirements = getSPRequirementForAllWeapons(items.weapons);

    const skillPointData = itemNamesToSkillPointData(items.equipment)
        .filter(item => itemRequiresSomething(item) || itemProvidesSomething(item));

    const toIterate = skillPointData
        .filter(item => itemRequiresSomething(item) && itemProvidesSomething(item));
    const onlyHasProvides = skillPointData
        .filter(item => itemProvidesSomething(item) && !itemRequiresSomething(item));
    const onlyHasRequirement = skillPointData
        .filter(item => itemRequiresSomething(item) && !itemProvidesSomething(item));

    const initialProvies = onlyHasProvides
        .reduce((total, item) => total.map((x, i) => x + item.added[i]), [0, 0, 0, 0, 0]);
    const unhelpfulMinimums = onlyHasRequirement
        .reduce((total, item) => total.map((x, i) => Math.max(x, item.required[i])), [0, 0, 0, 0, 0]);

    const finalUnhelpfulRequirements = weaponRequirements
        .map((x, i) => Math.max(x, unhelpfulMinimums[i]));

    const itemMins = getAssignedSPMinimums(toIterate, initialProvies);
    const addedMins = itemMins.added;
    const requiredMins = itemMins.required.map((min, j) =>
        finalUnhelpfulRequirements[j] > 0 ? Math.max(min + addedMins[j], finalUnhelpfulRequirements[j]) - addedMins[j] : min);
    return {required: requiredMins, added: addedMins};
}

function itemProvidesSomething(item) {
    return undefined !== item.added.find(x => x !== 0);
}

function itemRequiresSomething(item) {
    return undefined !== item.required.find(x => x !== 0);
}

// takes multiple seconds with a full build
function getAssignedSPMinimums(skillPointData, added = [0, 0, 0, 0, 0], required = [0, 0, 0, 0, 0]) {
    if (skillPointData.length > 0) {
        // return minimum of branches
        return skillPointData.map((item, i) => {
            const newAdded = added.map((total, j) => total + item.added[j]);
            const newRequired = required.map((min, j) =>
                item.required[j] > 0 ? Math.max(min + added[j], item.required[j]) - added[j] : min)
                .map((min, j) => min > 0 ? min + (item.added[j] < 0 ? -item.added[j] : 0) : 0);

            return getAssignedSPMinimums(skillPointData.toSpliced(i, 1), newAdded, newRequired);
        })
            .reduce((a, b) =>
                a.required.reduce((x, y) => x + y) <
                b.required.reduce((x, y) => x + y)
                    ? a : b);
    } else return {required: required, added: added};
}

function itemNamesToSkillPointData(equipment) {
    return equipment.map(item => getItemAsSkillPointData(getItem(item.name)));
}

function getItemAsSkillPointData(item) {
    return {
        required: skillPointNames.map(name => Number(item.requirements?.[name] ?? 0)),
        added: getItemAddedSP(item)
    };
}

function getSPRequirementForAllWeapons(weapons) {
    return weapons.reduce((mins, weapon) => {
        const reqs = getItemSPReqs(weapon.name);
        return mins.map((min, i) => Math.max(min, reqs[i]));
    }, [0, 0, 0, 0, 0]);
}

function getItemSPReqs(itemName) {
    const reqs = getItem(itemName)?.requirements ?? {};
    return skillPointNames.map(name => Number(reqs[name] ?? 0));
}

function balanceSP() {
    const remainingSP = document.getElementById("remaining_sp").dataset.value;
    if (remainingSP < 1) return;

    const spInputs = document.getElementById("sp_section");
    const strengthCluster = spInputs.querySelector(".sp_cluster[data-element='earth']")
    const strength = parseInt(strengthCluster.querySelector(".total_display").textContent);
    const dexterityCluster = spInputs.querySelector(".sp_cluster[data-element='thunder']");
    const dexterity = parseInt(dexterityCluster.querySelector(".total_display").textContent);

    let newStrength;
    let newDexterity;

    const difference = Math.max(0, Math.abs(strength - dexterity));
    const overBalance = remainingSP - difference

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
        newStrength =  remainingSP;
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
