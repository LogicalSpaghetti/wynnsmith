import {snakeToTitle} from "../../common/display_item.js";
import type {NormalItemType} from "./item_types.ts";
import {loadItems} from "../database/database.ts";

class ItemDatabase {
    private items: NormalItemType[];

    private constructor(items: NormalItemType[]) {
        this.items = items;
    }

    static async create(version?: number): Promise<ItemDatabase> {
        const items = await loadItems(version);
        return new ItemDatabase(items);
    }

    get(): NormalItemType[] {
        return this.items;
    }

    async set(version: number | undefined) {
        return this.items = await loadItems(version);
    }

    size(): number {
        return this.items.length;
    }
}

const itemDatabase = ItemDatabase.create();

export function getItemFromSearch(search: string): NormalItemType | null {
    if (!search) return null;
    let cleanSearch = snakeToTitle(search.substring(1, search.length)
        .replaceAll("%20", " ")
        .replaceAll("%27", "'")
        .replaceAll("+", " "));
    return getItemByName(cleanSearch) ?? getItemByName(search);
}

export function getItemByName(itemName: string): NormalItemType | null {
    if (!itemName) return null;
    itemName = simplifyString(itemName);
    return allItems.find(item => simplifyString(item.name) === itemName);
}

export function getItem(internalName: string): NormalItemType | null {
    return allItems.find((item) => simplifyString(item.internalName) === internalName);
}

export function getItemInGroup(groupName: string, itemName: string): NormalItemType | null {
    const item = getItemByName(itemName);
    return item?.subType === groupName || item?.type === groupName
        ? item : null;
}

export function searchForItemsInCategory(search, category): (NormalItemType | null)[] {
    return searchForItems(search).filter(item => item.type === category || item.subType === category);
}

export function searchForItems(search): (NormalItemType | null)[] {
    if (search == null) return [];
    const simplifiedSearch = simplifyString(search);
    return allItems.filter((item) => simplifyString(item.name).includes(simplifiedSearch));
}

function simplifyString(string): string {
    return removeInvalidCharacters(string.toLowerCase()).trim();
}

function removeInvalidCharacters(string: string) {
    return string.replace(/[^A-Za-z0-9\-]/g, '');
}
