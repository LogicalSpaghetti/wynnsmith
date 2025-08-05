`use strict`;

const searchParams = new URLSearchParams(window.location.search);

function copyBuildLink(button, long) {
    navigator.clipboard.writeText(getBuildLink(long));
    button.textContent = "Build copied!";
}

function getBuildLink(long) {
    let text = location.href.replace(location.search, "") + "?";
    let appendedText = "";
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];

        const item = getItemByInput(input);
        if (item === undefined) continue;
        if (text.charAt(text.length - 1) !== "?") text += "&";
        text += input.dataset["slot"] + "=" + input.value.replaceAll(" ", "_");
        if (long) appendedText += "\n> " + input.value;
    }
    return text + appendedText + "\n";
}

function loadBuildFromLink() {
    inputs.forEach(input => {
        const itemType = input.dataset["slot"];
        if (searchParams.get(itemType) === null) return;
        const slotContent = searchParams.get(itemType).split(">")[0];
        if (slotContent === undefined || slotContent === null) return;

        input.value = slotContent.replaceAll("_", " ");
    });
}

// new system:

function loadFullBuildFromLink() {
    if (window.location.search === "") return;
    const link = window.location.search.substring(1, window.location.search.length);
    const linkSections = link.split("-");
    linkSections.forEach(evaluateSection);
}

function evaluateSection(section) {
    const unmarkedSection = section.substring(1, section.length);
    switch (section[0]) {
        case "v":
            evaluateVersion(unmarkedSection);
            break;
        case "s":
            evaluateSet(unmarkedSection);
            break;
        case "p":
            evaluatePowders(unmarkedSection);
            break;
        case "t":
            evaluateTree(unmarkedSection);
            break;
        case "a":
            evaluateAspects(unmarkedSection);
            break;
        case "o":
            evaluateTomes(unmarkedSection);
            break;
        default:
            console.log(section + " is not a proper section parameter!");
    }
}

function evaluateVersion(version) {
    console.log("PedBuilder version = " + version);
}

function evaluateSet(set) {
    console.log("set = " + set);
}

function evaluatePowders(powders) {
    console.log("powders = " + powders);
}

function evaluateTree(tree) {
    console.log("tree = " + tree);
}

function evaluateAspects(aspects) {
    console.log("aspects = " + aspects);
}

function evaluateTomes(tomes) {
    console.log("tomes = " + tomes);
}

function copyTreeAsText() {
    const red = `[2;31m`;
    const green = "[2;32m";
    const yellow = "[2;33m";
    const blue = `[2;34m`;
    const purple = `[2;35m`;
    const white = "[2;37m";

    const grey = "[2;30m";
    const teal = "[2;36m";

    const bold = "[1;2m"
    const foot = `[0m`;

    const tree = document.getElementById("abilityTree");
    const trs = tree.childNodes;

    let output = "```ansi";

    let rowCounter = 0;
    trs.forEach((tr) => {
        rowCounter++;
        if (rowCounter % 6 === 1 && rowCounter !== 1) return;
        output += "\n";
        tr.childNodes.forEach((td) => {
            if (!td.classList.contains("tree_cell")) {
                output += " ";
                return;
            }

            if (td.dataset.type === "node") {
                if (td.dataset.selected !== "true") {
                    output += grey;

                } else
                switch (td.dataset.color) {
                    case "red":
                        output += red;
                        break;
                    case "skill":
                        output += green;
                        break;
                    case "blue":
                        output += blue;
                        break;
                    case "purple":
                        output += purple;
                        break;
                    case "yellow":
                        output += yellow;
                        break;
                    case "white":
                        output += white;
                        break;
                    default:
                        output += "?";
                }
                output += "♦" + foot;
            } else if (td.dataset.type === "connector") {
                if (td.dataset.highlights === "0000") {
                    output += " ";
                    return;
                }
                output += teal;
                switch (td.dataset.highlights) {
                    case "0220":
                        output += "┐";
                        break;
                    case "0202":
                        output += "┌";
                        break;
                    case "0222":
                        output += "┬";
                        break;
                    case "0022":
                        output += "─";
                        break;
                    case "2200":
                        output += "│";
                        break;
                    case "2220":
                        output += "┤";
                        break;
                    case "2020":
                        output += "┘";
                        break;
                    case "2002":
                        output += "└";
                        break;
                    case "2202":
                        output += "├";
                        break;
                    case "2222":
                        output += "┼";
                        break;
                    case "2022":
                        output += "┴";
                        break;
                    default:
                        output += "?";
                }
                output += foot;
            }
        });
    });

    output += "```";

    navigator.clipboard.writeText(output);
}
