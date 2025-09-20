import allItems from "../data/items.js";
import {snakeToTitle} from "./display_item.js";

export function getItemFromSearch(search) {
    let cleanSearch = snakeToTitle(search.substring(1, search.length)
        .replaceAll("%20", " ")
        .replaceAll("%27", "'")
        .replaceAll("+", " "));
    return getItemByName(cleanSearch) ?? getItemByName(search);
}

export function getItemByName(itemName) {
    if (!itemName) return null;
    itemName = simplifyString(itemName);
    return allItems.find((item) => simplifyString(item.name) === itemName);
}

export function getItem(internalName) {
    return allItems.find((item) => simplifyString(item.internalName) === internalName);
}

export function getItemInGroup(groupName, itemName) {
    const item = getItemByName(itemName);
    if (!item) return null;
    if (item.subType === groupName || item.type === groupName) return item;
}

export function searchForItemsInCategory(search, category) {
    return searchForItems(search).filter(item => item.type === category || item.subType === category);
}

export function searchForItems(search) {
    if (search == null) return [];
    const simplifiedSearch = simplifyString(search);
    return allItems.filter((item) => simplifyString(item.name).includes(simplifiedSearch));
}

function simplifyString(string) {
    return removeInvalidCharacters(string.toLowerCase()).trim();
}

function removeInvalidCharacters(string) {
    return string.replace(/[^A-Za-z0-9\-]/g, '');
}
