import * as search from "../database/item_database.js";
import {itemDatabase} from "../database/item_database.js";
import indexedInternalNameGroups from "../../js_data/indexed_names.js";
import {binaryToDecimal, BitReader, decimalToBinaryByMaximum, getBinaryLength} from "../misc/numbers.ts";
import {Powders} from "./powders.js";
import type {NormalItemData, WeaponItemType} from "./item_types.ts";
import type {ItemSubType, ItemTypeType} from "./api_item_types.ts";

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

export class OldItem {
    data: NormalItemData;
    type = ItemTypes.NORMAL;
    powders;

    constructor(data: NormalItemData, powders: Powders = new Powders()) {
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
            if (slot === "weapon") OldItem.#setWeaponIcon(cluster, "requirements" in itemData && "classRequirement" in itemData.requirements ? itemData.requirements.classRequirement : "archer");
            OldItem.#colorSlot(cluster, "rarity" in itemData ? itemData.rarity : "");
            OldItem.#setLink(cluster, itemData.name);
        }

        return new OldItem(itemData, itemPowders);
    }

    // assumed to already have evaluated the type flag
    static fromBinary(binary: BitReader, category: ItemCategory) {

        const itemIndex = binary.readNumberByMaximum(indexedInternalNameGroups[category].length + 1) - 1;
        if (itemIndex < 0) return null;

        const internalName = indexedInternalNameGroups[category][itemIndex];

        const data = itemDatabase.getItem(internalName);

        const hasPowders = binary.readFlag();
        const powders = hasPowders ? Powders.fromBinary(binary) : undefined;

        return new OldItem(data, powders);
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
    data: NormalItemData;
    type;
    powders;

    constructor(data: NormalItemData, type: number, powders: Powders = new Powders()) {
        this.data = data;
        this.type = type;
        this.powders = powders;
    }

    toBinary(): string {
        return "";
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

    static normalDataFromBinary(binary: BitReader, category: ItemCategory): NormalItemData | null {
        const id = binary.readNumberByMaximum(itemDatabase.getSize() + 1) - 1;
        if (id < 0) return null;
        return itemDatabase.getItemById(id);
    }

    static fromString(input: string, category = "") {
        // TODO: handle non-normal items

    }
}

type Equipment = [
    Item, // helmet
    Item, // chestplate
    Item, // leggings
    Item, // boots
    Item, // ring
    Item, // ring
    Item, // bracelet
    Item, // necklace
]

type Tomes = {
    // TODO
}

export class Items {
    weapon: Item;
    offhands: Item[];
    equipment: Equipment;
    tomes: Tomes;
}

export class OldItems {
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
        new OldItems(OldItems.#getOffhands(), OldItems.#getWeapon(), OldItems.#getEquipment(), OldItems.#getTomes());

    static fromBinary = (binary) =>
        new OldItems(this.#readOffhands(binary), this.#readWeapon(binary), this.#readEquipment(binary), this.#readTomes());

    toBinary = () =>
        this.#encodeOffhands() +
        this.#encodeWeapon() +
        this.#encodeEquipment() +
        this.#encodeTomes();

    static #readOffhands(binary) {
        const offhands = [];
        const offhandCount = spliceOffNumber(binary, maxOffhandCount);
        for (let i = 0; i < offhandCount; i++) offhands.push(OldItem.fromBinary(binary, weaponCategory));
        return offhands;
    }

    static #readWeapon(binary) {
        return OldItem.fromBinary(binary, weaponCategory);
    }

    static #readEquipment(binary) {
        const equipment = [];
        for (const slot of slots) equipment.push(OldItem.fromBinary(binary, slot));
        return equipment;
    }

    static #readTomes(binary) {
        if (!flag(binary)) return new Array(tomeSlots.length).fill(null);
        const tomes = [];
        for (let slot of tomeSlots) tomes.push(OldItem.fromBinary(binary, `${slot}_tome`));
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
        return OldItems.#getItemsFromClusters(offhandClusters);
    }

    static #getWeapon() {
        const itemInputs = document.getElementById("item_inputs");
        const weaponCluster = itemInputs.querySelector(`.primary_weapon_cluster`);
        return OldItem.fromCluster(weaponCluster);
    }

    static #getEquipment(item_input_id = "item_inputs") {
        const inputs = document.getElementById(item_input_id);
        const weaponInput = inputs.querySelector(`.primary_weapon_cluster > .item_input`);
        const gearClusters = inputs.querySelectorAll(`.input_cluster[data-group="gear"]`);

        OldItems.#morphify(weaponInput, gearClusters);

        return OldItems.#getItemsFromClusters(gearClusters);
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
        return OldItems.#getItemsFromClusters(tomeClusters);
    }

    static #getItemsFromClusters(clusters) {
        return Array.from(clusters).map(cluster => OldItem.fromCluster(cluster));
    }
}
