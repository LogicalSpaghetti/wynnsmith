`use strict`;

function readItems(build) {
    readGear(build);
    readWeapons(build);
}

function readGear(build) {
    const itemInputs = document.getElementById("item_inputs");
    const gearClusters = itemInputs.querySelectorAll(`.input_cluster[data-group="gear"]`);

    for (let cluster of gearClusters) {
        addItem(build, cluster);
    }
}

function readWeapons(build) {
    readWeapon(build);
    // todo: off-hands
}

function readWeapon(build) {
    const itemInputs = document.getElementById("item_inputs");
    const weaponCluster = itemInputs.querySelector(".primary_weapon_cluster");
    const weaponInput = weaponCluster.querySelector(".item_input");

    const item = getItemInGroup("weapon", weaponInput.value);
    if (!item) return;

    addItem(build, weaponCluster);

    build.wynnClass = item.requirements.classRequirement;
    addAttackSpeed(build, item);

    document.title = `${weaponInput.value} - WynnSmith`;

    let icon = document.querySelector("link[rel~='icon']");
    if (!icon) {
        icon = document.createElement("link");
        icon.rel = "icon";
        document.head.appendChild(icon);
    }
    icon.href = "img/icons/" + item.requirements.classRequirement + ".png";

    let weaponImg = weaponCluster.querySelector(".slot_img");
    weaponImg.src = "img/item/" + item.requirements.classRequirement + ".png";

}

function addItem(build, cluster) {
    const item = getItemByCluster(cluster);

    setPowderSlots(cluster, item);

    if (!item) return;

    colorSlot(cluster, item);
    setLink(cluster, item);

    addPowders(build, cluster);
    addMajorIds(build, item);
    addBases(build, item);
    addIds(build, item);
}

function addAttackSpeed(build, item) {
    build.base.attackSpeed = item.attackSpeed;
}

function addIds(build, item) {
    const ids = item.identifications;
    if (!ids) return;
    for (let idName in ids)
        addId(build, getAsMax(ids[idName]), idName);
}

function addId(build, id, idName) {
    build.ids[idName] += id;
}

function getAsMax(possibleInt) {
    if (Number.isInteger(possibleInt)) return possibleInt;
    return possibleInt.max;
}

function addBases(build, item) {
    const ids = item.base;
    if (!ids) return;
    for (let idName in ids)
        addBase(build, ids[idName], idName);
}

function addBase(build, id, idName) {
    if (!id) return;
    if (Number.isInteger(id)) {
        build.base[idName] += id;
    } else {
        addMinAndMaxTo(build.base[idName], id);
    }
}

function addMajorIds(build, item) {
    for (let maId in item.majorIds) build.maIds.push(maId);
}

function getItemByCluster(cluster) {
    const input = cluster.querySelector(".item_input");
    return getItemInGroup(cluster.dataset.slot, input.value);
}

function addMinAndMaxTo(target, source) {
    target.min += source.min;
    target.max += source.max;
}

function setPowderSlots(cluster, item) {
    const powderInput = cluster.querySelector(".powder_input");
    if (!powderInput) return;

    if (!item || !item.powderSlots) {
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

function colorSlot(cluster, item) {
    const input = cluster.querySelector(".item_input");
    input.dataset.rarity = item.rarity;
}

function setLink(cluster, item) {
    cluster.querySelector(".item_link")
        .href = "./item/?" + item.name ?? "";
}

function addPowders(build, cluster) {
    const powderInput = cluster.querySelector(".powder_input");
    if (!powderInput) return;

    const powdersString = powderInput.value.length % 2 === 0 ? powderInput.value : powderInput.value.substring(0, powderInput.value.length - 1);

    const slotPowders = [];

    for (let i = 0; i < powdersString.length / 2; i++) {
        const powderName = powdersString.substring(i * 2, i * 2 + 2);
        const powder = powders[powderName];
        if (powder == null) continue;
        slotPowders.push(powderName);
    }

    sortPowderArray(slotPowders);

    const special = getPowderSpecial(slotPowders);

    if (cluster.dataset.slot === "weapon") {
        build.powders.weapon = slotPowders;
        build.specials.weapon = special;
    } else {
        build.powders.armour = build.powders.armour.concat(slotPowders);
        build.specials.armour.push(special);
    }
}

function sortPowderArray(powderArray) {
    const order = [];
    powderArray.forEach((powder) => {
        if (order.indexOf(powder[0]) === -1) order.push(powder[0]);
    });

    powderArray.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
}

function getPowderSpecial(powderArray) {
    const tiered = powderArray.filter(powder => powder[1] > 3);
    let first = tiered[0];
    for (let i = 1; i < tiered.length; i++) {
        if (tiered[i][0] === first[0]) {
            return {type: first[0], tier: (parseInt(tiered[i][1]) + parseInt(first[1]) - 7)};
        }
        first = tiered[i];
    }
}

// TODO: calculate SP reqs.
function readSkillPointMultipliers(build) {
    const spInputs = document.getElementById("sp_section").querySelectorAll(".sp_input");
    for (let i = 0; i < 5; i++) {
        let value = parseInt(spInputs[i].value);
        spInputs[i].value = isNaN(value) ? 0 : value;

        build.sp_multipliers[i] = getSkillPointMultiplier(value, i);
    }
}

function getSkillPointMultiplier(value, i) {
    let mlt = spMultipliers[capSkillPoint(value)];
    if (i === 3) mlt *= 0.867;
    if (i === 4) mlt *= 0.951;

    return mlt;
}

function capSkillPoint(sp) {
    return isNaN(sp) ? 0 : Math.min(Math.max(sp, 0), 150);
}
