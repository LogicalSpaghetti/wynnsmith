function refreshItemData(build) {
    addBasePlayerStats(build);
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const item = getItemByInput(input);
        setPowderSlots(input, item);
        if (item === undefined) continue;
        addPowders(build, input);
        addMajorIds(build, item);
        addBasesToBuild(build, item);
        addIds(build, item);
        if (item.attackSpeed === undefined) continue;
        addAttackSpeed(build, item);
    }
}

function addBasePlayerStats(build) {
    build.base["baseHealth"] = 535;
}

function addAttackSpeed(build, item) {
    build.attackSpeed = item.attackSpeed;
}

function addIds(build, source) {
    const adds = source.identifications;
    const idNames = Object.keys(adds);
    for (let i = 0; i < idNames.length; i++) {
        const id = getAsMax(adds[idNames[i]]);
        addId(build, id, idNames[i]);
    }
}

function addBasesToBuild(build, item) {
    const base = item.base;
    const idNames = Object.keys(base);
    for (let i = 0; i < idNames.length; i++) {
        const id = base[idNames[i]];
        addBase(build, id, idNames[i]);
    }
}

function addBase(build, id, idName) {
    if (Number.isInteger(id)) {
        build.base[idName] = build.base[idName] === undefined ? id : build.base[idName] + id;
    } else {
        if (build.base[idName] === undefined) {
            build.base[idName] = { min: 0, max: 0 };
        }
        addMinAndMaxTo(build.base[idName], id);
    }
}

function addId(build, id, idName) {
    if (build.identifications[idName] === undefined) {
        build.identifications[idName] = 0;
    }
    build.identifications[idName] += id;
}

function addMajorIds(build, item) {
    if (item.majorIds === undefined) return;
    build.majorIds.push(Object.keys(item.majorIds)[0]);
}

function getItemByInput(input) {
    const itemCategory = itemGroups[input.dataset["slot"].replace("0", "").replace("1", "")];

    if (itemCategory === undefined) return;
    return itemCategory[input.value];
}

function refreshOwnData(input) {
    const display = document.querySelector(".display--" + input.dataset.slot);

    const item = getItemByInput(input);
    if (item === undefined) {
        // TODO: disable the dropdown, hide the icon for it
        display.textContent = "Invalid item!";
        return;
    }

    const miniBuild = {
        base: {},
        identifications: {},
    };
    addBasesToBuild(miniBuild, item);
    addUnmaxedIds(miniBuild, item);

    display.innerHTML = "Item Statistics: \n" +
        formatAttackSpeed(item) + formatCombined(miniBuild.base) + formatCombined(miniBuild.identifications);
}

function formatCombined(ids) {
    var combinedString = "";
    const keys = Object.keys(ids);
    for (let i = 0; i < keys.length; i++) {
        const id = ids[keys[i]];
        if (Number.isInteger(id)) {
            combinedString += id >= 0 ? "<span class=\"positive\">+" : "<span class=\"negative\">";
            combinedString += id + "</span>";
        } else {
            combinedString += id.min >= 0 ? "<span class=\"positive\">+" : "<span class=\"negative\">";
            combinedString += id.min + "</span> to ";
            combinedString += id.min >= 0 ? "<span class=\"positive\">+" : "<span class=\"negative\">";
            combinedString += id.max + "</span>"
        }
        combinedString += " " + keys[i] + "\n";
    }
    return combinedString;
}

function addUnmaxedIds(build, item) {
    const ids = item.identifications;
    const idNames = Object.keys(ids);
    for (let i = 0; i < idNames.length; i++) {
        const id = ids[idNames[i]];
        addUnmaxedId(build, id, idNames[i]);
    }
}

function addUnmaxedId(build, id, idName) {
    if (Number.isInteger(id)) {
        build.base[idName] = build.identifications[idName] === undefined ? id : build.identifications[idName] + id;
    } else {
        if (build.identifications[idName] === undefined) {
            build.identifications[idName] = { min: 0, max: 0 };
        }
        addMinAndMaxTo(build.identifications[idName], id);
    }
}

String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
};

function formatAttackSpeed(item) {
    if (item.type !== "weapon") return "";

    var attackSpeed = item.attackSpeed;
    const uSPos = attackSpeed.indexOf("_");
    attackSpeed = attackSpeed.replaceAt(0, attackSpeed[0].toUpperCase());
    attackSpeed = attackSpeed.replaceAt(uSPos + 1, attackSpeed[uSPos + 1].toUpperCase());
    attackSpeed = attackSpeed.replaceAll("_", " ");

    return "Attack Speed: " + attackSpeed + "\n";
}

function addToggles(build) {
    document.querySelectorAll(".effect").forEach((toggle) => {
        if (toggle.classList.contains("toggleOn")) {
            build.toggles.push(toggle.dataset.modifier);
        }
    });
}

// Powders:

function setPowderSlots(input, item) {
    const powderInput = document.querySelector("[slot='" + input.dataset.slot + "']");
    if (powderInput === null || item === undefined) return;
    if (item.powderSlots === undefined) {
        powderInput.placeholder = "No Slots";
        powderInput.maxLength = 0;
        powderInput.value = "";
        return;
    }
    powderInput.placeholder = item.powderSlots + " slots";
    powderInput.maxLength = item.powderSlots * 2;
    if (powderInput.value.length > powderInput.maxLength) {
        powderInput.value = powderInput.value.substring(0, powderInput.maxLength);
    }
}

function addPowders(build, input) {
    const powderInput = document.querySelector("[slot='" + input.dataset.slot + "']");
    if (powderInput === null) return;
    const powdersString =
        powderInput.value.length % 2 === 0
            ? powderInput.value
            : powderInput.value.substring(0, powderInput.value.length - 1);
    const destination = input.dataset.slot === "weapon" ? build.powders.weapon : build.powders.armor;
    for (let i = 0; i < powdersString.length / 2; i++) {
        const powderName = powdersString.substring(i * 2, i * 2 + 2);
        const powder = powders[powderName];
        if (powder === undefined) continue;
        destination.push(powderName);
    }
}
