const addedTogglesHolder = document.querySelector("#added_toggles");
const addedSlidersHolder = document.querySelector("#added_sliders");

function setUpOptionals(build) {
    setUpToggles(build);
    setUpSliders(build);
}

function setUpToggles(build) {
    setUpSingleToggle(build, "nodes", "maskOfTheLunatic", "Mask of the Lunatic");
    setUpSingleToggle(build, "nodes", "bloodPool", "Boosted Aura");
    setUpMultiToggle(build, "bleed", "Bleed", ["sanguineStrike", "lashingLance"], ["nodes", "nodes"]);
}

function addToggles(build) {
    document.querySelectorAll(".effect").forEach((toggle) => {
        if (toggle.classList.contains("toggleOn")) {
            build.toggles.push(toggle.dataset.modifier);
        }
    });
    document.querySelectorAll(".slider").forEach((slider) => {
        if (slider.dataset.modifier === undefined) return;
        build.sliders[slider.dataset.modifier] = slider.value;
    });
}

// adds/removes the toggle button depending on if it's prereq is present.
function setUpSingleToggle(build, section, name, displayName) {
    const toggle = addedTogglesHolder.querySelector("." + name);

    if (build[section].includes(name) ^ (toggle === null)) return;

    if (build[section].includes(name)) {
        const button = document.createElement("button");

        button.classList.add("effect");
        button.classList.add(name);
        button.dataset.modifier = name;
        button.textContent = displayName;

        addedTogglesHolder.appendChild(button);
    } else toggle.remove();
}

function setUpMultiToggle(build, name, displayName, nodeNames, sections) {
    const toggle = addedTogglesHolder.querySelector("." + name);

    for (let i = 0; i < nodeNames.length; i++) {
        // checks that the node is present
        if (!build[sections[i]].includes(nodeNames[i])) continue;

        // checks that the toggle doesn't already exist
        if (toggle !== null) return;

        const button = document.createElement("button");

        button.classList.add("effect");
        button.classList.add(name);
        button.dataset.modifier = name;
        button.textContent = displayName;
        addedTogglesHolder.appendChild(button);

        return;
    }

    // only reached if the section has none of the desired nodes.
    if (toggle !== null) toggle.remove();
}

function setUpSliders(build) {
    // TODO
    // setUpSingleSlider(build, "nodes", "puppetMaster", "Puppet Master", "Active Puppets", 3, 1);
    setUpMultiSlider(
        build,
        "puppetMaster",
        "Puppet Master",
        "Active Puppets",
        ["puppetMaster", "morePuppets", "morePuppets2", "Aspect of the Beckoned Legion"],
        ["nodes", "nodes", "nodes", "aspects"],
        [3, 1, 2, 0],
        1
    );
}

function setUpSingleSlider(build, section, name, displayName, divText, max, min) {
    const slider = addedSlidersHolder.querySelector("." + name);

    if (build[section].includes(name) ^ (slider === null)) return;

    if (build[section].includes(name)) {
        // <input type="range" class="slider">
        // <button class="effect radiance" data-modifier="radiance">Radiance</button>
        const input = document.createElement("input");

        input.type = "range";
        input.min = min === undefined ? 0 : min;
        input.max = max;
        input.classList.add("slider");
        input.classList.add(name);
        input.dataset.modifier = name;
        input.textContent = displayName;

        const div = document.createElement("div");
        div.classList.add("slider_div");
        div.classList.add(name + "_div");
        div.textContent = divText + ": " + input.value;

        input.addEventListener("input", (event) => {
            div.textContent = divText + ": " + input.value;
        });

        addedSlidersHolder.appendChild(input);
        addedSlidersHolder.appendChild(div);
    } else {
        slider.remove();
        addedSlidersHolder.querySelector("." + name + "_div").remove();
    }
}

function setUpMultiSlider(build, id, displayName, divText, abilityNames, abilitySources, maxes, min) {
    var slider = addedSlidersHolder.querySelector("." + id);

    var max = 0;
    for (let i = 0; i < abilityNames.length; i++) {
        const abilityName = abilityNames[i];
        const abilitySource = abilitySources[i];

        if (abilitySource === "aspects") {
            if (build.aspects[abilityName] === undefined) continue;
            max += aspects[build.wynnClass][abilityName][build.aspects[abilityName] - 1].slider;
        } else {
            if (!build[abilitySource].includes(abilityName)) continue;
            max += maxes[i];
        }
    }

    // if 0, remove slider if it exists, return
    if (max === 0) {
        if (slider !== null) {
            slider.remove();
            addedSlidersHolder.querySelector("." + id + "_div").remove();
        }
        return;
    }
    // if >0, add slider if it doesn't exist, set slider value
    if (slider === null) {
        const input = document.createElement("input");

        input.type = "range";
        input.min = min === undefined ? 0 : min;
        input.max = max;
        input.classList.add("slider");
        input.classList.add(id);
        input.dataset.modifier = id;
        input.dataset.divText = divText;
        input.textContent = displayName;

        const div = document.createElement("div");
        div.classList.add("slider_div");
        div.classList.add(id + "_div");
        div.textContent = divText + ": " + input.value;

        input.addEventListener("input", (event) => {
            setSliderDiv(input);
            refreshBuild();
        });

        slider = input;
        addedSlidersHolder.appendChild(input);
        addedSlidersHolder.appendChild(div);
    } else if (slider.max != max) {
        slider.max = max;
        slider.value = max;
    }

    setSliderDiv(slider);
}

function setSliderDiv(slider) {
    slider.parentElement.querySelector("." + slider.dataset.modifier + "_div").textContent =
        slider.dataset.divText + ": " + slider.value;
}
