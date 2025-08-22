`use strict`;

window.addEventListener("load", function () {
    const item = getItemFromSearch(window.location.search);
    document.title = `WynnSearch - ${item ? item.name : "Invalid Item!"}`;

    const display = document.getElementById("item_display");
    display.innerHTML = getHoverHTMLForItem(item, "Invalid Item!");
    display.style.transformOrigin = "top center";
    scaleDisplay(display);

    if (item) document.querySelector("#wiki_link").href =
        "https://wynncraft.wiki.gg/wiki/Special:Search?search=" + item.name;
});

window.addEventListener("resize", function () {
    const display = document.getElementById("item_display");
    scaleDisplay(display);
});

function scaleDisplay(display) {
    const height = display.getBoundingClientRect().height;
    display.style.scale = (Math.min(window.innerHeight - 16, height) / height) * 100 + "%";
}

document.addEventListener("keydown", function (event) {
    if (event.key === "c") {
        event.preventDefault();
        copyImageById("item_display");
    }
    if (event.key === "s") {
        event.preventDefault();
        saveImageById("item_display");
    }

    if (event.key === "l") {
        event.preventDefault();
        navigator.clipboard.writeText(window.location.toString());
    }
});
