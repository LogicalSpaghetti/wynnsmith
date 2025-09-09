`use strict`;

function permute(input) {
    console.log("input: ", input);
    const builds = getWeaponBuilds(input);
    builds?.forEach(build => permuteBuild(build));

    return builds;
}

function getWeaponBuilds(input) {
    return input?.items.weapons.map(weapon => new Build(weapon, input));
}

function permuteBuild(build) {
    console.log("build: ", build);

    modifyIdentifications(build);
    calculateIdSkillPoints(build);
    calculateStats(build);

    calculateDamageConversions(build);
}

class NewBuild {
    constructor(weapon, level, equipment, tomes, abilities, toggles, assigned_skill_points, modified_skill_points) {
        this.weapon = weapon;
        this.level = level;
        this.equipment = equipment;
        this.tomes = tomes;
        this.abilities = abilities;
        this.toggles = toggles;
        this.skill_points = assigned_skill_points.map((sp, i) => sp + modified_skill_points[i]);
    }
}

class Build {
    level;

    weapon;
    equipment;
    tomes;

    effects = {};

    base = {};
    identifications = {};

    stats = {};
    statArrays = {};

    sp_totals;
    sp_multipliers;

    attacks;
    masteries;
    heals;
    heal_variants;
    heal_id_multipliers;
    resistances;
    personal_multipliers;
    team_multipliers;
    spell_costs;
    spell_cost_modifiers;
    spell_cost_multipliers;
    id_multipliers;
    variants;
    displays;

    toggles;

    constructor(weapon, input) {
        const weaponItem = getItem(weapon.name);

        this.level = input.level;

        this.weapon = weapon;
        this.equipment = input.items.equipment;
        this.tomes = input.items.tomes;

        this.wynnClass = input.wynnClass;

        const abilities = getAbilities(input.abilities, weapon, input.items.equipment);
        this.toggles = input.abilities.toggles;

        this.effects = getBuildEffects(abilities, this.wynnClass);

        const splitEffects = getSplitEffects(this.effects, this.toggles, this.wynnClass);
        for (let key in splitEffects) if (key !== "effects") this[key] = splitEffects[key];

        const weaponTotals = getItemAddedSP(weaponItem);
        this.sp_totals = input.sp_assigned.map((sp, i) =>
            sp + input.sp_provided[i] + input.sp_modified[i] + weaponTotals[i]);
        this.sp_multipliers = this.sp_totals.map((total, i) => getSkillPointMultiplier(total, i));

        const itemStats = sumItemStats(this.weapon, this.equipment);
        this.base = itemStats.base;
        this.base.attackSpeed = orderedAttackSpeed.indexOf(weaponItem.attackSpeed);
        this.identifications = itemStats.identifications;
    }
}

function getMajorIds(items) {
    if (!items.length) return getItem(items.name)?.majorIds;
    return items.reduce((arr, item) => arr.concat(getItem(item?.name)?.majorIds), [])
        .filter(item => item != null);
}

function sumItemStats(weapon, equipment) {
    const itemArray = equipment.concat(weapon);

    return {
        base:
            itemArray.reduce((arr, item) => addBasesToObject(arr, getItem(item?.name)?.base), JSON.parse(emptyBaseString)),
        identifications:
            itemArray.reduce((arr, item) =>
                addIdsToObject(arr, getItem(item?.name)?.identifications), JSON.parse(emptyIdsString))
    };
}

function addBasesToObject(object, base) {
    if (base) for (let baseName in base) addBaseToObject(object, baseName, base[baseName]);
    return object;
}

function addBaseToObject(object, baseKey, base) {
    if (!base) return;
    if (Number.isInteger(base)) {
        object[baseKey] += base;
    } else {
        addMinAndMaxTo(object[baseKey], base);
    }
}

function addIdsToObject(object, ids) {
    if (ids) for (let idKey in ids) addIdToObject(object, idKey, ids[idKey]);
    return object;
}

function addIdToObject(object, idName, id) {
    object[idName] += getAsMax(id);
}

function getAsMax(possibleInt) {
    if (Number.isInteger(possibleInt)) return possibleInt;
    return possibleInt.max;
}

function getItemAddedSP(item) {
    return capitalizedSkillPointNames.map((name) => Number(item?.identifications[`raw${name}`] ?? 0));
}
