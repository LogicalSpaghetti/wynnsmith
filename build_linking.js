`use strict`;

const searchParams = new URLSearchParams(window.location.search);

function copyBuildLink(button, long) {
    navigator.clipboard.writeText(getBuildLink(long));
    button.textContent = "Build copied!";
}

function getBuildLink(long) {
    var text = location.href.replace(location.search, '') + '?';
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
        const inputParam = searchParams.get(itemType).split('>')[0];
        if (inputParam === undefined || inputParam === null) continue;

        const slotContent = inputParam;

        input.value = slotContent.replaceAll("_", " ");
    }
}
