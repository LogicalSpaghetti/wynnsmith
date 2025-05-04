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
    addTomeListener();
    addSPListener();
    addGifListener();
}

//
function addToggleListeners() {
    document.querySelectorAll(".slot_icon").forEach((toggle) => {
        toggle.addEventListener("mouseover", function () {
            document.getElementById("display-" + toggle.dataset.slot).classList.remove("collapse");
            toggleToggle(toggle);
        });
        toggle.addEventListener("mouseout", function () {
            document.getElementById("display-" + toggle.dataset.slot).classList.add("collapse");
            toggleToggle(toggle);
        });
    });
}

function toggleToggle(toggle) {
    const display = document.getElementById("display-" + toggle.dataset.slot);
    const fontHeight = parseInt(window.getComputedStyle(display, null).getPropertyValue("font-size"));
    const itemData = display.textContent;
    const height = (itemData.split("\n").length - 1 + 3) * fontHeight;
    display.style = "height: " + height + "px;";
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
    document.getElementById(`copy_short`).addEventListener("click", function () {
        copyBuildLink(this, false);
    });
    document.getElementById(`copy_long`).addEventListener("click", function () {
        copyBuildLink(this, true);
    });
}

function addTreeEventListener() {
    const abilityTree = document.getElementById("abilityTree");
    abilityTree.addEventListener("click", (event) => {
        treeClicked(event);
    });
}

function addEffectListeners() {
    const toggleBox = document.getElementById("effect_toggles");
    toggleBox.addEventListener("click", (event) => {
        const effect = event.target;
        if (!effect.classList.contains("effect")) return;
        effect.classList.toggle("toggleOn");
        refreshBuild();
    });
    const addedToggleBox = document.getElementById("added_toggles");
    addedToggleBox.addEventListener("click", (event) => {
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
    const active = document.getElementById("active_aspects");
    const inactive = document.getElementById("inactive_aspects");

    active.addEventListener("click", (event) => {
        const clickTarget = event.target;

        if (clickTarget.classList.contains("aspect_up")) {
            const neumeral = clickTarget.parentElement.childNodes[2];
            neumeral.dataset.tier = parseInt(neumeral.dataset.tier) + 1;
            if (neumeral.dataset.tier > (clickTarget.parentElement.classList.contains("legendary") ? 4 : 3)) {
                neumeral.dataset.tier -= 1;
            } else {
                neumeral.classList.remove("Tier_" + romanize(neumeral.dataset.tier - 1));
                neumeral.classList.add("Tier_" + romanize(neumeral.dataset.tier));
                refreshBuild();
            }
            neumeral.textContent = romanize(neumeral.dataset.tier);
            return;
        }
        if (clickTarget.classList.contains("aspect_down")) {
            const neumeral = clickTarget.parentElement.childNodes[2];
            if (neumeral.dataset.tier > 1) {
                neumeral.classList.remove("Tier_" + romanize(neumeral.dataset.tier));
                neumeral.dataset.tier = parseInt(neumeral.dataset.tier) - 1;
                neumeral.classList.add("Tier_" + romanize(neumeral.dataset.tier));
                refreshBuild();
            }
            neumeral.textContent = romanize(neumeral.dataset.tier);
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

        // active.appendChild("<div class=\"padding\"></div>");
        aspect.remove();

        if (active.childElementCount < 5) inactive.parentElement.style.display = "inline-block";

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

        if (active.childElementCount >= 5) inactive.parentElement.style.display = "none";

        refreshBuild();
    });
}

function addTomeListener() {
    for (let i = 0; i < tomeInputs.length; i++) {
        tomeInputs[i].addEventListener("input", function () {
            refreshBuild();
        });
    }
}

function addSPListener() {
    for (let i = 0; i < spInputs.length; i++) {
        spInputs[i].addEventListener("input", function () {
            if (spInputs[i].value != "") refreshBuild();
        });
    }
}

document.getElementById("ansi_tree").addEventListener("click", function () {
    copyTreeAsText();
});

function addGifListener() {
    document.getElementById("gif_input").addEventListener("change", (event) => {
        const file = event.target.files[0];
        // do something with the file
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const imageUrl = event.target.result;
            // display the image on the page
            document.getElementById("miku").src = imageUrl;
        };
    });

    document.getElementById("miku").style.opacity = document.getElementById("opacity_slider").value + "%";
    document.getElementById("opacity_slider").addEventListener("input", (event) => {
        document.getElementById("miku").style.opacity = event.target.value + "%";
    });
}
