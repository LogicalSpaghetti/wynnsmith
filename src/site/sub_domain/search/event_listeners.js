import {copyImageById} from "../../common/image_exporting.js";
import {saveImageById} from "../../common/image_exporting.js";
import {getItemFromSearch} from "../../logic/item/item_search.ts";
import {getHoverTextForItem} from "../../common/minecraft_html.js";

window.addEventListener("load", function () {
    const item = getItemFromSearch(window.location.search);
    document.title = `WynnSearch - ${item ? item.name : "Invalid Item!"}`;

    const display = document.getElementById("item_display");
    display.innerHTML = getHoverTextForItem(item, "Invalid Item!");
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

document.addEventListener("keydown", (e) => {
    if (e.key === "c") {
        e.preventDefault();
        copyImageById("item_display");
    }
    if (e.key === "s") {
        e.preventDefault();
        saveImageById("item_display");
    }
    if (e.key === "l") {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.toString());
    }
});
