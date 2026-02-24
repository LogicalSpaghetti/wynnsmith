import {ItemInput, WeaponInput} from "./item_input.ts";
import {HistoryLedger, TypedEventTarget} from "../history/history.ts";

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

export type TomeInputsType = [
    ItemInput, // guild
    ItemInput, // lootrun
    ItemInput, // armour
    ItemInput, // armour
    ItemInput, // armour
    ItemInput, // armour
    ItemInput, // mysticism
    ItemInput, // mysticism
    ItemInput, // weapon
    ItemInput, // weapon
    ItemInput, // expertise
    ItemInput, // expertise
    ItemInput, // marathon
    ItemInput, // marathon
]

const morph = ["Morph-Stardust", "Morph-Steel", "Morph-Iron", "Morph-Gold", "Morph-Topaz", "Morph-Emerald", "Morph-Amethyst", "Morph-Ruby"];

type ItemInputsEvents = {
    change: void
}

export class ItemInputs<Events extends ItemInputsEvents = ItemInputsEvents> extends TypedEventTarget<Events> {
    static readonly offhandLabel = "Offhands: ";
    static readonly maxOffhands = 7;

    private readonly container;

    private readonly weapon: WeaponInput;
    private readonly equipment: EquipmentInputs;

    private offhands: WeaponInput[] = [];
    private readonly addOffhandContainer;
    private readonly addOffhandButton;
    private readonly offhandContainer;

    constructor() {
        super();
        this.container = this.initContainer();

        this.equipment = this.initEquipment();
        for (const input of this.equipment)
            this.container.appendChild(input.container);

        this.weapon = this.initWeapon();
        this.container.appendChild(this.weapon.container);

        this.addOffhandContainer = document.createElement("div");
        this.container.appendChild(this.addOffhandContainer);
        this.addOffhandContainer.appendChild(document.createTextNode(ItemInputs.offhandLabel));
        this.addOffhandButton = this.initAddOffhand();
        this.addOffhandContainer.appendChild(this.addOffhandButton);
        this.offhandContainer = this.initOffhandContainer();
        this.container.appendChild(this.offhandContainer);

    }

    private initContainer() {
        return document.createElement("div");
    }

    private initEquipment(): EquipmentInputs {
        return [
            new ItemInput("helmet", true, false),
            new ItemInput("chestplate", true, false),
            new ItemInput("leggings", true, false),
            new ItemInput("boots", true, false),
            new ItemInput("ring", false, false),
            new ItemInput("ring", false, false),
            new ItemInput("bracelet", false, false),
            new ItemInput("necklace", false, false),
        ];
    }

    private initWeapon() {
        const input = new WeaponInput("weapon", true, true);
        input.addEventListener("morph", () => this.onMorph());
        input.addEventListener("change", () => this.onChange());
        return input;
    }

    holder() {
        return this.container;
    }

    private onMorph = () => {
        this.equipment.forEach((input, i) => input.changeInput(morph[i], false));
    };

    private onChange() {
        this.dispatchEvent("change");
    }

    private initOffhandContainer() {
        return document.createElement("div");
    }

    private initAddOffhand(): HTMLButtonElement {
        const button = document.createElement("button");
        button.textContent = "+";
        button.addEventListener("click", () => this.addOffhand());
        return button;
    }

    public addOffhand() {
        if (this.offhands.length >= ItemInputs.maxOffhands) return;
        const input = new WeaponInput("weapon", true, true, true);
        this.offhands.push(input);
        this.offhandContainer.appendChild(input.container);
        input.addEventListener("change", () => this.onChange());
        input.addEventListener("delete", () => {
            this.offhands = this.offhands.filter((i) => i !== input);
            input.container.remove();
            this.addOffhandContainer.hidden = false;
        });
        if (this.offhands.length >= ItemInputs.maxOffhands)
            this.addOffhandContainer.hidden = true;
    }

    registerTo(ledger: HistoryLedger) {
        ledger.register(this.weapon);
        for (let slot of this.equipment)
            ledger.register(slot);
    }
}

export class TomeInputs<Events extends ItemInputsEvents = ItemInputsEvents> extends TypedEventTarget<Events> {
    private readonly container;

    private readonly tomes: TomeInputsType;

    constructor() {
        super();
        this.container = this.initContainer();
        this.tomes = this.initTomes();
        for (const input of this.tomes)
            this.container.appendChild(input.container);
    }

    holder() {
        return this.container;
    }

    private initContainer() {
        return document.createElement("div");
    }

    private initTomes(): TomeInputsType {
        return [
            new ItemInput("guild_tome", false, false),
            new ItemInput("lootrun_tome", false, false),
            new ItemInput("armour_tome", false, false),
            new ItemInput("armour_tome", false, false),
            new ItemInput("armour_tome", false, false),
            new ItemInput("armour_tome", false, false),
            new ItemInput("mysticism_tome", false, false),
            new ItemInput("mysticism_tome", false, false),
            new ItemInput("weapon_tome", false, false),
            new ItemInput("weapon_tome", false, false),
            new ItemInput("expertise_tome", false, false),
            new ItemInput("expertise_tome", false, false),
            new ItemInput("marathon_tome", false, false),
            new ItemInput("marathon_tome", false, false),
        ];
    }
}