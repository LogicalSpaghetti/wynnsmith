import {type ItemCategory} from "./item.ts";
import {snakeToTitle} from "../../common/display_item";
import {itemDatabase} from "./item_search.ts";
import type {NormalItemData} from "./item_types.ts";
import {Powders} from "./powders.ts";
import {hideHoverTooltip, renderHoverTooltip} from "../../common/tooltip";
import {getHoverTextForItem} from "../../common/minecraft_html";
import {mod} from "../../common/numbers.ts";
import {TypedEventTarget} from "../../common/event.ts";

type ItemInputEvents = {
    change: void,
    delete: void,
}

type WeaponInputEvents = ItemInputEvents & {
    morph: void
}

// TODO: add indicator for powder special
export class ItemInput<Events extends ItemInputEvents = ItemInputEvents> extends TypedEventTarget<Events> {
    static readonly defaultWeaponIcon = "archer";
    static readonly maximumOptions = 4;

    readonly container;
    readonly link;
    readonly icon: HTMLImageElement;
    readonly inputContainer;
    readonly input: HTMLInputElement;
    readonly search;
    readonly powderInput?: HTMLInputElement;
    readonly deleteButton?: HTMLButtonElement;

    readonly category;
    readonly isWeapon;

    itemData: NormalItemData | null = null;
    powders: Powders = new Powders();
    private powderSlots = 0;

    private selection = -1;
    private options = 0;

    constructor(category: ItemCategory, hasPowders: boolean, isWeapon: boolean, removeable = false) {
        super();
        this.category = category;
        this.isWeapon = isWeapon;

        const container = this.container = document.createElement("div");
        container.classList.add("input_cluster");

        const link = container.appendChild(this.link = this.initLink());
        link.appendChild(this.icon = this.initIcon());

        const inputContainer = container.appendChild(this.inputContainer = this.initInputContainer());

        inputContainer.appendChild(this.input = this.initInput(category));
        inputContainer.appendChild(document.createElement("br"));
        inputContainer.appendChild(this.search = this.initSearch());

        if (hasPowders) container.appendChild(this.powderInput = this.initPowderInput());

        if (removeable) container.appendChild(this.deleteButton = this.initDeleteButton());
    }

    private initInputContainer() {
        return document.createElement("span");
    }

    private initLink() {
        const link = document.createElement("a");
        link.target = "_blank";
        link.tabIndex = -1;
        link.addEventListener("mouseover", () => renderHoverTooltip(getHoverTextForItem(this.itemData, "Invalid Item!")));
        link.addEventListener("mouseout", () => hideHoverTooltip());

        return link;
    }

    private initIcon() {
        const img = document.createElement("img");
        img.style.paddingRight = "1px";
        img.src = `img/cat_icon/${this.category}.png`;
        return img;
    }

