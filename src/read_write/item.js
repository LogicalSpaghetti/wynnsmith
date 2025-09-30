import * as search from "./item_search.js";
import {getItem} from "./item_search.js";
import {getPowder, getPowderSpecialName} from "../permute/powders.js";
import indexedInternalNameGroups from "../data/indexed_names.js";
import {binaryToDecimal, decimalToBinary, flag, getBinaryLength, spliceOffNumber} from "../util/numbers.js";

const powderTypeCount = 5;
const maxPowderTier = 6;
const powderLetters = ["e", "t", "w", "f", "a"];
const slots = ["weapon", "helmet", "chestplate", "leggings", "boots", "ring", "ring", "bracelet", "necklace"];
const weaponCategory = "weapon";
const tomeSlots = ["guild", "lootrun", "armour", "armour", "armour", "armour", "mysticism", "mysticism", "weapon", "weapon", "expertise", "expertise", "marathon", "marathon"];
const morph = ["Morph-Stardust", "Morph-Steel", "Morph-Iron", "Morph-Gold", "Morph-Topaz", "Morph-Emerald", "Morph-Amethyst", "Morph-Ruby"];
const maxOffhandCount = 7;

export class Items {
    weapon = new Item();
    offhands = [];
    equipment = [];
    tomes = [];

    constructor(offhands = [], weapon = new Item(), equipment = [], tomes = []) {
        this.offhands = offhands;
        this.weapon = weapon;
        this.equipment = equipment;
        this.tomes = tomes;
    }

    static fromHTML = () =>
        new Items(Items.#getOffhands(), Items.#getWeapon(), Items.#getEquipment(), Items.#getTomes());

    static fromBinary = (binary) =>
        new Items(this.#readOffhands(binary), this.#readWeapon(binary), this.#readEquipment(binary), this.#readTomes());

    toBinary = () =>
        this.#encodeOffhands() +
        this.#encodeWeapon() +
        this.#encodeEquipment() +
        this.#encodeTomes();

    static #readOffhands(binary) {
        const offhands = [];
        const offhandCount = spliceOffNumber(binary, maxOffhandCount);
        for (let i = 0; i < offhandCount; i++) offhands.push(Item.fromBinary(binary, weaponCategory));
        return offhands;
    }

    static #readWeapon(binary) {
        return Item.fromBinary(binary, weaponCategory);
    }

    static #readEquipment(binary) {
        const equipment = [];
        for (const slot of slots) equipment.push(Item.fromBinary(binary, slot));
        return equipment;
    }

    static #readTomes(binary) {
        if (!flag(binary)) return new Array(tomeSlots.length).fill(null);
        const tomes = [];
        for (let slot of tomeSlots) tomes.push(Item.fromBinary(binary, `${slot}_tome`));
        return tomes;
    }

    #encodeOffhands() {
        let binary = decimalToBinary(this.offhands.length);
        for (let offhand of this.offhands) binary += offhand.toBinary(weaponCategory);
        return binary;
    }

    #encodeWeapon() {
        return this.weapon.toBinary(weaponCategory);
    }

    #encodeEquipment() {
        let binary = "";
        for (let i = 0; i < slots.length; i++) binary += this.equipment[i].toBinary(slots[i]);
        return binary;
    }

    #encodeTomes() {
        let binary = "";
        for (let i = 0; i < tomeSlots.length; i++) binary += this.tomes[i].toBinary(`${tomeSlots[i]}_tome`);
        return binary;
    }

    static #getOffhands() {
        const itemInputs = document.getElementById("item_inputs");
        const offhandClusters = itemInputs.querySelector(`.offhands`).querySelectorAll(`.input_cluster`);
        return Items.#getItemsFromClusters(offhandClusters);
    }

    static #getWeapon() {
        const itemInputs = document.getElementById("item_inputs");
        const weaponCluster = itemInputs.querySelector(`.primary_weapon_cluster`);
        return getItemByCluster(weaponCluster);
    }

    static #getEquipment(item_input_id = "item_inputs") {
        const inputs = document.getElementById(item_input_id);
        const weaponInput = inputs.querySelector(`.primary_weapon_cluster > .item_input`);
        const gearClusters = inputs.querySelectorAll(`.input_cluster[data-group="gear"]`);

        Items.#morphify(weaponInput, gearClusters);

        return Items.#getItemsFromClusters(gearClusters);
    }

    static #morphify(weaponInput, gearClusters) {
        const shouldReplaceWithMorph = (str) => str.indexOf("Morph-") !== -1 || str.indexOf("morph-") !== -1;
        if (!shouldReplaceWithMorph(weaponInput.value)) return;

        weaponInput.value = weaponInput.value.replace(/morph-/i, "");
        for (const [i, cluster] of gearClusters.entries()) cluster.querySelector(`.item_input`).value = morph[i];
    }

    static #getTomes() {
        const tomeClusters = document.getElementById("tome_inputs")
            .querySelectorAll(".input_cluster");
        return Items.#getItemsFromClusters(tomeClusters);
    }

    static #getItemsFromClusters(clusters) {
        return Array.from(clusters).map(cluster => Item.fromCluster(cluster));
    }
}

