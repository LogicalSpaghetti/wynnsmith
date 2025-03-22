function refreshItemData(build) {

    addBasePlayerStats(build);
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const item = getItemByInput(input);
        if (item === undefined) continue;
        addMajorIds(build, item);
        addAllIdsToBuildSection(build, item, "base");
        addAllIdsToBuildSection(build, item, "identifications");
        if (item.attackSpeed === undefined) continue;
        addAttackSpeed(build, item);
    }
}

function addBasePlayerStats(build) {
    build.base["baseHealth"] = getAsMinMax(535);
}

function addAttackSpeed(build, item) {
    build.attackSpeed = item.attackSpeed;
    console.log(Object.is(build.attackSpeed, item.attackSpeed));
}

function addAllIdsToBuildSection(build, source, section) {

    const adds = source[section];
    const idNames = Object.keys(adds);
    for (let i = 0; i < idNames.length; i++) {
        const id = getAsMinMax(adds[idNames[i]]);
        addIdToBuildSection(build, id, idNames[i], section);
    }

}

function addIdToBuildSection(build, id, idName, section) {
    if (build[section][idName] === undefined) {
        // this took so long to debug
        build[section][idName] = {
            "min": 0,
            "max": 0
        };
    }
    addMinAndMaxTo(build[section][idName], id);
}

function addMajorIds(build, item) {
    if (item.majorIds === undefined) return;
    build.majorIds.push(Object.keys(item.majorIds)[0]);
}

function formatCombined(groupedStats, simple) {
    var combinedString = "";
    const keys = Object.keys(groupedStats);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        combinedString += key + ": " + JSON.stringify(simple ? groupedStats[key].max : groupedStats[key].min + ' to ' + groupedStats[key].max) + "\n";
    }
    return combinedString;
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
        'base': {},
        'identifications': {}
    }
    addAllIdsToBuildSection(miniBuild, item, 'base')
    addAllIdsToBuildSection(miniBuild, item, 'identifications')

    display.textContent = formatAttackSpeed(item) + formatCombined(miniBuild.base, false) + formatCombined(miniBuild.identifications, false);
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
    document.querySelectorAll(".effect").forEach(toggle => {
        if (toggle.classList.contains('toggleOn')) {
            build.toggles.push(toggle.dataset.modifier);
        }
    })
}