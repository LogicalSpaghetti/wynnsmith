import {type HistoryEvents, HistoryTarget} from "../../change_handling/history.ts";
import {formattingSymbols, genericSymbols} from "../../hover_html/code_dictionary.ts";
import {minecraftAsElement} from "../../hover_html/minecraft_html.ts";

const elements = ["earth", "thunder", "water", "fire", "air"] as const;
type ElementName = "earth" | "thunder" | "water" | "fire" | "air";


type SPEvents = {
    change: void,
} & HistoryEvents;

class SkillPointInput extends HistoryTarget<SPEvents> {
    container: HTMLDivElement;

    totalDisplay: HTMLSpanElement;
    assignDisplay: HTMLSpanElement;

    input: HTMLInputElement;

    previousValue = "";

    constructor(element: ElementName) {
        super();

        const container = this.container = document.createElement("div");
        container.classList.add("sp-holder");

        const icon = minecraftAsElement(genericSymbols[element] + formattingSymbols.bold);
        icon.classList.add("font-minecraft");
        container.appendChild(icon);

        const total = this.totalDisplay = document.createElement("span");
        total.textContent = "0";
        total.classList.add(element);
        container.appendChild(total);

        const assignDiv = document.createElement("div");
        assignDiv.classList.add("small-font");

        const assign = this.assignDisplay = document.createElement("span");
        assign.textContent = "0";
        assignDiv.appendChild(document.createTextNode("Assign: "));
        assignDiv.appendChild(assign);

        container.appendChild(assignDiv);

        const modifyDiv = document.createElement("div");
        modifyDiv.classList.add("small-font");
        modifyDiv.appendChild(document.createTextNode("Modify: "));
        container.appendChild(modifyDiv);

        container.appendChild(this.input = this.initInput());
    }

    private initInput() {
        const input = document.createElement("input");
        input.classList.add("sp-input");
        input.placeholder = "0";
        input.autocomplete = "off";

        input.addEventListener("change", () => this.changeSP());

        return input;
    }

    private changeSP() {
        const previousValue = this.previousValue;
        const nextValue = this.previousValue = this.input.value;

        this.dispatchEvent("log", {
            undo: () => this.setSP(previousValue),
            redo: () => this.setSP(nextValue),
        });
    }

    private setSP(value: string) {
        this.input.value = value;
        this.dispatchEvent("change");
    }

    public holder() {
        return this.container;
    }
}

export class SkillPointInputs extends HistoryTarget<SPEvents> {
    container: HTMLDivElement;

    inputs: SkillPointInput[] = [];

    constructor() {
        super();

        const container = this.container = document.createElement("div");
        container.classList.add("sp-sections");

        for (const element of elements) {
            const input = this.initInput(element)
            this.inputs.push(input);
            container.appendChild(input.holder());
        }
    }

    private initInput(element: ElementName) {
        const input = new SkillPointInput(element);
        input.addEventListener("log", (log) => this.dispatchEvent("log", log));
        input.addEventListener("change", () => this.dispatchEvent("change"))
        return input;
    }

    public holder() {
        return this.container;
    }
}
