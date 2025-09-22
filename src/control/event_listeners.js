import * as settings from "../control/settings.js";
import * as ability_tree from "../read_write/ability_tree.js";
import * as numbers from "../util/numbers.js";
import {preLoadAssets} from "./preloading.js";
import {getItemByName} from "../read_write/item_search.js";
import {addTooltipListener, hideHoverAbilityTooltip, renderHoverTooltip} from "./tooltip.js";
import {copyBuildLink} from "../read_write/build.js";
import copyTreeAsANSI from "../read_write/ansi_tree.js";
import {balanceSP} from "../permute/skill_points.js";
import {getHoverTextForItem} from "../permute/minecraft_html.js";
import {refreshBuild} from "./script.js";
import {decimalToRoman} from "../util/numbers.js";
// import {copyImageById} from "../read_write/image_exporting.js";
import {toggleBoolean} from "./settings.js";

addElem(window, "load", () => {
    // TODO: before enabling everything and reloading, verify the version and handle it if it's old
    loadMiku();
    refreshBuild();
    // last to prevent premature reloads
    addEventListeners();
});

addElem(window, "load", async function () {
    await preLoadAssets();
});

function loadMiku() {
    document.getElementById("miku").src = settings.loadString("miku");
}

function addEventListeners() {
    addTooltipListener();

    addSettingsListeners();
    addAspectListeners();

    // Input:
    document.querySelectorAll(".input_cluster").forEach((cluster) => addListenersToInputCluster(cluster));

    add("add_offhand", "click", addOffhandInput);

    add("level_input", "input", refreshBuild);
    const treeElement = document.getElementById("ability_tree");

    add("effect_toggles", "click", toggleEffectToggle);

    addAll("sp_input", "input", refreshBuild);

    add("balance_dmg", "click", () => {
        balanceSP();
        refreshBuild();
    });

    // Tree:
    addElem(treeElement, "click", ability_tree.treeClicked);

    add("clear_tree", "click", () => {
        treeElement.querySelectorAll("td[data-selected='true']")
            .forEach((node) => node.dataset.selected = "false");
        refreshBuild();
    });

    add("clear_reds", "click", () => {
        treeElement.querySelectorAll("td[data-red='true']")
            .forEach((node) => node.dataset.selected = "false");
        refreshBuild();
    });

    add("ansi_tree", "click", copyTreeAsANSI);

    // Copy:
    add("copy_short", "click", (e) => copyBuildLink(e.target, false));
    add("copy_long", "click", (e) => copyBuildLink(e.target, true));

    addAll("copy_button", "click", (event) => event.target.textContent = "Copied!");
}

function addListenersToInputCluster(cluster) {
    const input = cluster.querySelector(".item_input");
    const link = cluster.querySelector(".item_link");
    const inputs = cluster.querySelectorAll(".input");

    addElem(link, "mouseover", () => renderHoverTooltip(getHoverTextForItem(getItemByName(input.value))));
    addElem(link, "mouseout", () => hideHoverAbilityTooltip());
    addAllElem(inputs, "input", refreshBuild);
}

function addOffhandInput() {
    const offhandInputs = document.getElementById("item_inputs").querySelector(".offhands");

    const cluster = offhandInputs.appendChild(document.createElement("div"));
    cluster.classList.add("input_cluster");
    cluster.dataset.slot = "weapon";
    cluster.dataset.group = "weapon";

    const a = cluster.appendChild(document.createElement("a"));
    a.classList.add("item_link");
    a.target = "_blank";


    const image = a.appendChild(document.createElement("img"));
    image.classList.add("slot_img");
    image.src = "img/item/archer.png";
    image.alt = "We";

    const input = cluster.appendChild(document.createElement("input"));
    input.classList.add("input", "item_input", "slot_input");
    input.placeholder = "Offhand";

    const powderInput = cluster.appendChild(document.createElement("input"));
    powderInput.classList.add("input", "powder_input");
    powderInput.placeholder = "0 Slots";

    const removeInput = cluster.appendChild(document.createElement("button"));
    removeInput.textContent = "x";
    addElem(removeInput, "click", () => {
        offhandInputs.removeChild(cluster);
        refreshBuild();
    });

    addListenersToInputCluster(cluster);
}

function toggleEffectToggle(event) {
    let toggle = event.target.closest("button");
    if (!toggle || !toggle.classList.contains("toggle")) return;
    toggle.classList.toggle("toggleOn");

    if (toggle.dataset.blockers !== undefined) {
        const blockedNodes = toggle.dataset.blockers.split(" ");
        document.querySelectorAll(".toggle").forEach((effectElement) => {
            if (blockedNodes.includes(effectElement.dataset.modifier) && effectElement.classList.contains("toggleOn"))
                effectElement.classList.toggle("toggleOn");
        });
    }

    refreshBuild();
}

