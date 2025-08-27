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

    sp_totals = [0, 0, 0, 0, 0];

    init() {
        this.items = getItemsFromHTML();
        if (this.items.weapons.length === 0) return null;

        this.wynnClass = getClassRequirementByWeaponName(this.items.weapons[0].name);
        this.level = getPlayerLevel();

        this.abilities = getInputAbilities(this.wynnClass);

        this.sp_totals = getMinimumSkillPointTotal(this.items, getSkillPointModifiers());
    }
}

function getMinimumSkillPointTotal(items, sp_modifiers) {
    // TODO: modify here to get sans-weapon totals to use everything
    return sp_modifiers
}
