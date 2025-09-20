import {base64ToDecimal, binaryToDecimal, decimalToBase64, decimalToBinary} from "../util/numbers.js";
import {getItemByCluster} from "./get_items.js";
import {maxPlayerLevel} from "../data/small_stuff.js";
import {getNewInput} from "./read.js";
import indexedInternalNameGroups from "../data/indexed_names.js";

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

// encodeInput({level: 106, items:{weapons:[{slot:"weapon",name:"Warp",powders:["f6","f6","f6","f6","f6","f6","f6","f6","f6"]}]}});
function encodeInput(input) {
    // padding 1
    // isBuild flag
    let link = "11";
    // version
    link += decimalToBinary(version).padStart(12, "0");
    // level
    link += input.level === maxPlayerLevel ? "1"
        : "0" + decimalToBinary(input.level).padStart(decimalToBinary(maxPlayerLevel).length, "0");
    link += encodeItems(input);


    return decimalToBase64(binaryToDecimal(link));
}

function encodeItems(input) {
    // TODO offhand count 3bits
    return encodeItem(input.items.weapons[0]);
    // TODO: other items
    //  item slot needs to be stored
}

function encodeItem(item) {
    return encodeItemData(item) + encodeItemPowders(item);
}

// TODO: add internalName to all items
//  turn items into a class
function encodeItemData(item) {
    if (!item.type) {
        return "0" + `${decimalToBinary(indexedInternalNameGroups[item.slot].indexOf(item.name) + 1)}`
            .padStart(decimalToBinary(indexedInternalNameGroups[item.slot].length + 1).length, "0");
    } else if (item.type === "crafted") {

    } else if (item.type === "modified") {

    } else if (item.type === "custom") {

    } else console.error(`invalid item: ${JSON.stringify(item)}`);
}

const powderLetters = ["e", "t", "w", "f", "a"];
const maxPowderTier = 6;

function encodeItemPowders(item) {
    if (!item?.powders?.length) return "0";

    let result = "1";

    let lastPowder = "";
    for (let i = 0; i < item.powders.length; i++) {
        const powder = item.powders[i];

        if (i > 0) result += powder === lastPowder ? "1" : "0";
        if (powder !== lastPowder)
            if (powder[1] === String(maxPowderTier)) {
                result += decimalToBinary(powderLetters.indexOf(powder[0])).padStart(3, "0");
            } else {
                result += "101";
                result += decimalToBinary(powderLetters.indexOf(powder[0])).padStart(3, "0");
                result += decimalToBinary(powder[1]).padStart(3, "0");
            }

        lastPowder = powder;
    }
    return result;
}

export function decodeLink(query) {
    const binary = decimalToBinary(base64ToDecimal(query));

    if (binary[1] === "1") return decodeBuild(binary.splice(0, 2));


}

const versionBits = 12;
const slots = ["weapon", "helmet", "chestplate", "leggings", "boots", "ring", "ring", "bracelet", "necklace"]

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

function decodeItemName(binary, category) {
    const type = binary.splice(0, 1);
    if (type === "0") {
        const length = getBinaryLength(indexedInternalNameGroups[category].length + 1);
        const index = binaryToDecimal(binary.splice(0, length));
        if (index === 0) return "";
        return indexedInternalNameGroups[category][index - 1];
    } else throw new Error(`invalid item type: ${type}`);
}

function decodePowders(binary) {
    const powders = [];

    let morePowders = true;
    while (morePowders) {
        const type = binaryToDecimal(binary.splice(0, 3));
        let element;
        let tier;
        if (type < powderLetters.length) {
            element = powderLetters[type];
            tier = maxPowderTier;
        } else if (type === powderLetters.length) {
            element = powderLetters[binaryToDecimal(binary.splice(0, 3))];
            tier = binaryToDecimal(binary.splice(0, 3));
        } else throw new Error(`no powder encoding for type: ${type}`);
        powders.push(`${element}${tier}`);
    }

    return powders;
}

function getBinaryLength(decimal) {
    return decimalToBinary(decimal).length;
}