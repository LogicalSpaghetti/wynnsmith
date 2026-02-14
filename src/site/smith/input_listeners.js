import * as ability_tree from "../logic/ability/ability.js";
import * as numbers from "../common/numbers.ts";
import {itemDatabase} from "../logic/item/item_search.ts";
import {addTooltipListener, hideHoverTooltip, renderHoverTooltip} from "../common/tooltip.js";
import copyTreeAsANSI from "../logic/ability/ansi_tree.js";
import {balanceSP} from "../logic/skill_point/skill_points.js";
import {getHoverTextForItem} from "../common/minecraft_html.js";
import {decimalToRoman} from "../common/numbers.ts";
import {add, addAll, addAllElem, addElem, dispatch} from "../common/event_listener.js";
import updateBuild from "./update_build.js";
import * as settings from "./settings.js";
import {loadBoolean, toggleBoolean} from "./settings.js";

export function addInputListeners() {
    console.log("adding input Listeners");

    addTooltipListener();

    // Input:
    document.querySelectorAll(".input_cluster").forEach((cluster) => addListenersToInputCluster(cluster));

    add("level_input", "input", updateBuild);
    const treeElement = document.getElementById("ability_tree");

    add("effect_toggles", "click", toggleEffectToggle);

    addAll("sp_input", "input", updateBuild);

    add("balance_dmg", "click", () => {
        balanceSP();
        updateBuild();
    });

    // Tree:
    addElem(treeElement, "click", ability_tree.treeClicked);

    add("clear_tree", "click", () => {
        treeElement.querySelectorAll("td[data-selected='true']")
            .forEach((node) => node.dataset.selected = "false");
        updateBuild();
    });

    add("clear_reds", "click", () => {
        treeElement.querySelectorAll("td[data-red='true']")
            .forEach((node) => node.dataset.selected = "false");
        updateBuild();
    });

    add("ansi_tree", "click", copyTreeAsANSI);

    // Copy:
    // TODO

    addAll("copy_button", "click", (e) => e.target.textContent = "Copied!");

    addAspectListeners();
}

function addListenersToInputCluster(cluster) {
    const input = cluster.querySelector(".item_input");
    const link = cluster.querySelector(".item_link");
    const inputs = cluster.querySelectorAll(".input");

    addElem(link, "mouseover", () => renderHoverTooltip(getHoverTextForItem(itemDatabase.getItemByName(input.value))));
    addElem(link, "mouseout", () => hideHoverTooltip());
    addAllElem(inputs, "input", updateBuild);
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
        updateBuild();
    });

    addListenersToInputCluster(cluster);
}

function toggleEffectToggle(e) {
    let toggle = e.target.closest("button");
    if (!toggle || !toggle.classList.contains("toggle")) return;
    toggle.classList.toggle("toggleOn");

    if (toggle.dataset.blockers !== undefined) {
        const blockedNodes = toggle.dataset.blockers.split(" ");
        document.querySelectorAll(".toggle").forEach((effectElement) => {
            if (blockedNodes.includes(effectElement.dataset.modifier) && effectElement.classList.contains("toggleOn"))
                effectElement.classList.toggle("toggleOn");
        });
    }

    updateBuild();
}

// TODO: move most to ability.js
function addAspectListeners() {
    const active = document.getElementById("active_aspects");
    const inactive = document.getElementById("inactive_aspects");

    addElem(active, "click", (e) => {
        const clickTarget = e.target;

        if (clickTarget.classList.contains("aspect_up")) {
            const numeral = clickTarget.parentElement.childNodes[2];
            numeral.dataset.tier = String(parseInt(numeral.dataset.tier) + 1);
            if (numeral.dataset.tier > (clickTarget.parentElement.classList.contains("legendary") ? 4 : 3)) {
                numeral.dataset.tier -= 1;
            } else {
                numeral.classList.remove("Tier_" + decimalToRoman(numeral.dataset.tier - 1));
                numeral.classList.add("Tier_" + decimalToRoman(numeral.dataset.tier));
                updateBuild();
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
                updateBuild();
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

        updateBuild();
    });

    addElem(inactive, "click", (e) => {
        const clickTarget = e.target;
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

        updateBuild();
    });
}

export function addSettingsListeners() {
    console.log("adding settings listeners");

    initCheckbox("selvs");
    initCheckbox("detailed_damage");

    const miku = document.getElementById("miku");
    miku.src = settings.loadString("miku");
    add("gif_input", "change", (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const src = reader.result;
            miku.src = src;
            settings.saveString("miku", src);
        };
    });

    add("opacity_slider", "input", (e) =>
        document.getElementById("miku").style.opacity = e.target.value + "%");
    dispatch("opacity_slider", "input");
}

function initCheckbox(elementId, boolId = elementId, extraCode = () => updateBuild()) {
    const checkbox = document.getElementById(elementId);
    checkbox.addEventListener("click", () => {
        toggleBoolean(boolId);
        extraCode();
    });
    checkbox.checked = loadBoolean(boolId);
}
