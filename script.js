`use strict`;

// elements
const testButton = document.querySelector(`.btn--test`);
const refreshButton = document.querySelector(`.btn--refresh`);
const inputHelmet = document.querySelector(`.input--helmet`);
const inputRings = document.querySelectorAll(`.input--ring`);

const inputs = [
    document.querySelector(`.input--helmet`),
    document.querySelector(`.input--chestplate`),
    document.querySelector(`.input--leggings`),
    document.querySelector(`.input--boots`),
    document.querySelector(`.input--ring1`),
    document.querySelector(`.input--ring2`),
    document.querySelector(`.input--bracelet`),
    document.querySelector(`.input--necklace`),
    document.querySelector(`.input--weapon`),
];

const sound = new Audio("sounds/mythic_old.ogg");
testButton.addEventListener("click", function () {
    sound.play();
});

refreshButton.addEventListener("click", function () {
    const combinedStats = addAllItemData();
    //const processedStats = createDisplayStats(combinedStats);
});

const addAllItemData = function () {
    const groupedStats = {}
    
    addBasePlayerStats(groupedStats);

    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        addItemToCombined(input, groupedStats);
    }

    // this stat is incorrectly listed on one item in the API, and should be ignored
    delete groupedStats['mainAttackFireDamage']

    combineStats(groupedStats);

    output.textContent = formatCombined(groupedStats);

    return groupedStats;
};

function formatCombined(groupedStats) {
    var combinedString = 'Build statistics:\n';
    const keys = Object.keys(groupedStats);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        combinedString += key + ': ' + groupedStats[key] + '\n';
    }
    return combinedString;
}

const addBasePlayerStats = function (groupedStats) {
    groupedStats["sumHealth"] = 535;
};

const addItemToCombined = function (input, groupedStats) {
    if (allItemCatas === undefined) return;
    const itemCategory = allItemCatas[input.dataset["slot"]];

    if (itemCategory === undefined) return;
    const item = itemCategory[input.value];

    if (item === undefined) return;

    addCategory(groupedStats, item, "base");
    addCategory(groupedStats, item, "identifications");
};

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

window.addEventListener("load", function () {
    inputs.forEach((input) => {
        input.addEventListener("input", function () {
            addAllItemData(input);
        });
    });
});
