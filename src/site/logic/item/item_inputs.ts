import {ItemInput, WeaponInput} from "./item_input.ts";

export type EquipmentInputs = [
    ItemInput, // helmet
    ItemInput, // chestplate
    ItemInput, // leggings
    ItemInput, // boots
    ItemInput, // ring
    ItemInput, // ring
    ItemInput, // bracelet
    ItemInput, // necklace
]

const morph = ["Morph-Stardust", "Morph-Steel", "Morph-Iron", "Morph-Gold", "Morph-Topaz", "Morph-Emerald", "Morph-Amethyst", "Morph-Ruby"];

// TODO: Morph-
export class ItemInputs {
    container;

    weapon: ItemInput;
    equipment: EquipmentInputs;
    // offhands: Item[];

    onChange;

    constructor(onChange: () => void) {
        this.onChange = onChange;

        const container = this.container = document.createElement("div");
        this.equipment = this.initEquipment();
        for (const input of this.equipment)
            container.appendChild(input.container);

        const weapon = this.weapon = this.initWeapon();
        container.appendChild(weapon.container);
    }

    private initEquipment(): EquipmentInputs {
        return [
            new ItemInput("helmet", true, false, this.onChange),
            new ItemInput("chestplate", true, false, this.onChange),
            new ItemInput("leggings", true, false, this.onChange),
            new ItemInput("boots", true, false, this.onChange),
            new ItemInput("ring", false, false, this.onChange),
            new ItemInput("ring", false, false, this.onChange),
            new ItemInput("bracelet", false, false, this.onChange),
            new ItemInput("necklace", false, false, this.onChange),
        ]
    }

    private initWeapon() {
        return new WeaponInput("weapon", true, true, this.onChange, this.onMorph);
    }

    private onMorph = () => {
        this.equipment.forEach((input, i) => input.changeInput(morph[i], false))
    }
}