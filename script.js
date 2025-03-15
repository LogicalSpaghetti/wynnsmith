`use strict`;

// elements
const testButton = document.querySelector(`.btn--test`);
const refreshButton = document.querySelector(`.btn--refresh`);
const inputHelmet = document.querySelector(`.input--helmet`);
const inputRings = document.querySelectorAll(`.input--ring`);
const outputA = document.querySelector(`.output--A`);
const outputB = document.querySelector(`.output--B`);

const data = document.querySelector(".data");

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

const item_types = [
    "helmet",
    "chestplate",
    "leggings",
    "boots",
    "ring",
    "ring",
    "bracelet",
    "necklace",
    "relik",
    "spear",
    "wand",
    "bow",
    "dagger",
    "weapons",
];

const sound = new Audio("sounds/mythic_old.ogg");
testButton.addEventListener("click", function () {
    sound.play();
});

refreshButton.addEventListener("click", function () {
    addAllItemData();
});

const addAllItemData = function () {

    const combined = Object();
    // loop through each input, adding each id to the combined
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        addItemToCombined(input, combined);
        console.log('inputs.length = ' + inputs.length + ', combined = ' + JSON.stringify(combined))
    }

    outputB.textContent = JSON.stringify(combined)
};

const addItemToCombined = function (input, combined) {
    console.log('start addItemToCombined');
    const itemsString = document.querySelector(`.data--` + input.dataset["slot"]).value;
    if (itemsString === undefined) return 'itemString is undefined';

    const item = JSON.parse(itemsString)[input.value];
    if (item === undefined) return 'item is undefined';

    addCategory(combined, item, 'base');
    addCategory(combined, item, 'identifications');
}

const addCategory = function(combined, item, subObjectName) {
    if (item[subObjectName] === undefined) return;
    const subObject = Object.entries(item[subObjectName]);

    for (let i = 0; i < subObject.length; i++) {
        const id = subObject[i];

        var result = id[1];
        if (!Number.isInteger(id[1])) {
            result = result["max"];
        }

        if (combined[id[0]] === undefined) {
            combined[id[0]] = result;
        } else {
            combined[id[0]] += result;
        }
    }
}



const addItemFromSlot = function (input) {
    const inputString = document.querySelector(`.data--` + input.dataset["slot"]).value;
    if (inputString === undefined) return '';

    const item = JSON.parse(inputString)[input.value];
    if (item === undefined) return '';
    if (item["base"] === undefined) return '';
    const base = Object.entries(item["base"]);

    var strungTogether = "";
    for (let i = 0; i < base.length; i++) {
        const id = base[i];

        var result = id[1];
        if (!Number.isInteger(id[1])) {
            result = result["max"];
        }

        strungTogether += id[0] + ": " + JSON.stringify(result) + "\n";
    }

    const ids = Object.entries(item["identifications"]);

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];

        var result = id[1];
        if (!Number.isInteger(id[1])) {
            result = result["max"];
        }

        strungTogether += id[0] + ": " + JSON.stringify(result) + "\n";
    }

    return strungTogether;
};

// document.addEventListener() can be used to catch inputs on a global level
// window.addEventListener() can be used to catch when the page fully loads, or wants to unload

window.addEventListener("load", function () {
    inputs.forEach(input => {
        input.addEventListener("input", function () {
            addAllItemData(input);
        });
    });
});


// log the JSONs into HTML
logData();
async function logData() {
    for (let i = 0; i < item_types.length; i++) {
        const data = document.querySelector(".data--" + item_types[i]);
        data.value = JSON.stringify(await fetchData(item_types[i]));
    }
    console.log('setup complete')
}

async function fetchData(file) {
    try {
        const response = await fetch(`database/${file}.json`);

        if (!response.ok) {
            throw new Error("Could not fetch resource: " + `database/${file}.json`);
        }

        //outputA.textContent = JSON.stringify(await response.json());
        return response.json();
    } catch (error) {
        console.error(error + " " + file);
    }
}

