import {snakeToTitle} from "../../common/display_item.js";
import type {NormalItemType} from "./item_types.ts";
import {Database} from "../database/database.ts";
import type {ItemSubType, ItemTypeType} from "../../../generated/item_types.ts";

class ItemSearch extends Database<NormalItemType[]> {
    private static readonly filePath = "items.json";

    private constructor(items: NormalItemType[]) {
        super(items, ItemSearch.filePath);
    }

    static async create(): Promise<ItemSearch> {
        const db = await Database.init<NormalItemType[]>(ItemSearch.filePath);
        return new ItemSearch(db.get());
    }

    find(str: string, byName: boolean) {
        str = simplifyString(str);
        return this.items.find(item =>
            simplifyString(byName ? item.name : item.internalName) === str) ?? null;
    }

    getItemByName(search: string): NormalItemType | null {
        if (!search) return null;
        let cleanSearch = snakeToTitle(search.substring(1, search.length)
            .replaceAll("%20", " ")
            .replaceAll("%27", "'")
            .replaceAll("+", " "));
        return this.getItemByExactName(cleanSearch) ?? this.getItemByExactName(search);
    }

    getItem(internalName: string): NormalItemType | null {
        return this.find(internalName, false);
    }

    getItemByExactName(itemName: string): NormalItemType | null {
        return this.find(itemName, true);
    }

    getItemById(id: number): NormalItemType | null {
        if (id < 0 || id >= this.items.length) return null
        return this.items[id]
    }

    getItemInGroup(groupName: string, itemName: string): NormalItemType | null {
        const item = this.getItemByExactName(itemName);
        return item?.subType === groupName || item?.type === groupName
            ? item : null;
    }

    getItemsInCategory(search: string, category: ItemTypeType | ItemSubType): NormalItemType[] {
        return this.getItems(search).filter(item => item.type === category || item.subType === category);
    }

    getItems(search: string): NormalItemType[] {
        if (search == null) return [];
        const simplifiedSearch = simplifyString(search);
        return this.items.filter((item) => simplifyString(item.name).includes(simplifiedSearch));
    }

    getSize() {
        return this.items.length;
    }
}

export const itemDatabase = await ItemSearch.create();

function simplifyString(string: string): string {
    return removeInvalidCharacters(string.toLowerCase()).trim();
}

function removeInvalidCharacters(string: string) {
    return string.replace(/[^A-Za-z0-9\-]/g, '');
}
