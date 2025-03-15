// log the JSONs into HTML

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

const output = document.querySelector(`.output--A`);

const allItemCatas = {};

logData();
async function logData() {
    output.textContent = 'setting up...';
    for (let i = 0; i < item_types.length; i++) {
        allItemCatas[item_types[i]] = await fetchData(item_types[i]);
    }

    addAllItemData();
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