    private initInput(category: ItemCategory) {
        const input = document.createElement("input");
        input.classList.add("slot_input");
        input.placeholder = snakeToTitle(category);
        input.addEventListener("input", () => this.changeInput());
        input.addEventListener("blur", () => {
            this.hideSearch();
            this.clipPowders();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.shiftSelection(e.key);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.selectLi();
            }
        });
        return input;
    }

    private initPowderInput() {
        const powderInput = document.createElement("input");
        powderInput.classList.add("powder_input");
        powderInput.placeholder = "No Slots";
        powderInput.disabled = true;
        powderInput.addEventListener("input", () => {
            this.changePowders();
            this.updatePowderHighlight();
        });
        return powderInput;
    }

    private initSearch() {
        const search = document.createElement("ul");
        search.classList.add("slot_ul");
        search.style.position = "absolute";
        search.hidden = true;
        const li = document.createElement("li");
        li.classList.add("slot_li");

        li.textContent = "hello";
        li.dataset.rarity = "mythic";
        search.appendChild(li);
        return search;
    }

    changeInput(newValue?: string, updateSearch = true) {
        if (newValue) this.input.value = newValue;
        if (updateSearch) this.updateSearch();
        const newData = itemDatabase.getItemInGroup(this.input.value, this.category);
        if (newData === this.itemData) return;
        this.itemData = newData;
        if (newData) this.updateWeaponIcon(newData);
        this.updatePowderSlots(newData);
        this.updateRarity(newData);
        this.dispatchEvent("change");
    }

    private updateWeaponIcon(newData: NormalItemData) {
        if (!this.isWeapon) return;
        const name = "requirements" in newData && "classRequirement" in newData.requirements
            ? newData.requirements.classRequirement!
            : ItemInput.defaultWeaponIcon;
        this.icon.src = `img/cat_icon/${name}.png`;
    }

    private updateRarity(newData: NormalItemData | null) {
        this.input.dataset.rarity = newData && "rarity" in newData ? newData.rarity : "";
    }

    private changePowders() {
        if (!this.powderInput) return;
        const newPowders = new Powders(this.powderInput.value.substring(0, this.powderSlots * 2));
        this.powderError(newPowders);
        if (this.powders.equals(newPowders)) return;
        this.powders = newPowders;
        this.dispatchEvent("change");
    }

    private powderError(powders = this.powders) {
        if (!this.powderInput) return;
        this.powderInput.dataset.error = String(powders.powders.length * 2 !== this.powderInput.value.length);
    }

    private updatePowderSlots(newData: NormalItemData | null) {
        const powderInput = this.powderInput;
        if (!powderInput) return;
        const powderSlots = newData && "powderSlots" in newData ? newData.powderSlots! : 0;
        if (powderSlots === this.powderSlots) return;
        this.powderSlots = powderSlots;

        powderInput.placeholder = `${powderSlots || "No"} Slots`;
        powderInput.maxLength = powderSlots * 2;
        powderInput.disabled = powderSlots === 0;

        this.updatePowderHighlight();
    }

    private updatePowderHighlight() {
        if (!this.powderInput) return;
        this.powderInput.dataset.warning = String(this.powderInput.value.length !== this.powderSlots * 2);
        this.powderError();
    }

    private clipPowders() {
        if (!this.powderInput) return;
        if (this.powderInput.value.length > this.powderSlots * 2) {
            this.powderInput.value = this.powderInput.value.substring(0, this.powderSlots * 2);
        }
        this.changePowders();
        this.updatePowderHighlight();
    }

    private updateSearch() {
        this.search.hidden = false;
        const possibilities = itemDatabase.searchItemsInGroup(this.input.value, this.category);
        this.options = possibilities.length;
        this.selection = -1;
        if (!possibilities.length) {
            const li = document.createElement("li");
            li.classList.add("slot_li");
            li.textContent = "No results!";
            this.search.replaceChildren(li);
            return;
        }

        this.search.replaceChildren(...possibilities
            .map((itemData, i) => this.newSearchElement(itemData, i)));
    }

    private newSearchElement(itemData: NormalItemData, index: number) {
        if (!("rarity" in itemData)) return "";
        const li = document.createElement("li");
        li.classList.add("slot_li");
        li.dataset.rarity = itemData.rarity;
        li.dataset.name = itemData.name;
        li.textContent = itemData.name;
        li.addEventListener("mousedown", (e) => {
            e.preventDefault();
            this.selectLi(index);
        });
        li.addEventListener("mousemove", () => {
            this.moveSelection(index);
        });
        return li;
    }

    private hideSearch() {
        this.search.hidden = true;
    }

    private shiftSelection(key: string) {
        if (this.options === 0) return;
        this.moveSelection(mod(this.selection + (key === "ArrowUp" ? -1 : 1), this.options));
    }

    private moveSelection(index: number) {
        this.selection = index;
        for (let i = 0; i < this.search.children.length; i++) {
            const element = this.search.children[i] as HTMLElement;
            element.dataset.selected = String(i === this.selection);
            if (i === this.selection)
                element.scrollIntoView({
                    behavior: "instant",
                    block: "nearest",
                    inline: "nearest",
                });
        }
    }

    private selectLi(index: number = this.selection) {
        if (index === -1) return;
        this.changeInput((this.search.children[index] as HTMLElement).dataset.name ?? "Error, please report");
        this.hideSearch();
    }

    private initDeleteButton() {
        const button = document.createElement("button");
        button.textContent = "x";
        button.title = "Remove offhand";
        button.addEventListener("click", () => this.dispatchEvent("delete"));
        return button;
    }
}

export class WeaponInput extends ItemInput<WeaponInputEvents> {
    constructor(category: ItemCategory, hasPowders: boolean, isWeapon: boolean, removeable = false) {
        super(category, hasPowders, isWeapon, removeable);
    }

    override changeInput(newValue?: string) {
        if (newValue) this.input.value = newValue;
        if (!this.deleteButton) // Ensures morphing only applies to primary weapon inputs.
            if (this.input.value.toLowerCase().includes("morph-")) {
                this.input.value = this.input.value.replace(/morph-/i, "");
                this.dispatchEvent("morph");
            }
        super.changeInput();
    }
}
