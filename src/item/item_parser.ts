import {GearInputs, TomeInputs} from "./item_input/item_inputs.ts";
import {SkillPointInputs} from "./skill_point/skill_point_input.ts";
import {type HistoryEvents, HistoryTarget} from "../change_handling/history.ts";
import {solveSP} from "./skill_point/verifier.ts";

type ParserEvents = {
    change: void
} & HistoryEvents;

export class ItemParser extends HistoryTarget<ParserEvents> {
    itemInputs: GearInputs;
    tomeInputs: TomeInputs;
    spInput: SkillPointInputs;

    constructor() {
        super();
        this.itemInputs = this.initItems();
        this.tomeInputs = this.initTomes();
        this.spInput = this.initSP();
    }

    private initItems() {
        const items = new GearInputs();
        items.addEventListener("change", () => this.changeBuild());
        items.addEventListener("log", (payload) => this.dispatchEvent("log", payload));
        return items;
    }

    private initTomes() {
        const tomes = new TomeInputs();
        tomes.addEventListener("change", () => this.changeBuild());
        tomes.addEventListener("log", (payload) => this.dispatchEvent("log", payload));
        return tomes;
    }

    private initSP() {
        const sp = new SkillPointInputs();
        sp.addEventListener("change", () => this.changeBuild());
        sp.addEventListener("log", (payload) => this.dispatchEvent("log", payload));
        return sp;
    }

    private changeBuild() {
        const items = this.itemInputs.getData();
        const tomes = this.tomeInputs.getData();
        const spAdded = this.spInput.getData();

        const weapon = items.weapon.primary.itemData;
        if (!weapon) return; // TODO
        const alts = items.weapon.alts
            .map((alt) => alt.itemData)
            .filter(a => a !== null);
        const gear = items.equipment.concat(tomes)
            .map(item => item.primary.itemData)
            .filter(a => a !== null);

        const {assigned: minAssigned, given} = solveSP(weapon, alts, gear);
        const assigned = minAssigned.map((x, i) => x + spAdded[i]);
        const total = assigned.map((x, i) => x + given[i]);

        this.displaySP(assigned, total);
    }

    private displaySP(assigned: number[], total: number[]) {
        const remaining = 200 - assigned.reduce((a, b) => a + b);
        this.spInput.display(assigned, total, remaining);
    }

    public itemHolder() {
        return this.itemInputs.holder();
    }

    public tomeHolder() {
        return this.tomeInputs.holder();
    }

    public spHolder() {
        return this.spInput.holder();
    }
}
