
function getActiveToggles() {
    const toggles = Array.from(document.querySelector("#effect_toggles").querySelectorAll(".toggle"));
    if (toggles.length < 1) return [];

    console.log(toggles)

    return toggles
        .filter(toggle => toggle.classList.contains("toggleOn"))
        .map(toggle => toggle.dataset.toggle_name);
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

    writeTogglesHTML(newToggles);

    document.querySelector("#effects_holder").style.display = newToggles.length > 0 ? "block" : "none";
}

function writeTogglesHTML(newToggles) {
    const toggleHolder = document.querySelector("#effect_toggles");
    toggleHolder.innerHTML = "";

    for (const newToggle of newToggles) toggleHolder.appendChild(generateToggleHTML(newToggle));
}

// TODO: use newToggle.data to generate embellishments like effect type symbol and % multiplier
function generateToggleHTML(newToggle) {
    const button = document.createElement("button");

    button.classList.add("toggle");
    if (newToggle.selected) button.classList.add("toggleOn");

    button.dataset.toggle_name = newToggle.toggle_name;
    button.innerHTML = newToggle.toggle_name;

    return button;
}