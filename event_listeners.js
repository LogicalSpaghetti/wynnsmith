"use strict";

// called when the page finishes loading
window.addEventListener("load", function () {
    loadBuildFromLink();

    refreshBuild();

    // added after everything has loaded to prevent premature reloads
    addEventListeners();
});

function addEventListeners() {
    addInputEventListeners();
    addTreeEventListener();
    addToggleListeners();
    addEffectListeners();
}

//
function addToggleListeners() {
    document.querySelectorAll(".toggle").forEach((toggle) => {
        toggle.addEventListener("click", function () {
            const display = document.querySelector(".display--" + toggle.dataset.slot);
            const fontHeight = parseInt(window.getComputedStyle(display, null).getPropertyValue("font-size"));
            const itemData = display.textContent;
            const height = (itemData.split("\n").length - 1 + 3) * fontHeight;
            display.style = "height: " + height + "px;";

            toggle.classList.toggle("rotate");
            document.querySelector(".display--" + toggle.dataset.slot).classList.toggle("collapse");
        });
    });
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
