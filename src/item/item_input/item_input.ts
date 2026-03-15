import {type ItemCategory} from "../item.ts";
import {itemDatabase} from "../../database/item_database.ts";
import type {ItemData} from "../item_types.ts";
import {Powders} from "../powders.ts";
import {hideHoverTooltip, renderHoverTooltip} from "../../hover_html/tooltip.ts";
import {type HistoryEvents, HistoryTarget} from "../../change_handling/history.ts";
import {getHoverTextForItem, snakeToTitle} from "../../hover_html/item_html.ts";
import {itemSearch} from "./item_search.ts";

type ItemSlotEvents = {
    change: void,
    focusUp: boolean,
    focusDown: boolean,
} & HistoryEvents

type ItemAltSlotsEvents = {
    change: void,
    hideAdd: void,
    showAdd: void,
    focusUp: boolean,
    focusDown: boolean,
} & HistoryEvents;

type ItemInputEvents = {
    change: void,
    focusUp: boolean,
    focusDown: boolean,
} & HistoryEvents;

type SlotData = {
    itemData: ItemData | null
    powders: Powders
}

type InputData = { primary: SlotData, alts: SlotData[] }

interface ItemInputState {
    inputValue: string;
    powderValue?: string;
}

// TODO: hotkey for adding another offhand
export class ItemSlot extends HistoryTarget<ItemSlotEvents> {
    private readonly container: HTMLSpanElement;
    private readonly input: HTMLInputElement;
    private readonly powderInput?: HTMLInputElement;

    private category;

    private itemData: ItemData | null = null;
    private powders: Powders = new Powders();
    private powderSlots = 0;

    private lastState: ItemInputState;

    constructor(category: ItemCategory, hasPowders: boolean) {
        super();
        this.category = category;

        const container = this.container = document.createElement("div");
        container.classList.add("input-row");

        container.appendChild(this.input = this.initInput(category));

        if (hasPowders) container.appendChild(this.powderInput = this.initPowderInput());

        this.lastState = this.getState();
    }

