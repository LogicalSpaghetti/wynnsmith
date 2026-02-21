import {OldItems} from "../item/item.ts";
import {maxPlayerLevel} from "../misc/small_stuff.ts";
import {Abilities} from "../ability/ability.js";
import * as search from "../database/item_database.ts";
import {getItemAddedSP, getSkillPointModifiers, skillPointNames} from "../skill_point/skill_points.ts";
import {base64ToBinary} from "../encoding/numbers.ts";
import permuteOrders from "../misc/permutation.js";

// TODO: should be part of the database
const latestVersion = 0;
const versionLength = 12;

export class Build {
    version;
    level;
    items;
    abilities;
    modifiedSP;

    constructor(version, level, items, modifiedSP, abilities) {
        this.version = version;
        this.level = level;
        this.items = items;
        this.abilities = abilities;
        this.modifiedSP = modifiedSP;
    }

    static fromURL() {
        const urlParams = new URL(window.location.toLocaleString()).searchParams;
        const b = urlParams.get('b');
        if (!b) return new Build();
        return Build.fromBase64(b);
    }

    static fromBase64(base64String) {
        const binary = base64ToBinary(base64String);
        // TODO
    }

    static fromHTML() {
        // TODO
        const level = document.getElementById("level_input").value;
        const items = OldItems.fromHTML();
        const modifiedSP = getSkillPointModifiers();
        const abilities = Abilities.fromHTML();
        return new Build(latestVersion, level, items, modifiedSP, abilities);
    }

    toURL() {
        // TODO
    }

    toBase64() {
        // TODO
    }

    toHTML() {
        // TODO
    }
}

function getEquipOrderInformation(items) {
    const weaponRequirements = getSPRequirementForAllWeapons(items.weapons);

    const skillPointData = itemNamesToSkillPointData(items.equipment);

    const providerRequirers = skillPointData
        .filter(item => itemRequiresSomething(item) && itemProvidesSomething(item));
    const exclusiveProviders = skillPointData
        .filter(item => itemProvidesSomething(item) && !itemRequiresSomething(item));
    const exclusiveRequirers = skillPointData
        .filter(item => itemRequiresSomething(item) && !itemProvidesSomething(item));
    const nothingItems = skillPointData
        .filter(item => !itemRequiresSomething(item) && !itemProvidesSomething(item));

    const initialProvided = exclusiveProviders
        .reduce((total, item) => total.map((x, i) => x + item.provided[i]), [0, 0, 0, 0, 0]);
    const unhelpfulItemMinimums = exclusiveRequirers
        .reduce((total, item) => total.map((x, i) => Math.max(x, item.required[i])), [0, 0, 0, 0, 0]);

    const unhelpfulRequirements = weaponRequirements
        .map((x, i) => Math.max(x, unhelpfulItemMinimums[i]));

    const subEquipOrder = getEquipOrder(providerRequirers, initialProvided);
    const requiredSPFromPRs = getEquipOrderRequirement(providerRequirers, subEquipOrder, initialProvided);

    const providedSP = addProvided(providerRequirers, initialProvided);

    const requiredSP = addRequirements(requiredSPFromPRs, providedSP, unhelpfulRequirements);

    const equipOrder = mergeEquipOrder(exclusiveProviders, providerRequirers, exclusiveRequirers, nothingItems, subEquipOrder);

    return {equip_order: equipOrder, required: requiredSP, provided: providedSP};
}

function getPlayerLevel() {
    const inputValue = document.getElementById("level_input").value;
    const value = Math.min(maxPlayerLevel, Math.max(1, parseInt(inputValue) || 0));
    if (inputValue !== "") document.getElementById("level_input").value = value;
    return value;
}

function getWeaponClass(name) {
    // noinspection JSUnresolvedReference
    return search.getItemInGroup("weapon", name)?.requirements?.classRequirement;
}

function itemProvidesSomething(item) {
    return undefined !== item.provided.find(x => x !== 0);
}

function itemRequiresSomething(item) {
    return undefined !== item.required.find(x => x !== 0);
}

function itemNamesToSkillPointData(equipment) {
    return equipment.map(item => getItemAsSkillPointData(search.getItemByName(item.name)));
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
        const reqs = getItemSPReqs(search.getItemByName(weapon.name));
        return mins.map((min, i) => Math.max(min, reqs[i]));
    }, [0, 0, 0, 0, 0]);
}

function getItemSPReqs(item) {
    const reqs = item?.requirements ?? {};
    return skillPointNames.map(name => Number(reqs[name] ?? 0));
}

function mergeEquipOrder(pre, central, post, nothing, centralOrder) {
    return nothing.concat(pre).concat(centralOrder.map(i => central[i])).concat(post).map(item => item.name);
}

// TODO: sets
function getEquipOrder(itemRanges, initialProvided = [0, 0, 0, 0, 0]) {
    if (itemRanges.length < 1) return [];

    let currentMinRequirement;
    let currentBest;

    // note: If there's any room to optimize the build order/SP calculation, it's going to be within this function.
    function tryOrder(orderedIndexes) {
        const requiredSP = getEquipOrderRequirement(itemRanges, orderedIndexes, initialProvided)
            .reduce((a, b) => a + b);

        if (currentMinRequirement == null || currentMinRequirement > requiredSP) {
            currentMinRequirement = requiredSP;
            currentBest = [...orderedIndexes];
        }
    }

    permuteOrders(itemRanges.length, itemRanges.length, tryOrder);

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
