const copyShortButton = document.querySelector(`.btn--short`);
const copyLongButton = document.querySelector(`.btn--long`);

copyShortButton.addEventListener("click", function () {
    navigator.clipboard.writeText(getBuildLink(false));
    copyShortButton.textContent = "Build copied!";
});

copyLongButton.addEventListener("click", function () {
    navigator.clipboard.writeText(getBuildLink(true));
    copyLongButton.textContent = "Build copied!";
});

function getBuildLink(long) {
    console.log(window.location.pathname);
    var text = document.URL.replace("index.html", "") + "?";
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