    private initInput(category: ItemCategory) {
        const input = document.createElement("input");
        input.classList.add("slot_input");
        input.placeholder = snakeToTitle(category);
        input.addEventListener("input", () => this.changeInput(this.input.value));
        input.addEventListener("blur", () => itemSearch.hide());
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                itemSearch.shiftSelection(e.key === "ArrowUp" ? -1 : 1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                itemSearch.confirmSelection();
            } else if (e.key === 'Tab') {
                if (itemSearch.tryConfirmSelection())
                    e.preventDefault();
            } else if (e.key === 'PageUp' || e.key === 'PageDown') {
                e.preventDefault();
                this.dispatchEvent(e.key === 'PageUp' ? "focusUp" : "focusDown", false);
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
            this.updatePowderDisabled();
        });
        powderInput.addEventListener('keydown', (e) => {
            if (e.key === 'PageUp' || e.key === 'PageDown') {
                e.preventDefault();
                this.dispatchEvent(e.key === 'PageUp' ? "focusUp" : "focusDown", true);
            }
        });
        return powderInput;
    }

    changeInput(newValue?: string, grabSearch = true) {
        this.changeValue(newValue, undefined, grabSearch);
    }

    changePowders() {
        if (!this.powderInput) return;
        this.changeValue(undefined, this.powderInput.value);
    }

    private changeValue(inputValue?: string, powderValue?: string, grabSearch = false) {
        if (inputValue == null && powderValue == null) return;

        // TODO: seems like ItemData and Powders are unnecessary?
        const before = this.lastState;
        const beforeItemData = this.itemData;
        const beforePowders = this.powders;

        if (inputValue) this.applyInputValue(inputValue, grabSearch);
        if (powderValue) this.applyPowderValue(powderValue);

        const after = this.getState();
        this.lastState = after;

        if (
            beforeItemData?.name === this.itemData?.name
            && before.powderValue === after.powderValue
            && this.powders.equals(beforePowders)
        ) return;

        this.dispatchEvent("log", {
            undo: () => this.applyState(before),
            redo: () => this.applyState(after),
        });

        this.dispatchEvent("change");
    }

    private getState(): ItemInputState {
        return {
            inputValue: this.itemData?.name ?? "",
            powderValue: this.powders.toString(),
        };
    }

    private applyState(state: ItemInputState) {
        this.applyInputValue(state.inputValue,
            false); // document.activeElement === this.input || document.activeElement === this.powderInput
        if (this.powderInput && state.powderValue !== undefined)
            this.applyPowderValue(state.powderValue);

        this.dispatchEvent("change");
    }

    private updatePowderSlots(newData: ItemData | null) {
        const powderInput = this.powderInput;
        if (!powderInput) return;
        const powderSlots = newData?.powderSlots ?? 0;
        if (powderSlots === this.powderSlots) return;
        this.powderSlots = powderSlots;

        powderInput.placeholder = `${powderSlots || "No"} Slots`;
        powderInput.maxLength = powderSlots * 2;

        this.updatePowderHighlight();
    }

    public applyInputValue(newValue?: string, grabSearch = true) {
        if (newValue != undefined) this.input.value = newValue;

        if (grabSearch) itemSearch.search(this, this.input.value, this.category);

        const newData = itemDatabase.getItemInGroup(this.input.value, this.category);

        this.itemData = newData;

        this.updatePowderSlots(newData);
        this.updateRarity(newData);
        this.updatePowderDisabled();
    }

    public applyPowderValue(value: string) {
        if (!this.powderInput) return;

        this.powderInput.value = value;

        this.powders = new Powders(value.substring(0, this.powderSlots * 2));

        this.updatePowderHighlight();
        this.updatePowderDisabled();
    }

    private updatePowderHighlight() {
        if (!this.powderInput) return;
        this.powderInput.dataset.warning = String(this.powderInput.value.length > 0
            && this.powderInput.value.length < this.powderSlots * 2);
        this.powderError();
    }

    private updatePowderDisabled() {
        if (!this.powderInput) return;
        this.powderInput.disabled = (this.powderSlots === 0 && this.powderInput.value === "");
    }

    private powderError() {
        if (!this.powderInput) return;
        this.powderInput.dataset.error = String(this.powderInput.value.length > this.powderSlots * 2);
    }

    private updateRarity(newData: ItemData | null) {
        this.input.dataset.rarity = newData?.rarity ?? "";
    }

    public focus(powders: boolean) {
        if (powders && this.powderInput && !this.powderInput.disabled)
            this.powderInput.focus();
        else this.input.focus();
    }

    public getData(): SlotData {
        return {
            itemData: this.itemData,
            powders: this.powders,
        };
    }

    public holder() {
        return this.container;
    }

    public getInputBoundingRect() {
        return this.input.getBoundingClientRect();
    }

    public changeCategory(category: ItemCategory) {
        if (this.category === category) return;
        this.category = category;
    }
}

class ItemIcon {
    public static defaultCategory = "archer";

    private readonly link: HTMLAnchorElement;
    private readonly icon: HTMLImageElement;

    private hoverText: string = "Invalid Item!";

    constructor(category: string) {
        this.link = this.initLink();
        this.link.appendChild(this.icon = this.initIcon());

        this.updateCategory(category);
    }

    private initLink() {
        const link = document.createElement("a");
        link.target = "_blank";
        link.tabIndex = -1;
        link.addEventListener("mouseover", () => renderHoverTooltip(this.hoverText));
        link.addEventListener("mouseout", () => hideHoverTooltip());

        return link;
    }

    private initIcon() {
        const img = document.createElement("img");
        img.style.paddingRight = "1px";
        return img;
    }

    public updateCategory(category: string) {
        this.icon.src = `img/cat_icon/${category ?? ItemIcon.defaultCategory}.png`;
    }

    public updateItem(itemData: ItemData) {
        this.hoverText = getHoverTextForItem(itemData, "Invalid Item!");
    }

