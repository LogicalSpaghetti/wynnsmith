import {type ItemCategory} from "./item.ts";
import {snakeToTitle} from "../../common/display_item";
import {itemDatabase} from "./item_search.ts";
import type {NormalItemType} from "./item_types.ts";
import {Powders} from "./powders.ts";

export class ItemInput {
    static readonly defaultWeaponIcon = "archer";

    readonly container;
    readonly link;
    readonly icon: HTMLImageElement;
    readonly input: HTMLInputElement;
    readonly powderInput?: HTMLInputElement;

    readonly category;
    readonly onChange;
    readonly isWeapon;

    itemData: NormalItemType | null = null;
    powders: Powders = new Powders();
    private powderSlots = 0;

    constructor(category: ItemCategory, hasPowders: boolean, isWeapon: boolean, onChange: () => void) {
        this.category = category;
        this.onChange = onChange;
        this.isWeapon = isWeapon;

        const container = this.container = document.createElement("div");
        container.classList.add("input_cluster");

        container.appendChild(this.link = this.initLink());
        this.link.appendChild(this.icon = this.initIcon());

        container.appendChild(this.input = this.initInput(category));
        if (hasPowders) container.appendChild(this.powderInput = this.initPowderInput());
    }

    private initLink() {
        const link = document.createElement("a");
        link.target = "_blank";
        link.tabIndex = -1;
        return link;
    }

    private initIcon() {
        const img = document.createElement("img");
        img.src = `img/cat_icon/${this.category}.png`;
        return img;
    }

    private initInput(category: ItemCategory) {
        const input = document.createElement("input");
        input.classList.add("slot_input");
        input.placeholder = snakeToTitle(category);
        input.addEventListener("input", () => this.changeInput());
        return input;
    }

    private initPowderInput() {
        const powderInput = document.createElement("input");
        powderInput.classList.add("powder_input");
        powderInput.placeholder = "No Slots";
        powderInput.disabled = true;
        powderInput.addEventListener("input", () => this.changePowders());
        return powderInput;
    }

    private changeInput() {
        const newData = itemDatabase.getItemByName(this.input.value);
        if (newData === this.itemData) return;
        this.itemData = newData;
        if (newData) {
            this.updateWeaponIcon(newData);
            this.updatePowderSlots(newData);
        }
        this.onChange();
    }

    private changePowders() {
        if (!this.powderInput) return;
        const newPowders = new Powders(this.powderInput.value);
        if (this.powders.equals(newPowders)) return;
        this.powders = newPowders;
        this.onChange();
    }

    private updateWeaponIcon(newData: NormalItemType) {
        if (!this.isWeapon) return;
        const name = "requirements" in newData && "classRequirement" in newData.requirements
            ? newData.requirements.classRequirement!
            : ItemInput.defaultWeaponIcon;
        this.icon.src = `img/cat_icon/${name}.png`;
    }

    updatePowderSlots(newData: NormalItemType) {
        const powderInput = this.powderInput;
        if (!powderInput) return;
        const powderSlots = "powderSlots" in newData ? newData.powderSlots! : 0;
        if (powderSlots === this.powderSlots) return;
        this.powderSlots = powderSlots;

        if (powderSlots === 0) {
            powderInput.placeholder = "No Slots";
            powderInput.maxLength = 0;
            powderInput.value = "";
            powderInput.disabled = true;
            return;
        }

        powderInput.disabled = false;

        powderInput.placeholder = `${powderSlots} Slots`;

        const maxLen = powderSlots * 2;
        powderInput.maxLength = maxLen;
        if (powderInput.value.length > maxLen)
            powderInput.value = powderInput.value.substring(0, maxLen);
    }
}
