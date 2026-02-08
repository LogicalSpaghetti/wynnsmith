import * as search from "./item_search.js";
import {itemDatabase} from "./item_search.js";
import indexedInternalNameGroups from "../../../js_data/indexed_names.js";
import {binaryToDecimal, BitReader, decimalToBinaryByMaximum, getBinaryLength} from "../../common/numbers.ts";
import {Powders} from "./powders.js";
import type {NormalItemType, WeaponItemType} from "./item_types.ts";
import type {ItemSubType, ItemTypeType} from "../../../generated/item_types.ts";

const slots = ["weapon", "helmet", "chestplate", "leggings", "boots", "ring", "ring", "bracelet", "necklace"];
const weaponCategory = "weapon";
const tomeSlots = ["guild", "lootrun", "armour", "armour", "armour", "armour", "mysticism", "mysticism", "weapon", "weapon", "expertise", "expertise", "marathon", "marathon"];
const morph = ["Morph-Stardust", "Morph-Steel", "Morph-Iron", "Morph-Gold", "Morph-Topaz", "Morph-Emerald", "Morph-Amethyst", "Morph-Ruby"];
const maxOffhandCount = 7;

const typesOfItemEncodings = 4;
const ItemTypes = {
    NORMAL: 0,
    CRAFTED: 1,
    MODIFIED: 2,
    CUSTOM: 3,
};

export type ItemCategory = ItemTypeType | ItemSubType

export class BadItem {
    data: NormalItemType;
    type = ItemTypes.NORMAL;
    powders;

    constructor(data: NormalItemType, powders: Powders = new Powders()) {
        this.data = data;
        this.powders = powders;
    }

    static fromCluster(cluster: HTMLElement, fixCluster = true) {
        const slot = cluster.dataset.slot as string;
        const inputValue = (cluster.querySelector(".item_input") as HTMLInputElement).value;

        const itemData = search.getItemInGroup(slot, inputValue);
        if (!itemData) return null;
        const powderSlots = ("powderSlots" in itemData ? itemData.powderSlots : 0) ?? 0;
        const itemPowders = Powders.fromCluster(cluster, powderSlots, fixCluster);

        if (fixCluster) {
            if (slot === "weapon") BadItem.#setWeaponIcon(cluster, "requirements" in itemData && "classRequirement" in itemData.requirements ? itemData.requirements.classRequirement : "archer");
            BadItem.#colorSlot(cluster, "rarity" in itemData ? itemData.rarity : "");
            BadItem.#setLink(cluster, itemData.name);
        }

        return new BadItem(itemData, itemPowders);
    }

    // assumed to already have evaluated the type flag
    static fromBinary(binary: BitReader, category: ItemCategory) {

        const itemIndex = binary.readNumberByMaximum(indexedInternalNameGroups[category].length + 1) - 1;
        if (itemIndex < 0) return null;

        const internalName = indexedInternalNameGroups[category][itemIndex];

        const data = itemDatabase.getItem(internalName);

        const hasPowders = binary.readFlag();
        const powders = hasPowders ? Powders.fromBinary(binary) : undefined;

        return new BadItem(data, powders);
    }

    toBinary(category = this.data.type) {
        let binary = "";

        if (this.type === ItemTypes.NORMAL) {
            binary += "0" + decimalToBinaryByMaximum(indexedInternalNameGroups[category].indexOf(this.data.internalName) + 1,
                indexedInternalNameGroups[category].length + 1);
        } else if (this.type === ItemTypes.CRAFTED) {
            throw new Error("Code for crafted items not yet added!");
        } else if (this.type === ItemTypes.CUSTOM) {
            throw new Error("Code for custom items not yet added!");
        } else if (this.type === ItemTypes.MODIFIED) {
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

    static #colorSlot(cluster, rarity: string) {
        const input = cluster.querySelector(".item_input");
        input.dataset.rarity = rarity;
    }

    static #setLink(cluster, itemName) {
        cluster.querySelector(".item_link")
            .href = itemName ? "./item/?" + (itemName ?? "") : "";
    }

    static #setWeaponIcon(cluster, classReq) {
        cluster.querySelector(".slot_img").src =
            `img/item/${classReq ?? "archer"}.png`;
    }

    isEmpty() {
        return (!this.data);
    }
}

export class Item {
    data: NormalItemType;
    type;
    powders;

    constructor(data: NormalItemType, type: number, powders: Powders = new Powders()) {
        this.data = data;
        this.type = type;
        this.powders = powders;
    }

    toBinary(): string {
    }

    static fromBinary(binary: BitReader, category: ItemCategory): Item | null {
        const type = binary.readNumberByMaximum(typesOfItemEncodings - 1);
        let data;
        switch (type) {
            case ItemTypes.NORMAL:
                data = Item.normalDataFromBinary(binary, category);
                break;
        }
        if (!data) return null;

        const powders = Powders.fromBinary(binary);

        return new Item(data, type, powders);
    }

    static normalDataFromBinary(binary: BitReader, category: ItemCategory): NormalItemType | null {
        const id = binary.readNumberByMaximum(itemDatabase.getSize() + 1) - 1;
        if (id < 0) return null;
        return itemDatabase.getItemById(id);
    }

    static fromString(input: string, category = "") {
        // TODO: handle non-normal items

    }
}

export class Items {
    weapon;
    offhands = [];
    equipment = [];
    tomes = [];

    constructor(offhands = [], weapon: WeaponItemType | null = null, equipment = [], tomes = []) {
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
        for (let i = 0; i < offhandCount; i++) offhands.push(BadItem.fromBinary(binary, weaponCategory));
        return offhands;
    }

    static #readWeapon(binary) {
        return BadItem.fromBinary(binary, weaponCategory);
    }

    static #readEquipment(binary) {
        const equipment = [];
        for (const slot of slots) equipment.push(BadItem.fromBinary(binary, slot));
        return equipment;
    }

    static #readTomes(binary) {
        if (!flag(binary)) return new Array(tomeSlots.length).fill(null);
        const tomes = [];
        for (let slot of tomeSlots) tomes.push(BadItem.fromBinary(binary, `${slot}_tome`));
        return tomes;
    }

    #encodeOffhands() {
        let binary = decimalToBinaryByMaximum(this.offhands.length);
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
        return BadItem.fromCluster(weaponCluster);
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
        return Array.from(clusters).map(cluster => BadItem.fromCluster(cluster));
    }
}
