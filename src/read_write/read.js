`use strict`;

function readBuild(build) {
    const input = new Input();

    readOldClass(build);
    readPlayerLevel(build);
    readItems(build);
    readSkillPointModifiers(build);
    readAbilities(build);
    readToggles(build);

    return input;
}

function readOldClass(build) {
    build.previousClass = document.getElementById("ability_tree").dataset.class;
}

function readPlayerLevel(build) {
    build.level =
        Math.min(maxPlayerLevel,
            Math.max(1,
                parseInt(document.getElementById("level_input").value) || 0));
}

function getPlayerLevel() {
    return Math.min(maxPlayerLevel,
        Math.max(1,
            parseInt(document.getElementById("level_input").value) || 0));
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
    const skillPointData = itemNamesToSkillPointData(items.equipment);
    const itemMins = getAssignedSPMinimums(skillPointData);
    const addedMins = itemMins.added
    const requiredMins = itemMins.required.map((min, j) =>
        Math.max(min + addedMins[j], weaponRequirements[j]) - addedMins[j]);

    return {required: requiredMins, added: addedMins};
}

// takes multiple seconds with a full build
function getAssignedSPMinimums(skillPointData, required = [0, 0, 0, 0, 0], added = [0, 0, 0, 0, 0]) {
    if (skillPointData.length > 0) {
        // return minimum of branches
        return skillPointData.map((item, i) => {
            const newAssigned = required.map((min, j) =>
                Math.max(min + added[j], item.required[j]) - added[j]);
            const newAdded = added.map((total, j) => total + item.added[j]);

            return getAssignedSPMinimums(skillPointData.toSpliced(i, 1), newAssigned, newAdded);
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
    }
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

function getSkillPointTotal(minimums, items, sp_modifiers) {
    // TODO: modify here to get sans-weapon totals to use everything
    return sp_modifiers;
}