function addAspectListeners() {
    const active = document.getElementById("active_aspects");
    const inactive = document.getElementById("inactive_aspects");

    addElem(active, "click", (event) => {
        const clickTarget = event.target;

        if (clickTarget.classList.contains("aspect_up")) {
            const numeral = clickTarget.parentElement.childNodes[2];
            numeral.dataset.tier = String(parseInt(numeral.dataset.tier) + 1);
            if (numeral.dataset.tier > (clickTarget.parentElement.classList.contains("legendary") ? 4 : 3)) {
                numeral.dataset.tier -= 1;
            } else {
                numeral.classList.remove("Tier_" + decimalToRoman(numeral.dataset.tier - 1));
                numeral.classList.add("Tier_" + decimalToRoman(numeral.dataset.tier));
                refreshBuild();
            }
            numeral.textContent = numbers.decimalToRoman(numeral.dataset.tier);
            return;
        }
        if (clickTarget.classList.contains("aspect_down")) {
            const numeral = clickTarget.parentElement.childNodes[2];
            if (numeral.dataset.tier > 1) {
                numeral.classList.remove("Tier_" + numbers.decimalToRoman(numeral.dataset.tier));
                numeral.dataset.tier -= 1;
                numeral.classList.add("Tier_" + numbers.decimalToRoman(numeral.dataset.tier));
                refreshBuild();
            }
            numeral.textContent = numbers.decimalToRoman(numeral.dataset.tier);
            return;
        }

        if (!clickTarget.classList.contains("aspect_image")) return;
        const aspect = clickTarget.parentElement;

        const newNode = aspect.cloneNode(true);

        newNode.childNodes[0].style.display = "none";
        newNode.childNodes[1].style.display = "none";
        newNode.childNodes[2].style.display = "none";
        inactive.appendChild(newNode);

        if (aspect.classList.contains("mythic")) {
            inactive.childNodes.forEach((node) => {
                if (node.classList.contains("mythic")) {
                    node.style.display = "inline-block";
                }
            });
        }

        aspect.remove();

        if (active.childElementCount < 5) inactive.style.display = "inline-block";

        refreshBuild();
    });

    addElem(inactive, "click", (event) => {
        const clickTarget = event.target;
        if (!clickTarget.classList.contains("aspect_image") && !clickTarget.classList.contains("aspect_tier")) return;
        const aspect = clickTarget.parentElement;

        const newNode = aspect.cloneNode(true);
        newNode.childNodes[0].style.display = "inline-block";
        newNode.childNodes[1].style.display = "inline-block";
        newNode.childNodes[2].style.display = "inline-block";
        active.appendChild(newNode);

        if (aspect.classList.contains("mythic")) {
            inactive.childNodes.forEach((node) => {
                if (node.classList.contains("mythic")) {
                    node.style.display = "none";
                }
            });
        }

        aspect.remove();

        if (active.childElementCount >= 5) inactive.style.display = "none";

        refreshBuild();
    });
}

export function resetCopyText() {
    // resets the buttons if they were clicked
    document.querySelectorAll(".copy_button").forEach(button =>
        button.textContent = button.dataset["default"]);
}

function addSettingsListeners() {
    add("selv", "click", () => {
        toggleBoolean("selvs");
        refreshBuild();
    });
    add("detailed_damage", "click", () => {
        toggleBoolean("detailed_damage");
        refreshBuild();
    });

    add("gif_input", "change", (event) => {
        const file = event.target.files[0];
        // do something with the file
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const src = reader.result;
            // display the image on the page
            document.getElementById("miku").src = src;
            settings.saveString("miku", src);
        };
    });

    add("opacity_slider", "input", (event) => {
        document.getElementById("miku").style.opacity = event.target.value + "%";
    });
    dispatch("opacity_slider", "input");
}

function add(id, type, lambda) {
    document.getElementById(id).addEventListener(type, lambda);
}

function addElem(element, type, lambda) {
    element.addEventListener(type, lambda);
}

function addAll(className, type, lambda) {
    document.querySelectorAll(`.${className}`)
        .forEach(el => el.addEventListener(type, lambda));
}

function addAllElem(elements, type, lambda) {
    elements.forEach(el => el.addEventListener(type, lambda));
}

function dispatch(id, eventName) {
    document.getElementById(id).dispatchEvent(new Event(eventName));
}
