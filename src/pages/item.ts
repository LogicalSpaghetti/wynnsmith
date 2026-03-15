import {itemDatabase} from "../database/item_database.ts";
import {getHoverTextForItem} from "../hover_html/item_html.ts";
import searchIcon from "../../assets/img/icons/glass.png";
import {setPageIcon} from "./common.ts";
import {navigateTo} from "../router.ts";

export function showItem(itemName: string, render: (...elements: Node[]) => void) {
    const item = itemDatabase.getItemByName(itemName);
    if (!item) {
        // TODO: more advanced search input using more than just one param
        navigateTo(`/items/?${itemName}`);
        return;
    }

    setPageIcon(searchIcon);
    document.title = `WynnSearch - ${item ? item.name : "Invalid Item!"}`;

    const itemDisplay = document.createElement("div");
    itemDisplay.classList.add("full-center", "minecraftTooltip", "itemPageDiv");
    itemDisplay.innerHTML = getHoverTextForItem(item, "Invalid Item!");
    scaleDisplay(itemDisplay);

    const wikiLink = document.createElement("a");
    wikiLink.textContent = "Wiki Link";
    wikiLink.target = "_blank";
    if (item) wikiLink.href =
        "https://wynncraft.wiki.gg/wiki/Special:Search?search=" + item.name;

    render(itemDisplay, wikiLink);
}

function scaleDisplay(display: HTMLDivElement) {
    const height = display.getBoundingClientRect().height;
    display.style.scale = (Math.min(window.innerHeight - 16, height) / height) * 100 + "%";
}

// document.addEventListener("keydown", (e) => {
//     if (e.key === "c") {
//         e.preventDefault();
//         copyImageById("item_display");
//     }
//     if (e.key === "s") {
//         e.preventDefault();
//         saveImageById("item_display");
//     }
//     if (e.key === "l") {
//         e.preventDefault();
//         navigator.clipboard.writeText(window.location.toString());
//     }
// });

// TODO: initial scaling doesn't work and it definitely needs a way to resize
//  figure out how to remove listeners when the page switches
//  alternatively, just make the item div have a minimum top and bottom padding, and somehow force them to always match and always be as big as possible
//   then the item is scrollable if too larger
//  or just do what WynnSolver does and make it scrollable if too large.
// window.addEventListener("resize", function () {
//     const display = document.getElementById("item_display");
//     scaleDisplay(display);
// });
