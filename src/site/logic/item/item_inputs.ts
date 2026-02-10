import {type Equipment, type ItemCategory} from "./item.ts";
import {ItemInput} from "./item_input.ts";

const equipmentData: { category: ItemCategory, slot: keyof Equipment, hasPowders: boolean }[] = [
    {category: "helmet", slot: "helmet", hasPowders: true},
    {category: "chestplate", slot: "chestplate", hasPowders: true},
    {category: "leggings", slot: "leggings", hasPowders: true},
    {category: "boots", slot: "boots", hasPowders: true},
    {category: "ring", slot: "ring1", hasPowders: false},
    {category: "ring", slot: "ring2", hasPowders: false},
    {category: "bracelet", slot: "bracelet", hasPowders: false},
    {category: "necklace", slot: "necklace", hasPowders: false},
];

export class ItemInputs {
    container;

    weapon: ItemInput;
    equipment: Equipment;
    // offhands: Item[];

    onChange;

    constructor(onChange: () => void) {
        this.onChange = onChange;

        const container = this.container = document.createElement("div");
        this.equipment = this.initEquipment();
        for (const key in this.equipment)
            container.appendChild(this.equipment[key as keyof Equipment].container);

        const weapon = this.weapon = this.initWeapon();
        container.appendChild(weapon.container);
    }

    private initEquipment(): Equipment {
        const equipment = {} as Equipment;

        for (const entry of equipmentData)
            equipment[entry.slot] = new ItemInput(entry.category, entry.hasPowders, false, this.onChange);

        return equipment;
    }

    private initWeapon() {
        return new ItemInput("weapon", true, true, this.onChange);
    }
}