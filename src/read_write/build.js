import {base64ToDecimal, binaryToDecimal, decimalToBase64, decimalToBinary} from "../util/numbers.js";
import {getBinaryLength, getItemByCluster} from "./get_items.js";
import punscake from "../data/trees.js";
import {Items} from "./get_items.js";
import {maxPlayerLevel, wynnClasses} from "../data/small_stuff.js";
import {getInputAbilities} from "./ability_tree.js";
import * as search from "./item_search.js";
import {
    getItemAddedSP,
    getSkillPointModifiers,
    skillPointNames
} from "../permute/skill_points.js";
import indexedInternalNameGroups from "../data/indexed_names.js";

export function getInputByElementClass(elementClass) {
    return getPrimaryInput();
}

export function getNewInput() {
    return new Input();
}

// TODO: remove once class system is set up.
function getPrimaryInput() {
    const input = new Input();
    input.init();
    return input;
}

class Input {
    level;
    wynnClass = "";

    items;
    abilities;

    sp_assigned;
    sp_provided;
    sp_modified;

    init(weapon = 0) {
        this.items = Items.fromHTML();
        if (this.items.weapons.length === 0) return null;

        this.wynnClass = getWeaponClass(this.items.weapons[0].name);
        this.level = getPlayerLevel();

        this.abilities = getInputAbilities(this.wynnClass);

        const equipOrderInformation = getEquipOrderInformation(this.items);
        this.equip_order = equipOrderInformation.equip_order;
        this.sp_assigned = equipOrderInformation.required;
        this.sp_provided = equipOrderInformation.provided;
        this.sp_modified = getSkillPointModifiers();
    }

    static getPrimary() {
        // TODO
    }

    // encodeInput({level: 106, items:{weapons:[{slot:"weapon",name:"Warp",powders:["f6","f6","f6","f6","f6","f6","f6","f6","f6"]}]}});
    toBinary(input) {
        // padding 1
        // isBuild flag
        let link = "11";
        // version
        link += decimalToBinary(version).padStart(12, "0");
        // level
        link += input.level === maxPlayerLevel ? "1"
            : "0" + decimalToBinary(input.level).padStart(decimalToBinary(maxPlayerLevel).length, "0");
        link += this.items.toBinary();


        return decimalToBase64(binaryToDecimal(link));
    }

}

export class Tree {
    wynnClass;
    nodes = [];

    static fromElement(id = "ability_tree") {
        const tree = new Tree();

        const treeElement = document.getElementById(id);

        tree.wynnClass = treeElement.dataset.class;

        for (const node of treeElement.querySelectorAll("[data-type='node']"))
            tree.nodes.push({
                map_id: node.dataset.map_id,
                selected: node.dataset.selected === "true"
            });

        return tree;
    }

    static fromClass(wynnClass = "archer") {
        const tree = new Tree();

        tree.wynnClass = wynnClass;

        for (const map_id in punscake[wynnClass].cellMap.filter(cell => cell.abilityID != null))
            tree.nodes.push({
                map_id,
                selected: false
            });

        return tree;
    }

    // TODO: version?
    //  to hell with versioning
    static fromLink(link, wynnClass = "inLink") {
        const tree = new Tree();

        tree.wynnClass = wynnClass !== "inLink" ? wynnClass : wynnClasses[binaryToDecimal(link.splice(0, 3))];

        const mapIds = Object.keys(punscake[tree.wynnClass].cellMap.filter(cell => cell.abilityID != null));
        for (let i = 0; i < mapIds.length; i++)
            tree.nodes.push({
                map_id: mapIds[i],
                selected: link[i] === "1"
            });

        link.splice(0, mapIds.length);

        return tree;
    }

    toLink(includeClass = false) {
        let link = "";

        if (includeClass) link += decimalToBinary(wynnClasses.indexOf(this.wynnClass)).padStart(3, "0");

        for (let node of this.nodes) link += node.selected ? "1" : "0";

        return link;
    }
}

class Build {
    weapon;
    level;
    equipment;
    tomes;
    abilities;
    toggles;
    assigned_skill_points;
    modified_skill_points;

    constructor(weapon, level, equipment, tomes, abilities, toggles, assigned_skill_points, modified_skill_points) {
        this.weapon = weapon;
        this.level = level;
        this.equipment = equipment;
        this.tomes = tomes;
        this.abilities = abilities;
        this.toggles = toggles;
        this.assigned_skill_points = assigned_skill_points;
        this.modified_skill_points = modified_skill_points;
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

const version = 0;

export function copyBuildLink(button, long) {
    navigator.clipboard.writeText(getBuildLink(long));
}

function getBuildLink(isLong) {
    let text = location.href.replace(location.search, "") + "?";
    let appendedText = "";
    const inputs = document.getElementById("item_inputs")
        .querySelectorAll(".input_cluster");
    for (let cluster of inputs) {
        const item = getItemByCluster(cluster);
        if (!item) continue;

        if (text.charAt(text.length - 1) !== "?") text += "&";
        text += cluster.dataset["slot"] + "=" + item.name.replaceAll(" ", "_");
        if (isLong) appendedText += "\n> " + item.name;
        if (isLong && cluster.dataset["slot"] === "weapon")
            appendedText += " [" + cluster.querySelector(".powder_input").value + "]";
    }
    return text + appendedText + "\n";
}

export function decodeLink(query) {
    const binary = decimalToBinary(base64ToDecimal(query));

    if (binary[1] === "1") return decodeBuild(binary.splice(0, 2));


}

const versionBits = 12;

function decodeBuild(binary) {
    const input = getNewInput();
    // TODO database versioning
    const linkVersion = binaryToDecimal(binary.splice(0, versionBits));
    const isMaxLevel = binary.splice(0, 1) === "1";
    input.level = isMaxLevel ? maxPlayerLevel : binary.splice(0, getBinaryLength(maxPlayerLevel));

    const offhandCount = binaryToDecimal(binary.splice(0, 3));
    // for each item
    for (let i = 0; i < slots.length + offhandCount; i++) {
        const categoryIndex = (i < offhandCount) ? 0 : i - offhandCount;
        const category = slots[categoryIndex];
        const item = {};
        item.name = decodeItemName(binary, category);
        const hasPowders = binary.splice(0, 1) === "1";
        if (hasPowders) item.powders = decodePowders(binary);
    }
}
