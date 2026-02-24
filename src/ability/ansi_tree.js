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

export default function copyTreeAsANSI() {
    // noinspection JSIgnoredPromiseFromCall
    navigator.clipboard.writeText(getTreeAsANSI());
}

function getTreeAsANSI() {
    let result = "```ansi";
    for (const row of document.getElementById("ability_tree").childNodes) {
        result += "\n";
        for (let cell of row.childNodes)
            if (!cell.classList.contains("tree_cell")) result += " ";
            else if (cell.dataset.type === "node") result += getNodeANSI(cell);
            else if (cell.dataset.type === "connector") result += getConnectorANSI(cell);
    }
    result += "```";
    return result.replaceAll(/\s+\n/g, "\n");
}

function getConnectorANSI(cell) {
    if (cell.dataset.highlights === "0000") return " ";

    return ansiColors["teal"] +
        branchHighlightSymbols[cell.dataset.highlights] ?? cell.dataset.highlights +
        ansiColorTerminator;
}

function getNodeANSI(cell) {
    return ((cell.dataset.selected !== "true" ? ansiColors["grey"] :
            (ansiColors[cell.dataset.color] ?? `Invalid Color: ${cell.dataset.color}`)) +
        nodeSymbol + ansiColorTerminator);
}
