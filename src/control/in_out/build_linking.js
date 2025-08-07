`use strict`;

/* Import: */

function getInputDataWhichShouldReallyBeAStepInTheMainChain() {
    const inputData = {
        gear: [],
        weapon: undefined,
        tree: undefined,

    }

    // for (let cluster of document.getElementById(""))
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