    public holder() {
        return this.link;
    }
}

class ItemAltSlots extends HistoryTarget<ItemAltSlotsEvents> {
    static readonly maximumAlts = 3;
    static readonly maximumOffhands = 7;

    private readonly container: HTMLUListElement;
    private readonly slots: ItemSlot[] = [];

    private category: ItemCategory;
    private readonly hasPowders: boolean;
    private readonly isWeapon: boolean;

    constructor(category: ItemCategory, hasPowders: boolean, isWeapon: boolean) {
        super();
        this.category = category;
        this.hasPowders = hasPowders;
        this.isWeapon = isWeapon;

        this.container = document.createElement("ul");
        this.container.classList.add("alts-ul");
    }

    public addAlt() {
        let index = this.slots.length;

        const slotContainer = document.createElement("li");
        slotContainer.classList.add("input-row");

        const slot = new ItemSlot(this.category, this.hasPowders);
        slotContainer.appendChild(slot.holder());
        slot.addEventListener("change", () => this.dispatchEvent("change"));
        slot.addEventListener("log", (payload) => this.dispatchEvent("log", payload));
        slot.addEventListener("focusUp", (powder) => {
            index = this.slots.indexOf(slot);
            if (index > 0)
                this.slots[index - 1].focus(powder);
            else this.dispatchEvent("focusUp", powder);
        });
        slot.addEventListener("focusDown", (powder) => {
            index = this.slots.indexOf(slot);
            if (index < this.slots.length - 1)
                this.slots[index + 1].focus(powder);
            else this.dispatchEvent("focusDown", powder);
        });

        const delButton = document.createElement("button");
        delButton.textContent = "x";
        delButton.title = "Remove offhand";
        delButton.addEventListener("click", () => {
            index = this.slots.indexOf(slot);
            this.removeAlt(index, slotContainer, slot);
        });
        slotContainer.appendChild(delButton);

        this.spliceInAlt(index, slotContainer, slot);
        this.dispatchEvent("log", {
            undo: () => {
                index = this.slots.indexOf(slot);
                this.spliceOutAlt(index);
            },
            redo: () => this.spliceInAlt(index, slotContainer, slot),
        });
    }

    private removeAlt(index: number, slotContainer: HTMLLIElement, slot: ItemSlot) {
        this.spliceOutAlt(index);
        this.dispatchEvent("log", {
            undo: () => this.spliceInAlt(index, slotContainer, slot),
            redo: () => this.spliceOutAlt(index),
        });
    }

    private spliceInAlt(index: number, slotContainer: HTMLLIElement, slot: ItemSlot) {
        this.slots.splice(index, 0, slot);
        insertAt(this.container, index, slotContainer);

        if (this.slots.length >= (this.isWeapon ? ItemAltSlots.maximumOffhands : ItemAltSlots.maximumAlts))
            this.dispatchEvent("hideAdd");
    }

    private spliceOutAlt(index: number) {
        this.slots.splice(index, 1);
        deleteAt(this.container, index);

        this.dispatchEvent("showAdd");
    }

    focusUp(powders: boolean) {
        this.slots[this.slots.length - 1].focus(powders);
    }

    focusDown(powders: boolean) {
        this.slots[0].focus(powders);
    }

    public changeCategory(category: ItemCategory) {
        if (this.category === category) return;
        this.category = category;
        for (const slot of this.slots)
            slot.changeCategory(category);
    }

    public holder() {
        return this.container;
    }

    public getData(): SlotData[] {
        return this.slots.map(slot => slot.getData());
    }

    public hasSlots() {
        return this.slots.length > 0;
    }
}

// TODO: add indicator for powder special
export class ItemInput extends HistoryTarget<ItemInputEvents> {

    private readonly container;

    private readonly icon: ItemIcon;
    private readonly slot: ItemSlot;
    private readonly addButton?: HTMLButtonElement;

    private readonly alts: ItemAltSlots;

