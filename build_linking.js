`use strict`;

const searchParams = new URLSearchParams(window.location.search);

function copyBuildLink(button, long) {
    navigator.clipboard.writeText(getBuildLink(long));
    button.textContent = "Build copied!";
}

function getBuildLink(long) {
    var text = location.href.replace(location.search, "") + "?";
    var appendedText = "";
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
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const itemType = input.dataset["slot"];
        if (searchParams.get(itemType) === null) continue;
        const inputParam = searchParams.get(itemType).split(">")[0];
        if (inputParam === undefined || inputParam === null) continue;

        const slotContent = inputParam;

        input.value = slotContent.replaceAll("_", " ");
    }
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
    console.log("Fielbuilder version = " + version);
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
