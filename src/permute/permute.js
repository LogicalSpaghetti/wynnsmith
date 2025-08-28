`use strict`;

function getWeaponBuilds(input) {
    return !input ? [] : input.items.weapons.map(weapon => new Build(weapon, input));
}

function permuteOldBuild(build) {
    parseEffects(build);

    computeIdentifications(build);

    calculateSustainStats(build);
    // calculateDamageConversions(build);
}

function permuteBuild(build) {
    console.log("build: ", build);

    modifyIdentifications(build);
    calculateStats(build);

    // TODO: rework for new system
    calculateDamageConversions(build);
}

class Build {
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
    resistances;
    personal_multipliers;
    team_multipliers;
    spell_costs;
    spell_cost_modifiers;
    spell_cost_multipliers;
    variants;
    displays;

    constructor(weapon, input) {
        this.weapon = weapon;
        this.equipment = input.items.equipment;
        this.tomes = input.items.tomes;

        this.level = input.level;

        this.wynnClass = input.wynnClass;

        const abilities = getAbilities(input.abilities, weapon, input.items.equipment);

        this.effects = getBuildEffects(abilities, this.wynnClass);

        const splitEffects = getSplitEffects(this.effects, this.wynnClass);
        for (let key in splitEffects) if (key !== "effects") this[key] = splitEffects[key];

        const weaponTotals = getWeaponSkillPoints(getItem(this.weapon.name))
        this.sp_totals = input.sp_totals.map((total, index) => total + (weaponTotals[index] ?? 0));
        this.sp_multipliers = this.sp_totals.map(total => spMultipliers[total]);

        const itemStats = sumItemStats(this.weapon, this.equipment);
        this.base = itemStats.base;
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

function getWeaponSkillPoints(weapon) {
    return capitalizedSkillPointNames.map((name) =>
        (weapon.identifications) ? weapon.identifications[`raw${name}`] : 0);
}
