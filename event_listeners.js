"use strict";

// called when the page finishes loading
window.addEventListener("load", function () {
    loadBuildFromLink();
    loadFullBuildFromLink();

    refreshBuild();

    // added after everything has loaded to prevent premature reloads
    addEventListeners();
});

function addEventListeners() {
    addInputEventListeners();
    addTreeEventListener();
    addToggleListeners();
    addEffectListeners();
    addCopyLinkListeners();
    addAspectListeners();
}

//
function addToggleListeners() {
    document.querySelectorAll(".toggle").forEach((toggle) => {
        toggle.addEventListener("click", function () {
            toggleToggle(toggle);
        });
    });
    document.querySelector(".collapse_all").addEventListener("click", function () {
        document.querySelectorAll(".rotate").forEach((rotate) => {
            toggleToggle(rotate);
        });
    });
}

function toggleToggle(toggle) {
    const display = document.querySelector(".display--" + toggle.dataset.slot);
    const fontHeight = parseInt(window.getComputedStyle(display, null).getPropertyValue("font-size"));
    const itemData = display.textContent;
    const height = (itemData.split("\n").length - 1 + 3) * fontHeight;
    display.style = "height: " + height + "px;";

    toggle.classList.toggle("rotate");
    document.querySelector(".display--" + toggle.dataset.slot).classList.toggle("collapse");

    if (document.querySelectorAll(".collapse").length < 8) {
        document.querySelector(".collapse_all").style.display = "block";
    } else {
        document.querySelector(".collapse_all").style.display = "none";
    }
}

// Item Inputs
function addInputEventListeners() {
    inputs.forEach((input) => {
        refreshOwnData(input);
        input.addEventListener("input", function () {
            refreshBuild();
            refreshOwnData(input);
        });
    });
}

// Copy Link Buttons
function addCopyLinkListeners() {
    document.querySelector(`.copy_link--short`).addEventListener("click", function () {
        copyBuildLink(this, false);
    });
    document.querySelector(`.copy_link--long`).addEventListener("click", function () {
        copyBuildLink(this, true);
    });
}

function addTreeEventListener() {
    const abilityTree = document.querySelector(".abilityTree");
    abilityTree.addEventListener("click", (event) => {
        treeClicked(event);
    });
}

function addEffectListeners() {
    const toggleBox = document.querySelector(".effect_toggles");
    toggleBox.addEventListener("click", (event) => {
        const effect = event.target;
        if (!effect.classList.contains("effect")) return;
        effect.classList.toggle("toggleOn");
        refreshBuild();
    });
}

document.querySelectorAll(".powder").forEach((input) => {
    input.addEventListener("input", function () {
        refreshBuild();
    });
});

function addAspectListeners() {
    const active = document.querySelector("#active_aspects");
    const inactive = document.querySelector("#inactive_aspects");

    active.addEventListener("click", (event) => {
        const aspectImg = event.target;
        if (!aspectImg.classList.contains("aspect_image")) return;
        const aspect = aspectImg.parentElement;

        inactive.appendChild(aspect.cloneNode(true));

        if (aspect.classList.contains("mythic")) {
            inactive.childNodes.forEach((node) => {
                if (node.classList.contains("mythic")) {
                    node.style.display = "inline-block";
                }
            });
        }

        // active.appendChild("<div class=\"padding\"></div>");
        aspect.remove();

        if (active.childElementCount < 15) inactive.style.display = "inline-block";

        refreshBuild();
    });

    inactive.addEventListener("click", (event) => {
        const clickTarget = event.target;
        if (!clickTarget.classList.contains("aspect_image") && !clickTarget.classList.contains("aspect_tier")) return;
        const aspect = clickTarget.parentElement;

        active.appendChild(aspect.cloneNode(true));
        if (aspect.classList.contains("mythic")) {
            inactive.childNodes.forEach((node) => {
                if (node.classList.contains("mythic")) {
                    node.style.display = "none";
                }
            });
        }

        // active.querySelector(".padding").remove();
        aspect.remove();

        if (active.childElementCount >= 15) inactive.style.display = "none";

        refreshBuild();
    });
}
