`use strict`;

function getItem(itemName) {
    return allItems.find((item) => item.name === itemName);
}

function getItemInGroup(groupName, itemName) {
    const item = getItem(itemName);
    console.log(item);
    console.log(groupName);
    if (!item) return;
    if (item.subType === groupName || item.type === groupName) return item;
}