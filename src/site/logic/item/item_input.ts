import {type ItemCategory} from "./item.ts";
import {snakeToTitle} from "../../common/display_item";
import {itemDatabase} from "./item_search.ts";
import type {NormalItemType} from "./item_types.ts";
import {Powders} from "./powders.ts";
import {hideHoverAbilityTooltip, renderHoverTooltip} from "../../common/tooltip";
import {getHoverTextForItem} from "../../common/minecraft_html";

export class ItemInput {
    static readonly defaultWeaponIcon = "archer";

    readonly container;
    readonly link;
    readonly icon: HTMLImageElement;
    readonly inputContainer;
    readonly input: HTMLInputElement;
    readonly selector;
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


        const link = container.appendChild(this.link = this.initLink());
        link.appendChild(this.icon = this.initIcon());

        const inputContainer = container.appendChild(this.inputContainer = this.initInputContainer());

        inputContainer.appendChild(this.input = this.initInput(category));
        inputContainer.appendChild(document.createElement("br"));
        inputContainer.appendChild(this.selector = this.initSelector());

        if (hasPowders) container.appendChild(this.powderInput = this.initPowderInput());
    }

    private initInputContainer() {
        return document.createElement("span");
    }

    private initLink() {
        const link = document.createElement("a");
        link.target = "_blank";
        link.tabIndex = -1;
        link.addEventListener("mouseover", () => renderHoverTooltip(getHoverTextForItem(this.itemData, "Invalid Item!")));
        link.addEventListener("mouseout", () => hideHoverAbilityTooltip());

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

    private initSelector() {
        const selector = document.createElement("ul");
        selector.classList.add("slot_ul");
        selector.style.position = "absolute";
        const li = document.createElement("li")
        li.classList.add("slot_li");

        li.textContent = "hello"
        li.dataset.rarity = "mythic"
        selector.appendChild(li);
        return selector;
    }

    private changeInput() {
        const newData = itemDatabase.getItemByName(this.input.value);
        if (newData === this.itemData) return;
        this.itemData = newData;
        if (newData) {
            this.updateWeaponIcon(newData);
            this.updatePowderSlots(newData);
        }
        this.updateRarity(newData);
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

    private updateRarity(newData: NormalItemType | null) {
        this.input.dataset.rarity = newData && "rarity" in newData ? newData.rarity : "";
    }

    private updatePowderSlots(newData: NormalItemType) {
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
