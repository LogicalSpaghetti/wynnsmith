`use strict`;

function getItemFromSearch(search) {
    let cleanSearch = search.substring(1, search.length)
        .replaceAll("%20", " ")
        .replaceAll("_", " ")
        .replaceAll("%27", "'")
        .replaceAll("+", " ");
    return getItem(cleanSearch) ?? getItem(search);
}

function getItem(itemName) {
    return allItems.find((item) => item.name === itemName);
}

function getItemInGroup(groupName, itemName) {
    const item = getItem(itemName);
    if (!item) return;
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
    return removeNonLetters(string.toLowerCase());
}

function removeNonLetters(string) {
    return string.replace(/[^a-z0-9\-]/g, '');
}
