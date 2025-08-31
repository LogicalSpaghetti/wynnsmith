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
