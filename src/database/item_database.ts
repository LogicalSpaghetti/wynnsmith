import type {ItemData} from "../item/item_types.ts";
import {Database} from "./database.ts";
import type {ItemCategory} from "../item/item.ts";
import {snakeToTitle} from "../hover_html/item_html.ts";

class ItemSearch extends Database<(ItemData | null)[]> {
    private static readonly filePath = "items.json";

    private constructor(items: (ItemData | null)[]) {
        super(items, ItemSearch.filePath);
    }

    static async create(): Promise<ItemSearch> {
        const db = await Database.init<(ItemData | null)[]>(ItemSearch.filePath);
        return new ItemSearch(db.get());
    }

    find(str: string, byName: boolean) {
        str = simplifyString(str);
        return this.entries.find(item => item &&
            simplifyString(byName ? item.name : item.internalName) === str) ?? null;
    }

    getItemByName(search: string): ItemData | null {
        if (!search) return null;
        let cleanSearch = snakeToTitle(search.substring(1, search.length)
            .replaceAll("%20", " ")
            .replaceAll("%27", "'")
            .replaceAll("+", " "));
        return this.getItemByExactName(cleanSearch) ?? this.getItemByExactName(search);
    }

    getItem(internalName: string): ItemData | null {
        return this.find(internalName, false);
    }

    getItemByExactName(itemName: string): ItemData | null {
        return this.find(itemName, true);
    }

    getItemById(id: number): ItemData | null {
        if (id < 0 || id >= this.entries.length) return null
        return this.entries[id]
    }

    getItemInGroup(search: string, category: ItemCategory): ItemData | null {
        const item = this.getItemByExactName(search);
        return item?.subType === category || item?.type === category
            ? item : null;
    }

    searchItemsInGroup(search: string, category: ItemCategory): ItemData[] {
        return this.searchItems(search).filter(item => item.type === category || item.subType === category);
    }

    searchItems(search: string): ItemData[] {
        if (search == null) return [];
        const simplifiedSearch = simplifyString(search);
        return this.entries.filter((item): item is ItemData =>
            item !== null && simplifyString(item.name).includes(simplifiedSearch));
    }

    getSize() {
        return this.entries.length;
    }
}

export const itemDatabase = await ItemSearch.create();

function simplifyString(string: string): string {
    return removeInvalidCharacters(string.toLowerCase()).trim();
}

function removeInvalidCharacters(string: string) {
    return string.replace(/[^A-Za-z0-9\-]/g, '');
}
