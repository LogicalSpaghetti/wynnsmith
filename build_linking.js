const copyShortButton = document.querySelector(`.btn--short`);
const copyLongButton = document.querySelector(`.btn--long`);

const searchParams = new URLSearchParams(window.location.search);

copyShortButton.addEventListener("click", function () {
    navigator.clipboard.writeText(getBuildLink(false));
    copyShortButton.textContent = "Build copied!";
});

copyLongButton.addEventListener("click", function () {
    navigator.clipboard.writeText(getBuildLink(true));
    copyLongButton.textContent = "Build copied!";
});

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
        const inputParam = searchParams.get(itemType);
        if (inputParam === undefined || inputParam === null) continue;

        const slotContent = inputParam;

        input.value = slotContent.replaceAll("_", " ");
    }
}
