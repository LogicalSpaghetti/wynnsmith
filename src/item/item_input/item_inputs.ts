import {ItemInput} from "./item_input.ts";
import {type HistoryEvents, HistoryTarget} from "../../change_handling/history.ts";
import type {ItemCategory} from "../item.ts";

export type ItemInputsGroup = ItemInput[]

type ItemInputsEvents = {
    change: void
} & HistoryEvents;

abstract class ItemInputs<Events extends ItemInputsEvents = ItemInputsEvents> extends HistoryTarget<Events> {
    protected readonly container;

    protected readonly equipment: ItemInputsGroup;

    constructor() {
        super();
        this.container = this.initContainer();

        this.equipment = this.initEquipment();
        for (const input of this.equipment)
            this.container.appendChild(input.holder());
    }

    private initContainer() {
        return document.createElement("div");
    }

    private initEquipment(): ItemInputsGroup {
        const equipment = this.getInputs();

        for (let i = 0; i < equipment.length; i++) {
            if (i > 0)
                equipment[i].addEventListener("focusUp", (powder) => equipment[i - 1].focusUp(powder));
            else
                equipment[i].addEventListener("focusUp", (powder) => this.focusUp(powder));
            if (i < equipment.length - 1)
                equipment[i].addEventListener("focusDown", (powder) => equipment[i + 1].focusDown(powder));
            else
                equipment[i].addEventListener("focusDown", (powder) => this.focusDown(powder));
            equipment[i].addEventListener("log", (payload) => this.dispatchEvent("log", payload));
        }

        return equipment;
    }

    protected abstract focusUp(powder: boolean): void

    protected abstract focusDown(powder: boolean): void

    protected focusLast(powder: boolean) {
        this.equipment[this.equipment.length - 1].focusUp(powder);
    }

    protected abstract getInputs(): ItemInput[];

    public holder() {
        return this.container;
    }

    public abstract getData(): any
}

export class TomeInputs extends ItemInputs {
    static names: ItemCategory[] = [
        "guild_tome", "lootrun_tome",
        "armour_tome", "armour_tome", "armour_tome", "armour_tome",
        "mysticism_tome", "mysticism_tome",
        "weapon_tome", "weapon_tome",
        "expertise_tome", "expertise_tome",
        "marathon_tome", "marathon_tome",
    ] as const;

    protected getInputs(): ItemInput[] {
        return TomeInputs.names.map(name =>
            new ItemInput(name, false, false, false));
    }

    protected focusUp(): void {
    }

    protected focusDown(): void {
    }

    public getData() {
        return this.equipment.map(input => input.getData());
    }
}

export class GearInputs extends ItemInputs {
    weapon: ItemInput;

    constructor() {
        super();

        this.weapon = this.initWeapon();
        this.container.appendChild(this.weapon.holder());
    }

    private initWeapon() {
        const input = new ItemInput("weapon", true, true);
        input.addEventListener("change", () => this.dispatchEvent("change"));
        input.addEventListener("focusUp", (powder) => this.focusLast(powder));
        input.addEventListener("log", (payload) => this.dispatchEvent("log", payload));
        return input;
    }

    protected getInputs(): ItemInput[] {
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

    protected focusUp(): void {
    }

    protected focusDown(powder: boolean) {
        this.weapon.focusDown(powder);
    }

    public getData() {
        return {
            weapon: this.weapon.getData(),
            equipment: this.equipment.map(input => input.getData()),
        };
    }
}