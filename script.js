`use strict`;

// elements
const testButton = document.querySelector(`.btn--test`);



const output = document.querySelector(`.output--A`);

var currentClass = "";
const classes = ["warrior", "shaman", "mage", "assassin", "archer"];

const inputs = [
    document.querySelector(`.input--helmet`),
    document.querySelector(`.input--chestplate`),
    document.querySelector(`.input--leggings`),
    document.querySelector(`.input--boots`),
    document.querySelector(`.input--ring0`),
    document.querySelector(`.input--ring1`),
    document.querySelector(`.input--bracelet`),
    document.querySelector(`.input--necklace`),
    document.querySelector(`.input--weapon`),
];

const sound = new Audio("sounds/mythic_old.ogg");
testButton.addEventListener("click", function () {
    sound.play();
});

const displayToggles = document.querySelectorAll(".toggle");
displayToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
        const display = document.querySelector('.display--' + toggle.dataset.slot);
        const fontHeight = parseInt(window.getComputedStyle(display, null).getPropertyValue('font-size'));
        const itemData = display.textContent;
        const height = ((itemData.split("\n").length - 1) + 3) * fontHeight;
        display.style = 'height: ' + height + 'px;';

        toggle.classList.toggle('rotate')
        document.querySelector('.display--' + toggle.dataset.slot).classList.toggle('collapse')
    });
});



const addAllItemData = function () {
    // resets the buttons if they were clicked
    copyLongButton.textContent = copyLongButton.dataset["default"];
    copyShortButton.textContent = copyShortButton.dataset["default"];

    const groupedStats = {};

    addBasePlayerStats(groupedStats);

    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        addItemToCombined(input, groupedStats);
    }

    // this stat is incorrectly listed on one item in the API, and should be ignored
    delete groupedStats["mainAttackFireDamage"];

    combineStats(groupedStats);

    output.textContent = formatCombined("Build statistics:\n", groupedStats);

    return groupedStats;
};

function formatCombined(message, groupedStats) {
    var combinedString = message;
    const keys = Object.keys(groupedStats);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        combinedString += key + ": " + groupedStats[key] + "\n";
    }
    return combinedString;
}

const addBasePlayerStats = function (groupedStats) {
    groupedStats["sumHealth"] = 535;
};

const addItemToCombined = function (input, groupedStats) {
    const item = getItemByInput(input);
    if (item === undefined) return;

    addCategory(groupedStats, item, "base");
    addCategory(groupedStats, item, "identifications");
};

function getItemByInput(input) {
    const itemCategory = itemGroups[input.dataset["slot"].replace('0','').replace('1','')];

    if (itemCategory === undefined) return;
    return itemCategory[input.value];
}

const addCategory = function (groupedStats, item, subObjectName) {
    if (item[subObjectName] === undefined) return;
    const subObject = Object.entries(item[subObjectName]);

    for (let i = 0; i < subObject.length; i++) {
        const id = subObject[i];

        var result = id[1];
        if (!Number.isInteger(id[1])) {
            result = result["max"];
        }

        groupedStats[id[0]] = groupedStats[id[0]] === undefined ? result : groupedStats[id[0]] + result;
    }
};

// document.addEventListener() can be used to catch inputs on a global level

// called when the page finishes loading
window.addEventListener("load", function () {
    loadBuildFromLink();

    addInputEventListeners();
    addTreeEventListener();
    refreshOutputs();

});

function refreshOutputs() {
    addAllItemData();
    refreshAbilityTree();
}

// adds eventListeners to all inputs, such that when they're modified, it updates the build stats
function addInputEventListeners() {
    inputs.forEach((input) => {
        refreshOwnData(input);
        input.addEventListener("input", function () {
            refreshOutputs();
            refreshOwnData(input);
        });
    });
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function refreshOwnData(input) {
    const display = document.querySelector('.display--' + input.dataset.slot);
    
    const item = getItemByInput(input);
    if (item === undefined) {// TODO: disable the dropdown, hide the icon for it
        display.textContent = 'Invalid item!';
        return;
    }
    var itemData = ''
    if (item.type === 'weapon') {

        var attackSpeed = item.attackSpeed
        const uSPos = attackSpeed.indexOf('_')
        attackSpeed = attackSpeed.replaceAt(0, attackSpeed[0].toUpperCase())
        attackSpeed = attackSpeed.replaceAt(uSPos + 1, attackSpeed[uSPos + 1].toUpperCase())
        attackSpeed = attackSpeed.replaceAll('_', ' ')

        itemData += 'Attack Speed: ' + attackSpeed + '\n'
    }
    const groupedStats = {};
    
    addCategory(groupedStats, item, "base");
    addCategory(groupedStats, item, "identifications");

    itemData += formatCombined('Item Statistics:\n', groupedStats);
    display.textContent = itemData;
}