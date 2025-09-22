import * as search from "./item_search.js";
import {getPowder, getPowderSpecialName} from "../permute/powders.js";
import indexedInternalNameGroups from "../data/indexed_names.js";
import {binaryToDecimal, decimalToBinary, getBinaryLength} from "../util/numbers.js";
import {} from "./build.js";
import {getItem} from "./item_search.js";

const powderLetters = ["e", "t", "w", "f", "a"];
const maxPowderTier = 6;
const slots = ["weapon", "helmet", "chestplate", "leggings", "boots", "ring", "ring", "bracelet", "necklace"];

export class Items {
    weapon;
    offhands = [];
    equipment;
    tomes;

    static fromHTML() {
        const items = new Items();

        items.weapon = this.#getWeapon();
        items.offhands = this.#getOffhands();
        items.equipment = this.#getEquipment();
        items.tomes = this.#getTomes();

        return items;
    }

    static fromBinary(binary) {
        const items = new Items();
        // offhand count
        const offhandCount = binaryToDecimal(binary.splice(0, 3));
        // for each item

        for (let i = 0; i < slots.length + offhandCount; i++) {
            const categoryIndex = (i < offhandCount) ? 0 : i - offhandCount;
            const category = slots[categoryIndex];
            const item = Item.fromBinary(binary, category);
            if (category === "weapon") {
                if (i === 0) {
                    items.weapon = item;
                } else {
                    items.offhands.push(item);
                }
            } else {
                items.equipment = item;
            }
        }
        // TODO: other items
        //  item slot needs to be stored
    }

    toBinary() {
        const binary = "";
        // offhand count
        const offhandCount = binaryToDecimal(binary.splice(0, 3));
        // for each item

        for (let i = 0; i < slots.length + offhandCount; i++) {
            const categoryIndex = (i < offhandCount) ? 0 : i - offhandCount;
            const category = slots[categoryIndex];
            const item = Item.toBinary();
        }
        // TODO: other items
        //  item slot needs to be stored

    }

    #getEquipment(item_input_id = "item_inputs") {
        const inputs = document.getElementById(item_input_id);
        const equipmentClusters = inputs.querySelectorAll(`.input_cluster[data-group="gear"]`);
        const weaponElement = inputs.querySelector(`.primary_weapon_cluster`).querySelector(".item_input");
        if (this.#shouldReplaceWithMorph(weaponElement.value)) {
            weaponElement.value = this.#toStringWithoutMorph(weaponElement.value);
            this.#replaceWithMorph(equipmentClusters);
        }
        return this.#getItemsFromClusters(inputs.querySelectorAll(`.input_cluster[data-group="gear"]`));
    }

    #shouldReplaceWithMorph(weaponText) {
        return this.#getIndexOfMorph(weaponText) !== -1;
    }

    #getIndexOfMorph(string) {
        const capitalizedIndex = string.indexOf("Morph-");
        return capitalizedIndex !== -1 ? capitalizedIndex : string.indexOf("morph-");
    }

    #replaceWithMorph(clusters) {
        for (const [i, cluster] of clusters.entries()) {
            const input = cluster.querySelector(`.item_input`);
            input.value = morph[i];
        }
    }

    #toStringWithoutMorph(string) {
        return string.replace(/morph-/i, "");
    }

    #getWeapon() {
        const itemInputs = document.getElementById("item_inputs");
        const weaponCluster = itemInputs.querySelector(`.primary_weapon_cluster`);

        return getItemByCluster(weaponCluster);
    }

    #getOffhands() {
        const itemInputs = document.getElementById("item_inputs");
        const weaponCluster = itemInputs.querySelector(`.primary_weapon_cluster`);
        const offhandWeaponClusters = itemInputs.querySelector(`.offhands`).querySelectorAll(`.input_cluster`);

        const mainHand = getItemByCluster(weaponCluster);
        if (!mainHand) return [];

        return this.#getItemsFromClusters(offhandWeaponClusters);
    }

    #getTomes() {
        const tomeClusters = document.getElementById("tome_inputs")
            .querySelectorAll(".input_cluster");
        return this.#getItemsFromClusters(tomeClusters);
    }

    #getItemsFromClusters(clusters) {
        return Array.from(clusters).map(cluster => this.#readItemFromCluster(cluster));
    }

    #readItemFromCluster(cluster) {
        const item = {slot: cluster.dataset.slot};

        const itemData = getItemByCluster(cluster);

        this.#setPowderSlots(cluster, itemData);

        if (!itemData) return;

        item.name = itemData.name;
        if (itemData.type) item.type = itemData.type;

        this.#colorSlot(cluster, itemData);
        this.#setLink(cluster, itemData);

        item.powders = getClusterPowders(cluster);
        item.special = item.powders.parseSpecial(itemData.type === "weapon");

        return item;
    }

    #setPowderSlots(cluster, item) {
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

    #colorSlot(cluster, item) {
        const input = cluster.querySelector(".item_input");
        input.dataset.rarity = item.rarity;
    }

    #setLink(cluster, item) {
        cluster.querySelector(".item_link")
            .href = "./item/?" + item.name ?? "";
    }
}

const SlotTypes = {
    NORMAL: 0,
    CRAFTED: 1,
    CUSTOM: 2,
    MODIFIED: 3
};

export class Item {
    type;
    data;
    powders = new Powders();