const SlotTypes = {
    NORMAL: 0,
    CRAFTED: 1,
    CUSTOM: 2,
    MODIFIED: 3
};

export class Item {
    data;
    type;
    powders;

    constructor(data, powders, type) {
        this.data = data;
        this.type = type;
        this.powders = powders;
    }

    static fromCluster(cluster, fixCluster = true) {
        const slot = cluster.dataset.slot;

        const itemType = SlotTypes.NORMAL; // TODO: crafted/custom/modified inputs.
        const itemData = search.getItemInGroup(slot, cluster.querySelector(".item_input")?.value);
        const itemPowders = Powders.fromCluster(cluster, itemData?.powderSlots ?? 0, fixCluster);

        if (fixCluster) {
            if (slot === "weapon") Item.#setWeaponIcon(itemData?.requirements?.classRequirement);
            Item.#colorSlot(cluster, itemData?.rarity);
            Item.#setLink(cluster, itemData?.name);
        }

        return new Item(itemData, itemPowders, itemType);
    }

    static fromBinary(binary, category) {
        const item = new Item();

        const type = flag(binary, 2);
        if (type === SlotTypes.NORMAL) {
            const item_name_index = binary.splice(0, getBinaryLength(indexedInternalNameGroups[category].length + 1));
            const internalName = indexedInternalNameGroups[category][binaryToDecimal(item_name_index)];

            item.data = getItem(internalName);
            item.type = SlotTypes.NORMAL;
        } else if (type === SlotTypes.CRAFTED) {
            throw new Error("Code for crafted items not yet added!");
        } else if (type === SlotTypes.CUSTOM) {
            throw new Error("Code for custom items not yet added!");
        } else if (type === SlotTypes.MODIFIED) {
            throw new Error("Code for modified items not yet added!");

        } else throw new Error(`invalid item: ${JSON.stringify(this)}`);

        const name = Item.#decodeItemName(binary, category);
        const hasPowders = binary.splice(0, 1) === "1";
        if (hasPowders) item.powders = Powders.fromBinary(binary);
        item.data = Item.#getData(name, true);

        return item;
    }

    toBinary(category = this.data.type) {
        let binary = "";

        if (this.type === SlotTypes.NORMAL) {
            binary += "0" + decimalToBinary(indexedInternalNameGroups[category].indexOf(this.data.internalName) + 1,
                indexedInternalNameGroups[category].length + 1);
        } else if (this.type === SlotTypes.CRAFTED) {
            throw new Error("Code for crafted items not yet added!");
        } else if (this.type === SlotTypes.CUSTOM) {
            throw new Error("Code for custom items not yet added!");
        } else if (this.type === SlotTypes.MODIFIED) {
            throw new Error("Code for modified items not yet added!");
        } else throw new Error(`invalid item: ${JSON.stringify(this)}`);

        return binary + this.powders.toBinary(binary);
    }

    static #decodeItemName(binary, category) {
        const type = binary.splice(0, 1);
        if (type === "0") {
            const length = getBinaryLength(indexedInternalNameGroups[category].length + 1);
            const index = binaryToDecimal(binary.splice(0, length));
            if (index === 0) return "";
            return indexedInternalNameGroups[category][index - 1];
        } else throw new Error(`invalid item type: ${type}`);
    }

    static #getData(name, byInternalName = true) {
        return byInternalName ? search.getItem(name) : search.getItemByName(name);
    }

    static #colorSlot(cluster, rarity) {
        const input = cluster.querySelector(".item_input");
        input.dataset.rarity = rarity;
    }

    static #setLink(cluster, itemName) {
        cluster.querySelector(".item_link")
            .href = itemName ? "./item/?" + itemName ?? "" : "";
    }

    static #setWeaponIcon(cluster, classReq) {
        cluster.querySelector(".slot_img").src =
            `img/item/${classReq ?? "archer"}.png`;
    }

    isEmpty() {
        return (!this.data);
    }
}

class Powders {
    powders;
    special;

    constructor(powders = []) {
        this.powders = powders;
        this.special = this.#parseSpecial(powders);
    }

