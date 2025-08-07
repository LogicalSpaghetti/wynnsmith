`use strict`;

// TODO: not abstract enough at all
window.addEventListener("load", function () {
    const item = getItemFromSearch(window.location.search);
    document.title = `WynnSearch - ${item ? item.name : "Invalid Item!"}`;

    const display = document.getElementById("item_display");
    display.innerHTML = getHoverHTMLForItem(item, "Invalid Item!");
});

document.addEventListener("keydown", function (event) {
    if (event.key === "c") {
        event.preventDefault();
        copyImageById("item_display");
    }
    if (event.key === "s") {
        event.preventDefault();
        saveImageById("item_display");
    }
});