    static fromBinary(binary, slot) {
        const item = new Item();

        const type = binaryToDecimal(binary.splice(0, 2));
        if (type === SlotTypes.NORMAL) {
            const item_name_index = binary.splice(0, getBinaryLength(indexedInternalNameGroups[slot].length + 1));
            const internalName = indexedInternalNameGroups[slot][binaryToDecimal(item_name_index)];

            item.data = getItem(internalName);
            item.type = SlotTypes.NORMAL;
        } else if (type === SlotTypes.CRAFTED) {

        } else if (type === SlotTypes.CUSTOM) {

        } else if (type === SlotTypes.MODIFIED) {

        } else console.error(`invalid item: ${JSON.stringify(this)}`);

        const name = this.#decodeItemName(binary, slot);
        const hasPowders = binary.splice(0, 1) === "1";
        if (hasPowders) item.powders = Powders.fromBinary(binary);
        this.#addData(name, true);

        return item;
    }

    toBinary(category = this.data.type) {
        let binary = "";

        if (this.type === SlotTypes.NORMAL) {
            binary += "0" + `${decimalToBinary(indexedInternalNameGroups[category].indexOf(this.data.internalName) + 1)}`
                .padStart(decimalToBinary(indexedInternalNameGroups[category].length + 1).length, "0");
        } else if (this.type === SlotTypes.CRAFTED) {

        } else if (this.type === SlotTypes.CUSTOM) {

        } else if (this.type === SlotTypes.MODIFIED) {

        } else console.error(`invalid item: ${JSON.stringify(this)}`);

        return binary + this.powders.toBinary(binary);
    }

    #decodeItemName(binary, category) {
        const type = binary.splice(0, 1);
        if (type === "0") {
            const length = getBinaryLength(indexedInternalNameGroups[category].length + 1);
            const index = binaryToDecimal(binary.splice(0, length));
            if (index === 0) return "";
            return indexedInternalNameGroups[category][index - 1];
        } else throw new Error(`invalid item type: ${type}`);
    }

    #addData(name, byInternalName = true) {
        this.data = byInternalName ? search.getItem(name) : search.getItemByName(name);
    }
}

class Powders {
    powders = [];

    static fromBinary(binary) {
        const powders = new Powders();

        let morePowders = true;
        while (morePowders) {
            const type = binaryToDecimal(binary.splice(0, 3));
            let element;
            let tier;
            if (type < powderLetters.length) {
                element = powderLetters[type];
                tier = maxPowderTier;
            } else if (type === powderLetters.length) {
                element = powderLetters[binaryToDecimal(binary.splice(0, 3))];
                tier = binaryToDecimal(binary.splice(0, 3));
            } else throw new Error(`no powder encoding for type: ${type}`);
            powders.powders.push(`${element}${tier}`);
        }

        return powders;
    }

    toBinary() {
        if (!this.powders.length) return "0";

        let binary = "1";

        let lastPowder = "";
        for (let i = 0; i < this.powders.length; i++) {
            const powder = this.powders[i];

            if (i > 0) binary += powder === lastPowder ? "1" : "0";
            if (powder !== lastPowder)
                if (powder[1] === String(maxPowderTier))
                    binary += decimalToBinary(powderLetters.indexOf(powder[0])).padStart(3, "0");
                else {
                    binary += "101";
                    binary += decimalToBinary(powderLetters.indexOf(powder[0])).padStart(3, "0");
                    binary += decimalToBinary(powder[1]).padStart(3, "0");
                }

            lastPowder = powder;
        }
        return binary;
    }

    parseSpecial(isWeapon) {
        const tiered = this.powders.filter(powder => powder[1] > 3);
        let first = tiered[0];
        for (let i = 1; i < tiered.length; i++) {
            if (tiered[i][0] === first[0]) {
                const name = getPowderSpecialName(isWeapon ? "weapon" : "armour", first[0]);
                const tier = parseInt(tiered[i][1]) + parseInt(first[1]) - 7;
                return `${name}${tier}`;
            } else first = tiered[i];
        }
        return null;
    }
}

const morph = ["Morph-Stardust", "Morph-Steel", "Morph-Iron", "Morph-Gold", "Morph-Topaz", "Morph-Emerald", "Morph-Amethyst", "Morph-Ruby"];

// TODO: crafted/modified/custom items
export function getItemByCluster(cluster) {
    const input = cluster.querySelector(".item_input");
    const item = search.getItemInGroup(cluster.dataset.slot, input.value);
    if (cluster.dataset.slot === "weapon") cluster.querySelector(".slot_img").src =
        `img/item/${item?.requirements?.classRequirement ?? "archer"}.png`;
    return item;
}

function getClusterPowders(cluster) {
    const powderInput = cluster.querySelector(".powder_input");
    if (!powderInput) return [];

    const powdersString = powderInput.value.length % 2 === 0 ? powderInput.value : powderInput.value.substring(0, powderInput.value.length - 1);

    const slotPowders = [];

    for (let i = 0; i < powdersString.length / 2; i++) {
        const powderName = powdersString.substring(i * 2, i * 2 + 2);
        const powder = getPowder(powderName);
        if (powder == null) continue;
        slotPowders.push(powderName);
    }

    sortPowderArray(slotPowders);

    return slotPowders;
}

function sortPowderArray(powderArray) {
    const order = [];
    for (const powder of powderArray) if (order.indexOf(powder[0]) === -1) order.push(powder[0]);

    powderArray.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
}
