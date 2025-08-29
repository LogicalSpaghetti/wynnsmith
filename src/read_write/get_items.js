`use strict`;

function getItemsFromHTML() {
    return {
        equipment: getEquipment(),
        weapons: getWeapons(),
        tomes: getTomes()
    };
}

function getEquipment(item_input_id = "item_inputs") {
    const inputs = document.getElementById(item_input_id);
    const equipmentClusters = inputs.querySelectorAll(`.input_cluster[data-group="gear"]`);
    const weaponElement = inputs.querySelector(`.primary_weapon_cluster`).querySelector(".item_input");
    if (shouldReplaceWithMorph(weaponElement.value)) {
        weaponElement.value = toStringWithoutMorph(weaponElement.value);
        replaceWithMorph(equipmentClusters);
    }
    return getItemsFromClusters(inputs.querySelectorAll(`.input_cluster[data-group="gear"]`));
}

function toStringWithoutMorph(string) {
    return string.replace(/morph-/i, "");
}

function shouldReplaceWithMorph(weaponText) {
    return getIndexOfMorph(weaponText) !== -1;
}

function getIndexOfMorph(string) {
    const capitalizedIndex = string.indexOf("Morph-");
    return capitalizedIndex !== -1 ? capitalizedIndex : string.indexOf("morph-");
}

function getTomes() {
    const tomeClusters = document.getElementById("tome_inputs")
        .querySelectorAll(".input_cluster");
    return getItemsFromClusters(tomeClusters);
}

function getItemsFromClusters(clusters) {
    return Array.from(clusters).map(cluster => readItemFromCluster(cluster)).filter(item => item != null);
}

const morph = ["Morph-Stardust", "Morph-Steel", "Morph-Iron", "Morph-Gold", "Morph-Topaz", "Morph-Emerald", "Morph-Amethyst", "Morph-Ruby"];

function replaceWithMorph(clusters) {
    Array.from(clusters).forEach((cluster, i) => {
        const input = cluster.querySelector(`.item_input`);
        input.value = morph[i];
    })
}

function getWeapons() {
    const itemInputs = document.getElementById("item_inputs");
    const weaponCluster = itemInputs.querySelector(`.primary_weapon_cluster`);
    const offhandWeaponClusters = itemInputs.querySelector(`.offhands`).querySelectorAll(`.input_cluster`);
    const weaponClusters = [weaponCluster].concat(Array.from(offhandWeaponClusters));

    const mainHand = getItemByCluster(weaponCluster);
    if (!mainHand) return [];

    return getItemsFromClusters(weaponClusters);
}

function readItemFromCluster(cluster) {
    const item = {slot: cluster.dataset.slot};

    const itemData = getItemByCluster(cluster);

    setPowderSlots(cluster, itemData);

    item.name = itemData?.name;

    if (!itemData) return;

    colorSlot(cluster, itemData);
    setLink(cluster, itemData);

    item.powders = getClusterPowders(cluster);
    item.special = getPowderSpecial(item.powders, itemData.type === "weapon");

    return item;
}

function getItemByCluster(cluster) {
    const input = cluster.querySelector(".item_input");
    const item = getItemInGroup(cluster.dataset.slot, input.value);
    if (cluster.dataset.slot === "weapon") cluster.querySelector(".slot_img").src =
        `img/item/${item?.requirements?.classRequirement ?? "archer"}.png`;
    return item;
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
        powderInput.disabled = true;
        return;
    }

    powderInput.disabled = false;
    powderInput.placeholder = item.powderSlots + " Slots";
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

function getClusterPowders(cluster) {
    const powderInput = cluster.querySelector(".powder_input");
    if (!powderInput) return [];

    const powdersString = powderInput.value.length % 2 === 0 ? powderInput.value : powderInput.value.substring(0, powderInput.value.length - 1);

    const slotPowders = [];

    for (let i = 0; i < powdersString.length / 2; i++) {
        const powderName = powdersString.substring(i * 2, i * 2 + 2);
        const powder = powders[powderName];
        if (powder == null) continue;
        slotPowders.push(powderName);
    }

    sortPowderArray(slotPowders);

    return slotPowders;
}

function sortPowderArray(powderArray) {
    const order = [];
    powderArray.forEach((powder) => {
        if (order.indexOf(powder[0]) === -1) order.push(powder[0]);
    });

    powderArray.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
}

function getPowderSpecial(powderArray, isWeapon = false) {
    const tiered = powderArray.filter(powder => powder[1] > 3);
    let first = tiered[0];
    for (let i = 1; i < tiered.length; i++) {
        if (tiered[i][0] === first[0]) {
            const name = powderSpecialNames[isWeapon ? "weapon" : "armour"][powderPrefixes.indexOf(first[0])].toLowerCase();
            const tier = parseInt(tiered[i][1]) + parseInt(first[1]) - 7;
            return `${name}${tier}`;
        } else first = tiered[i];
    }
}

function getSkillPointModifiers() {
    const spClusters = document.getElementById("sp_section").querySelectorAll(".sp_cluster");

    const totals = [];
    for (let cluster of spClusters) {
        const modifierInput = cluster.querySelector(".sp_input");
        const index = damageTypePrefixes.indexOf(cluster.dataset.element) - 1;

        const value = Math.max(-1000, Math.min(1000, parseInt(modifierInput.value))) || 0;
        if (modifierInput.value === "0-" || modifierInput.value === "-0" || modifierInput.value === "-")
            modifierInput.value = "-";
        else modifierInput.value = value;

        totals[index] = value;
    }

    return totals;
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
