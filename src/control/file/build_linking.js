`use strict`;

/* Import: */

// todo: take from a build object instead of parsing from HTML, (that way stuff is more pre-formatted)
function getInputData() {
    const inputData = {
        version: 0,
        level: 106,
        gear: [],
        powders: [],
        modifiedSP: [],
        aspects: [],
        tomes: [],
        tree: {},
    }

    for (let cluster of document.getElementById("item_inputs").querySelectorAll('.input_cluster')) {

    }
}

function encodeBuild(inputData) {

}

/* Export: */

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
    }
    return text + appendedText + "\n";
}

function copyTreeAsANSIText() {
    const red = `[2;31m`;
    const green = "[2;32m";
    const yellow = "[2;33m";
    const blue = `[2;34m`;
    const purple = `[2;35m`;
    const white = "[2;37m";

    const grey = "[2;30m";
    const teal = "[2;36m";

    // const bold = "[1;2m";
    const foot = `[0m`;

    const tree = document.getElementById("ability_tree");
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
