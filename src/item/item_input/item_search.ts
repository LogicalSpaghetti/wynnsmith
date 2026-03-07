import {itemDatabase} from "../../database/item_database.ts";
import type {ItemData} from "../item_types.ts";
import {mod} from "../../encoding/numbers.ts";
import type {ItemSlot} from "./item_input.ts";
import type {ItemCategory} from "../item.ts";

class ItemSearch {
    list: HTMLUListElement;

    private selection = -1;
    private options: string[] = [];
    private listElements: HTMLLIElement[] = [];

    target?: ItemSlot;

    constructor() {
        this.list = this.initList();
    }

    private initList() {
        const search = document.createElement("ul");
        search.classList.add("slot_ul");
        search.style.position = "absolute";
        search.hidden = true;
        return search;
    }

    public search(target: ItemSlot, text: string, category: ItemCategory) {
        this.selection = -1;
        this.target = target;

        const possibilities = itemDatabase.searchItemsInGroup(text, category);
        this.options = possibilities.map(option => option.name);

        if (!possibilities.length) {
            const li = document.createElement("li");
            li.classList.add("slot_li");
            li.textContent = "No results!";
            this.list.replaceChildren(li);
            return;
        }

        this.listElements =
            possibilities.map((itemData, i) => this.newSearchElement(itemData, i))
                .filter(li => li !== null);

        this.list.replaceChildren(...this.listElements);

        this.positionRelativeTo(target);

        this.list.hidden = false;
    }

    public hide() {
        this.list.hidden = true;
        this.target = undefined;
    }

    private newSearchElement(itemData: ItemData, index: number) {
        if (!itemData.rarity) return null;
        const li = document.createElement("li");
        li.classList.add("slot_li");
        li.dataset.rarity = itemData.rarity;
        li.dataset.name = itemData.name;
        li.textContent = itemData.name;
        li.addEventListener("mousedown", (e) => {
            e.preventDefault();
            this.confirmSelection(index);
        });
        li.addEventListener("mousemove", () => {
            this.moveSelection(index);
        });
        return li;
    }

    public confirmSelection(index: number = this.selection) {
        if (index === -1 || !this.target) return;
        this.target.changeInput(this.options[index] ?? "Error, please report");
        this.hide();
    }

    public tryConfirmSelection(index: number = this.selection) {
        if (index === -1 || !this.target) return false;
        this.confirmSelection(index);
        return true;
    }

    public moveSelection(index: number) {
        this.selection = index;
        for (let i = 0; i < this.list.children.length; i++) {
            const element = this.list.children[i] as HTMLElement;
            element.dataset.selected = String(i === this.selection);
            if (i === this.selection)
                element.scrollIntoView({
                    behavior: "instant",
                    block: "nearest",
                    inline: "nearest",
                });
        }
    }

    public shiftSelection(shift: number) {
        if (this.options.length === 0) return;
        this.moveSelection(mod(this.selection + shift, this.options.length));
    }

    private positionRelativeTo(target: ItemSlot) {
        const rect = target.getInputBoundingRect();
        this.list.style.left = rect.left + window.scrollX + "px";
        this.list.style.top = rect.bottom + window.scrollY + "px";
    }

    public holder() {
        return this.list;
    }
}

export const itemSearch = new ItemSearch();
document.body.appendChild(itemSearch.holder());