    static fromCluster(cluster, powderSlots = 0, fixCluster = true) {
        const powdersString = cluster.querySelector(".powder_input")?.value;
        if (!powdersString) return new Powders();

        const powderArr = [];
        for (let i = 0; i < powdersString.length / 2; i++) {
            const powderName = powdersString.substring(i * 2, i * 2 + 2);
            const powder = getPowder(powderName);
            if (powder == null) break;
            powderArr.push(powderName);
        }
        Powders.#sortArray(powderArr);

        if (fixCluster) Powders.#setPowderSlots(cluster, powderSlots);

        return new Powders(powderArr);
    }

    static fromBinary(binary) {
        const powderArr = [];

        let morePowders;
        let repeatPowder = false;
        do {
            if (!repeatPowder) morePowders = flag(binary);
            powderArr.push(repeatPowder
                ? powderArr[powderArr.powders.length - 1]
                : Powder.fromBinary(binary));
            repeatPowder = flag(binary);
        } while (morePowders);

        Powders.#sortArray(powderArr);

        return new Powders(powderArr);
    }

    toBinary() {
        if (!this.powders.length) return "0";

        let binary = "";

        let repeatPowder = false;
        for (let i = 0; i < this.powders.length; i++) {
            binary += repeatPowder ? this.powders.length - 1 === i : ("1" + Powder.toBinary(this.powders[i]));
            repeatPowder = this.powders[i] === this.powders[i + 1];
            binary += repeatPowder ? "1" : "0";
        }
        binary += "0";
        return binary;
    }

    #parseSpecial(isWeapon) {
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

    static #sortArray(powderArray) {
        const order = [];
        for (const powder of powderArray) if (order.indexOf(powder[0]) === -1) order.push(powder[0]);
        powderArray.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
    }

    static #setPowderSlots(cluster, powderSlots) {
        const powderInput = cluster.querySelector(".powder_input");
        if (!powderInput) return;

        if (!powderSlots) {
            powderInput.placeholder = "No Slots";
            powderInput.maxLength = 0;
            powderInput.value = "";
            powderInput.disabled = true;
            return;
        }

        powderInput.disabled = false;
        powderInput.placeholder = powderSlots + " Slots";
        powderInput.maxLength = powderSlots * 2;
        if (powderInput.value.length > powderInput.maxLength)
            powderInput.value = powderInput.value.substring(0, powderInput.maxLength);
    }
}

class Powder {
    static toBinary(powder) {
        if (Powder.#isMaxTier(powder))
            return decimalToBinary(powderLetters.indexOf(powder[PowderIndex.ELEMENT]), powderTypeCount);
        else return (
            decimalToBinary(powderTypeCount) +
            decimalToBinary(powderLetters.indexOf(powder[PowderIndex.ELEMENT]), powderTypeCount) +
            decimalToBinary(powder[PowderIndex.TIER], maxPowderTier));
    }

    static fromBinary(binary) {
        const type = spliceOffNumber(binary, powderTypeCount + 1);
        let element;
        let tier;
        if (type < powderTypeCount) {
            element = powderLetters[type];
            tier = maxPowderTier;
        } else if (type === powderTypeCount) {
            element = powderLetters[spliceOffNumber(binary, powderTypeCount + 1)];
            tier = spliceOffNumber(binary, maxPowderTier - 1) + 1;
        } else throw new Error(`Powder.fromBinary() is broken!`);
        return (`${element}${tier}`);
    }

    static #isMaxTier(powderString) {
        return powderString[PowderIndex.TIER] === String(maxPowderTier);
    }
}

const PowderIndex = Object.freeze({
    ELEMENT: 0,
    TIER: 1
});

// TODO: Use in favor of plain strings to reduce the potential for typos.
class Binary {
    binary;

    constructor(binary = "") {
        this.binary = binary;
    }

    appendBinary(binary) {
        this.binary += binary;
    }

    appendFlag(bool) {
        this.binary += bool ? "1" : "0";
    }

    appendDecimal(decimal, maxDecimal = null) {
        this.binary += decimalToBinary(decimal, maxDecimal);
    }

    // returns a boolean if length is 1, otherwise it returns a decimal.
    extractFlag(length = 1) {
        if (length === 1) return this.binary.splice(0, 1) === "1";
        return decimalToBinary(this.binary.splice(0, length));
    }

    extractDecimal(binaryLength) {
        return binaryToDecimal(this.binary.splice(0, binaryLength));
    }
}

// TODO: crafted/modified/custom items
// TODO: stop exporting, move to Items class
export function getItemByCluster(cluster) {
    const input = cluster.querySelector(".item_input");
    const itemData = search.getItemInGroup(cluster.dataset.slot, input.value);
    if (cluster.dataset.slot === "weapon") cluster.querySelector(".slot_img").src =
        `img/item/${itemData?.requirements?.classRequirement ?? "archer"}.png`;
    return itemData;
}
