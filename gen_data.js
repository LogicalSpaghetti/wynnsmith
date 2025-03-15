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

const setup_details = document.querySelector(`.setup_details`);



logData();
async function logData() {
    for (let i = 0; i < item_types.length; i++) {
        const data = document.querySelector(".data--" + item_types[i]);
        data.value = JSON.stringify(await fetchData(item_types[i]));
    }

    setup_details.textContent = "setup complete, press refresh or modify an entry to see stats";
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
