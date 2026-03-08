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

        input.addEventListener("input", () => this.changeSP(input.value));

        return input;
    }

    private changeSP(value: string) {
        const previousValue = this.previousValue;
        this.setSP(value);
        const newValue = value;
        this.previousValue = newValue;

        this.dispatchEvent("log", {
            undo: () => this.setSP(previousValue),
            redo: () => this.setSP(newValue),
        });
    }

    public display(assigned: number, total: number) {
        this.assignDisplay.textContent = assigned.toString();
        this.totalDisplay.textContent = total.toString();
    }

    private setSP(value: string) {
        this.input.value = value;
        this.dispatchEvent("change");
    }

    public getData() {
        return parseInt(this.input.value || "0");
    }

    public holder() {
        return this.container;
    }
}

export class SkillPointInputs extends HistoryTarget<SPEvents> {
    container: HTMLDivElement;
    inputsContainer: HTMLDivElement;

    inputs: SkillPointInput[] = [];

    remaining: HTMLSpanElement;

    constructor() {
        super();

        const container = this.container = document.createElement("div");
        const inputsContainer = this.inputsContainer = document.createElement("div");
        inputsContainer.classList.add("sp-sections");

        for (const element of elements) {
            const input = this.initInput(element);
            this.inputs.push(input);
            inputsContainer.appendChild(input.holder());
        }

        container.appendChild(inputsContainer);

        this.remaining = document.createElement("span");
        this.remaining.textContent = "200";
        this.remaining.classList.add("positive");

        container.appendChild(document.createTextNode("Remaining SP: "));
        container.appendChild(this.remaining);
    }

    public display(assigned: number[], total: number[], remaining: number) {
        this.inputs.forEach((input, i) => input.display(assigned[i], total[i]));

        this.remaining.textContent = String(remaining);

        const positive = remaining >= 0;
        this.remaining.classList.toggle("positive", positive);
        this.remaining.classList.toggle("negative", !positive);
    }

    private initInput(element: ElementName) {
        const input = new SkillPointInput(element);
        input.addEventListener("log", (log) => this.dispatchEvent("log", log));
        input.addEventListener("change", () => this.dispatchEvent("change"));
        return input;
    }

    public getData() {
        return this.inputs.map(input => input.getData());
    }

    public holder() {
        return this.container;
    }
}