    private readonly isWeapon;

    constructor(category: ItemCategory, hasPowders: boolean, isWeapon = false, addButton = true) {
        super();
        this.isWeapon = isWeapon;

        const container = this.container = document.createElement("div");

        const inputContainer = this.initInputContainer();
        inputContainer.classList.add("input-row");
        container.appendChild(inputContainer);

        this.icon = new ItemIcon(category);
        inputContainer.appendChild(this.icon.holder());

        this.slot = this.initSlot(category, hasPowders);
        inputContainer.appendChild(this.slot.holder());

        if (addButton) {
            this.addButton = this.initAddButton(isWeapon);
            inputContainer.appendChild(this.addButton);
        }

        this.alts = this.initAlts(category, hasPowders, isWeapon);
        this.container.appendChild(this.alts.holder());
    }

    private initInputContainer() {
        return document.createElement("div");
    }

    private initSlot(category: ItemCategory, hasPowders: boolean) {
        const slot = new ItemSlot(category, hasPowders);
        slot.addEventListener("change", () => this.changePrimary());
        slot.addEventListener("log", (payload) => this.dispatchEvent("log", payload));
        slot.addEventListener("focusUp", (powders) => this.dispatchEvent("focusUp", powders));
        slot.addEventListener("focusDown", (powders) => this.focusDownFromInput(powders));
        return slot;
    }

    private initAddButton(isWeapon: boolean) {
        const button = document.createElement("button");
        button.textContent = "+";
        button.title = isWeapon ? "Add offhand" : "Add alternative";
        button.addEventListener("click", () => this.alts.addAlt());
        return button;
    }

    private initAlts(category: ItemCategory, hasPowders: boolean, isWeapon: boolean) {
        const alts = new ItemAltSlots(category, hasPowders, isWeapon);
        alts.addEventListener("change", () => this.dispatchEvent("change"));
        alts.addEventListener("log", (payload) => this.dispatchEvent("log", payload));
        alts.addEventListener("showAdd", () => this.addVisibility(false));
        alts.addEventListener("hideAdd", () => this.addVisibility(true));
        alts.addEventListener("focusUp", (powders) => this.focusSlot(powders));
        alts.addEventListener("focusDown", (powders) => this.dispatchEvent("focusDown", powders));
        return alts;
    }

    private addVisibility(hidden: boolean) {
        if (!this.addButton) return;
        this.addButton.hidden = hidden;
    }

    private changePrimary() {
        const data = this.slot.getData().itemData;
        if (data) {
            if (this.isWeapon)
                this.updateWeaponIcon(data);
            this.icon.updateItem(data);
            if (data.subType)
                this.alts.changeCategory(data.subType);
        }
        this.dispatchEvent("change");
    }

    private updateWeaponIcon(newData: ItemData) {
        if (!this.isWeapon || !newData.subType) return;
        this.icon.updateCategory(newData.subType);
    }

    public focusUp(powders: boolean) {
        if (this.alts.hasSlots()) this.alts.focusUp(powders);
        else this.focusSlot(powders);
    }

    public focusDown(powders: boolean) {
        this.focusSlot(powders);
    }

    private focusDownFromInput(powders: boolean) {
        if (this.alts.hasSlots()) this.alts.focusDown(powders);
        else this.dispatchEvent("focusDown", powders);
    }

    public focusSlot(powders: boolean) {
        this.slot.focus(powders);
    }

    public holder() {
        return this.container;
    }

    public getData(): InputData {
        return {
            primary: this.slot.getData(),
            alts: this.alts.getData(),
        };
    }
}

/**
 * Adds a child element to a parent element at a given index in the list of children.
 */
function insertAt(parent: HTMLElement, index: number, element: HTMLElement) {
    parent.insertBefore(element, parent.children[index] ?? null);
}

/**
 * Removes the child element of a parent element at a given index in the list of children.
 */
function deleteAt(parent: HTMLElement, index: number) {
    parent.removeChild(parent.children[index]);
}