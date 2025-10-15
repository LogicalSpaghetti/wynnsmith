import * as search from "../../control/database/item_search.js";
import {getItem} from "../../control/database/item_search.js";
import indexedInternalNameGroups from "../../../../data/indexed_names.js";
import {binaryToDecimal, decimalToBinary, flag, getBinaryLength, spliceOffNumber} from "../../../common/numbers.js";
import {Powders} from "./powders.js";

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
        // TODO: if tomes are all empty, just return a 0
        let binary = "1";
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
        return Item.fromCluster(weaponCluster);
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

// TODO: crafted/modified/custom items
// TODO: stop exporting once old link syntax is removed.
