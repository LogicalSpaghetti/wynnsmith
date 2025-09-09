`use strict`;

function copyBuildLink(button, long) {
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

const nodeSymbol = "♦";
const ansiColorTerminator = `[0m`;
const ansiColors = Object.freeze({
    red: `[2;31m`,
    skill: "[2;32m",
    yellow: "[2;33m",
    blue: `[2;34m`,
    purple: `[2;35m`,
    white: "[2;37m",
    grey: "[2;30m",
    teal: "[2;36m"
});
const branchHighlightSymbols = Object.freeze({
    "0220": "┐",
    "0202": "┌",
    "0222": "┬",
    "0022": "─",
    "2200": "│",
    "2220": "┤",
    "2020": "┘",
    "2002": "└",
    "2202": "├",
    "2222": "┼",
    "2022": "┴"
});

function copyTreeAsANSI() {
    navigator.clipboard.writeText(getTreeAsANSI());
}

function getTreeAsANSI() {
    let result = "```ansi";
    for (const row of document.getElementById("ability_tree").childNodes) {
        // if (i % 6 === 0 && i !== 0) continue;
        result += "\n";
        for (let cell of row.childNodes)
            if (!cell.classList.contains("tree_cell")) result += " ";
            else if (cell.dataset.type === "node") getNodeANSI(cell);
            else if (cell.dataset.type === "connector") result += getConnectorANSI(cell);
    }
    return result + "```";
}

function getConnectorANSI(cell) {
    if (cell.dataset.highlights === "0000") return " ";

    return ansiColors["teal"] +
        branchHighlightSymbols[cell.dataset.highlights] ?? cell.dataset.highlights +
        ansiColorTerminator;
}

function getNodeANSI(cell) {
    return (cell.dataset.selected !== "true" ? ansiColors["grey"] :
            (ansiColors[cell.dataset.color] ?? `Invalid Color: ${cell.dataset.color}`)) +
        nodeSymbol + ansiColorTerminator;
}

const version = 0;

// encodeInput({level: 106, items:{weapons:[{slot:"weapon",name:"Warp",powders:["f6","f6","f6","f6","f6","f6","f6","f6","f6"]}]}});
function encodeInput(input) {
    let link = "11";
    // version
    link += decimalToBinary(version).padStart(12, "0");
    // level
    link += input.level === maxPlayerLevel ? "1"
        : "0" + decimalToBinary(input.level).padStart(decimalToBinary(maxPlayerLevel).length, "0");
    link += encodeItems(input);

    // TODO: get input items in order
    return decimalToBase64(binaryToDecimal(link));
}

function encodeItems(input) {
    return encodeItem(input.items.weapons[0]);
}

function encodeItem(item) {
    return encodeItemData(item) + encodeItemPowders(item);
}

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

function encodeItemPowders(item) {
    if (!item?.powders?.length) return "0";

    let result = "1";

    let lastPowder = "";
    for (let i = 0; i < item.powders.length; i++) {
        const powder = item.powders[i];

        if (i > 0) result += powder === lastPowder ? "1" : "0";
        if (powder !== lastPowder)
            if (powder[1] === "6") {
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
