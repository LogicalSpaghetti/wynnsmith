`use strict`;

// called when the page finishes loading
window.addEventListener("load", function () {
    loadMiku();

    refreshBuild();

    // added after everything has loaded to prevent premature reloads
    addEventListeners();
});

window.addEventListener("load", async function () {
    await preLoadAssets();
});

function loadMiku() {
    document.getElementById("miku").src = loadString("miku");
}

function addEventListeners() {
    // gets all inputs, including
    document.querySelectorAll(".input").forEach((input) => {
        input.addEventListener("input", function () {
            refreshBuild();
        });
    });

    addAspectListeners();
    addTooltipListener();

    document.querySelectorAll(".input_cluster").forEach((cluster) => {
        const input = cluster.querySelector(".item_input");
        const link = cluster.querySelector(".item_link");

        link.addEventListener("mouseover", () => {
            renderHoverTooltip(getHoverHTMLForItem(getItem(input.value)));
        });
        link.addEventListener("mouseout", () => {
            hideHoverAbilityTooltip();
        });
    });

    const treeElement = document.getElementById("ability_tree")
    // Ability Tree
    treeElement.addEventListener("click", (event) => {
        treeClicked(event);
    });
    document.getElementById("clear_tree").addEventListener("click", () => {
        treeElement.querySelectorAll("td[data-selected='true']").forEach((td) => {
            td.dataset.selected = "false";
        });
        refreshBuild();
    });
    document.getElementById("clear_reds").addEventListener("click", () => {
        treeElement.querySelectorAll("td[data-red='true']").forEach((td) => {
            td.removeAttribute("data-red");
            td.dataset.selected = "false";
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
        })
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
            saveString("miku", src);
        };
    });

    document.getElementById("miku").style.opacity = document.getElementById("opacity_slider").value + "%";
    document.getElementById("opacity_slider").addEventListener("input", (event) => {
        document.getElementById("miku").style.opacity = event.target.value + "%";
    });
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
    console.log(toggle);

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
            numeral.textContent = decimalToRoman(numeral.dataset.tier);
            return;
        }
        if (clickTarget.classList.contains("aspect_down")) {
            const numeral = clickTarget.parentElement.childNodes[2];
            if (numeral.dataset.tier > 1) {
                numeral.classList.remove("Tier_" + decimalToRoman(numeral.dataset.tier));
                numeral.dataset.tier -= 1;
                numeral.classList.add("Tier_" + decimalToRoman(numeral.dataset.tier));
                refreshBuild();
            }
            numeral.textContent = decimalToRoman(numeral.dataset.tier);
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
    copyTreeAsANSIText();
});

document.getElementById("tree_img").addEventListener("click", function () {
    copyImageById("ability_tree")
});

function resetCopyText() {
    // resets the buttons if they were clicked
    document.querySelectorAll(".copy_button").forEach((button) => {
        button.textContent = button.dataset["default"];
    });
}
