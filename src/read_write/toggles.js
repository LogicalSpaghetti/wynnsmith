// read all toggles from the html, and any that are selected, add.
function readToggles(build) {
    const toggles = document.querySelector("#effect_toggles").querySelectorAll(".toggle");

    for (let toggleElement of toggles)
        if (toggleElement.classList.contains("toggleOn"))
            build.toggles.push(toggleElement.dataset.toggle_name);
}

function setToggles(build) {
    const effects = build.effects.map(effectId => classEffects[build.wynnClass].effects[effectId]);

    const newToggles = [];
    for (let effect of effects) {
        if (effect.toggle_name === "") continue;

        newToggles.push({
            toggle_name: effect.toggle_name,
            data: effect.data,
            selected: build.toggles.includes(effect.toggle_name)
        });
    }

    writeNewTogglesHTML(newToggles);
}

function writeNewTogglesHTML(newToggles) {
    const toggleHolder = document.querySelector("#effect_toggles");
    toggleHolder.innerHTML = "";

    for (const newToggle of newToggles) toggleHolder.appendChild(generateNewToggleHTML(newToggle));
}

// TODO: use newToggle.data to generate embellishments like effect type symbol and % multiplier
function generateNewToggleHTML(newToggle) {
    const button = document.createElement("button");

    button.classList.add("toggle");
    if (newToggle.selected) button.classList.add("toggleOn");

    button.dataset.toggle_name = newToggle.toggle_name;
    button.innerHTML = newToggle.toggle_name;

    return button;
}