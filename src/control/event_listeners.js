import * as settings from "../control/settings.js";
import * as ability_tree from "../read_write/ability_tree.js";
import * as numbers from "../util/numbers.js"
import {preLoadAssets} from "./preloading.js";
import {getItemByName} from "../read_write/item_search.js";
import {addTooltipListener, hideHoverAbilityTooltip, renderHoverTooltip} from "./tooltip.js";
import {copyBuildLink} from "../read_write/build_linking.js";
import copyTreeAsANSI from "../read_write/ansi_tree.js";
import {balanceSP} from "../permute/skill_points.js";
import {getHoverTextForItem} from "../permute/minecraft_html.js";
import {refreshBuild} from "./script.js";
import {decimalToRoman} from "../util/numbers.js";
// import {copyImageById} from "../read_write/image_exporting.js";
import {hideSettings, toggleBoolean, toggleSettingsHide} from "./settings.js";

// called when the page finishes loading
window.addEventListener("load", function () {
    // TODO: before enabling everything and reloading, verify the version and handle it if it's old
    loadMiku();

    refreshBuild();

    // added after everything has loaded to prevent premature reloads
    addEventListeners();
});

window.addEventListener("load", async function () {
    await preLoadAssets();
});

function loadMiku() {
    document.getElementById("miku").src = settings.loadString("miku");
}

function addEventListeners() {
    addSettingsListeners()
    addAspectListeners();
    addTooltipListener();

    document.querySelectorAll(".input_cluster").forEach((cluster) => {
        addListenersToInputCluster(cluster);
    });
    document.querySelector("#level_input").addEventListener("input", () => {
        refreshBuild();
    });
    const treeElement = document.getElementById("ability_tree");
    // Ability Tree
    treeElement.addEventListener("click", (event) => {
        ability_tree.treeClicked(event);
    });
    document.getElementById("clear_tree").addEventListener("click", () => {
        treeElement.querySelectorAll("td[data-selected='true']").forEach((td) => {
            td.dataset.selected = "false";
        });
        refreshBuild();
    });
    document.getElementById("clear_reds").addEventListener("click", () => {
        treeElement.querySelectorAll("td[data-red='true']").forEach((node) => {
            node.dataset.selected = "false";
        });
        refreshBuild();
    });

    // Effect Toggles

    document.getElementById("effect_toggles").addEventListener("click", (event) => {
        toggleEffectToggle(event);
    });

    document.getElementById(`copy_short`).addEventListener("click", function () {
        copyBuildLink(this, false);
    });
    document.getElementById(`copy_long`).addEventListener("click", function () {
        copyBuildLink(this, true);
    });

    document.querySelectorAll(".copy_button").forEach((button) => {
        button.addEventListener("click", function () {
            button.textContent = "Copied!";
        });
    });

    document.getElementById("gif_input").addEventListener("change", (event) => {
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

    document.getElementById("miku").style.opacity = document.getElementById("opacity_slider").value + "%";
    document.getElementById("opacity_slider").addEventListener("input", (event) => {
        document.getElementById("miku").style.opacity = event.target.value + "%";
    });

    document.getElementById("add_offhand").addEventListener("click", () => {
        addOffhandInput();
    });

    document.querySelectorAll(".sp_input").forEach(el => {
        el.addEventListener("input", () => {
            refreshBuild();
        });
    });

    document.getElementById("balance_dmg").addEventListener("click", () => {
        balanceSP();
        refreshBuild();
    })
}

function addListenersToInputCluster(cluster) {
    const input = cluster.querySelector(".item_input");
    const link = cluster.querySelector(".item_link");
    const inputs = cluster.querySelectorAll(".input");

    link.addEventListener("mouseover", () => {
        renderHoverTooltip(getHoverTextForItem(getItemByName(input.value)));
    });
    link.addEventListener("mouseout", () => {
        hideHoverAbilityTooltip();
    });

    inputs.forEach(input => input.addEventListener("input", () => {
        refreshBuild();
    }));
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
    removeInput.addEventListener("click", () => {
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

    active.addEventListener("click", (event) => {
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

    inactive.addEventListener("click", (event) => {
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

document.getElementById("ansi_tree").addEventListener("click", function () {
    copyTreeAsANSI();
});

// document.getElementById("tree_img").addEventListener("click", function () {
//     copyImageById("ability_tree");
// });

export function resetCopyText() {
    // resets the buttons if they were clicked
    document.querySelectorAll(".copy_button").forEach((button) => {
        button.textContent = button.dataset["default"];
    });
}

export function addSettingsListeners() {
    document.querySelectorAll(".settings_toggle").forEach((t) =>
        t.addEventListener("click", function () {
            toggleSettingsHide();
        })
    );

    document.addEventListener("keyup", (e) => {
        if (e.key === "Escape") {
            hideSettings();
        }
    });

    document.getElementById("selv").addEventListener("click", function () {
        toggleBoolean("selvs");
        refreshBuild();
    });

    document.getElementById("detailed_damage").addEventListener("click", function () {
        toggleBoolean("detailed_damage");
        refreshBuild();
    });
}
