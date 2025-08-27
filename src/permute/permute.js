`use strict`;

function getWeaponBuilds(input) {
    if (!input) return [];

    const builds = input.items.weapons.map(weapon => new Build(weapon, input));

    builds.forEach(build => permuteBuild(build));
}

function permuteOldBuild(build) {
    parseEffects(build);

    computeIdentifications(build);

    calculateSustainStats(build);
    calculateDamageConversions(build);
}

function permuteBuild(build) {
    console.log("build: ", build);
}

class Build {
    weapon;
    equipment;

    effects = {};

    base = {};
    identifications = {};

    stats = {};
    statArrays = {};

    constructor(weapon, input) {
        this.weapon = weapon;
        this.equipment = input.items.equipment;

        this.level = input.level;

        this.wynnClass = input.wynnClass;

        const abilities = getAbilities(input.abilities, weapon, input.items.equipment);
        this.effects = getSeparatedEffects(abilities, this.wynnClass);

        this.sp_totals = input.sp_totals;

        const itemStats = sumItemStats(this.weapon, this.equipment);
        this.base = itemStats.base;
        this.identifications = itemStats.identifications;
    }
}

function getAbilities(abilities, weapon, equipment) {
    const items = equipment.concat(weapon);

    abilities.majorIds = getMajorIds(items);
    abilities.powderSpecials = items.map(item => item?.special).filter(item => item != null);

    return abilities;
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
    console.log(getAsMax(id), idName)
    object[idName] += getAsMax(id);
}

function getAsMax(possibleInt) {
    if (Number.isInteger(possibleInt)) return possibleInt;
    return possibleInt.max;
}
