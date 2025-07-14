`use strict`;

let previousClass = "";
let currentClass = "";

function refreshClass(build) {
    previousClass = currentClass;
    const item = getItemByInput(inputs[8]);
    if (item !== undefined && item.requirements.classRequirement !== undefined) {
        currentClass = item.requirements.classRequirement;
    }
    build.wynnClass = currentClass;
}

function refreshItemData(build) {
    addBasePlayerStats(build);
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const item = getItemByInput(input);
        setPowderSlots(input, item);
        if (item === undefined) continue;
        colorSlot(input, item);
        setLink(input);
        addPowders(build, input);
        addMajorIds(build, item);
        addBases(build, item);
        addIds(build, item);
        if (item.attackSpeed === undefined) continue;
        addAttackSpeed(build, item);
        document.title = "" + input.value + ": WynnSmith";
    }
}

function addBasePlayerStats(build) {
    build.base["baseHealth"] = 535;
}

function addAttackSpeed(build, item) {
    const attackSpeed = item.attackSpeed;
    build.attackSpeed = attackSpeed;
    const speeds = Object.keys(attackSpeedMultipliers);
    build.neumericalAttackSpeed = undefined;
    for (let i = 0; i < speeds.length; i++) {
        if (attackSpeed === speeds[i]) {
            build.neumericalAttackSpeed = i;
            break;
        }
    }
}

function addIds(build, source) {
    const adds = source.identifications;
    const idNames = Object.keys(adds);
    for (let i = 0; i < idNames.length; i++) {
        const id = getAsMax(adds[idNames[i]]);
        addId(build, id, idNames[i]);
    }
}

function addBases(build, item) {
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
    if (build.ids[idName] === undefined) {
        build.ids[idName] = 0;
    }
    build.ids[idName] += id;
}

function addMajorIds(build, item) {
    if (item.majorIds === undefined) return;
    build.maIds.push(Object.keys(item.majorIds)[0]);
}

function getItemByInput(input) {
    const itemCategory = itemGroups[input.dataset["slot"].replace("0", "").replace("1", "")];

    if (itemCategory === undefined) return;
    const itemData = itemCategory.find((it) => it.name === input.value);
    if (itemData === undefined) return undefined;
    return itemData.item;
}

function refreshOwnData(input) {
    const display = document.getElementById("display-" + input.dataset.slot);
    const item = getItemByInput(input);

    setDisplay(display, item, input.value);
}

function addMinAndMaxTo(target, source) {
    target.min += source.min;
    target.max += source.max;
}

// Powders:
function setPowderSlots(input, item) {
    const powderInput = document.getElementById("powder_" + input.dataset.slot);
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

function colorSlot(input, item) {
    input.dataset.rarity = item.rarity;
}

function setLink(input) {
    document.getElementById(input.dataset.slot + "_link").href = "../item/?" + input.value;
}

function addPowders(build, input) {
    const powderInput = document.getElementById("powder_" + input.dataset.slot);
    if (powderInput === null) return;
    const powdersString = powderInput.value.length % 2 === 0 ? powderInput.value : powderInput.value.substring(0, powderInput.value.length - 1);
    const destination = input.dataset.slot === "weapon" ? build.powders.weapon : build.powders.armour;
    for (let i = 0; i < powdersString.length / 2; i++) {
        const powderName = powdersString.substring(i * 2, i * 2 + 2);
        const powder = powders[powderName];
        if (powder === undefined) continue;
        destination.push(powderName);
    }
}

function refreshTomes(build) {
    for (let i = 0; i < tomeInputs.length; i++) {
        if (getItemByInput(tomeInputs[i]) === undefined) continue;

        build.tomes.push(tomeInputs[i].value);
    }
}

function fixSPInputs() {
    for (let i = 0; i < 5; i++) {
        if (!isNaN(parseInt(spInputs[i].value))) continue;
        spInputs[i].value = 0;
    }
}
