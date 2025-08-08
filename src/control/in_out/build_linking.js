`use strict`;

const max_level = 106;

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
