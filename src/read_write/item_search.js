`use strict`;

function getItemFromSearch(search) {
    let cleanSearch = snakeToTitle(search.substring(1, search.length)
        .replaceAll("%20", " ")
        .replaceAll("%27", "'")
        .replaceAll("+", " "));
    return getItem(cleanSearch) ?? getItem(search);
}

function getItem(itemName) {
    itemName = simplifyString(itemName);
    return allItems.find((item) => simplifyString(item.name) === itemName);
}

function getItemInGroup(groupName, itemName) {
    const item = getItem(itemName);
    if (!item) return null;
    if (item.subType === groupName || item.type === groupName) return item;
}

function searchForItemsInCategory(search, category) {
    return searchForItems(search).filter(item => item.type === category || item.subType === category);
}

function searchForItems(search) {
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
