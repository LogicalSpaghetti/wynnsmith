`use strict`;

// elements
const testButton = document.querySelector(`.btn--test`);
const refreshButton = document.querySelector(`.btn--refresh`);
const inputA = document.querySelector(`.input--A`);
const inputB = document.querySelector(`.input--B`);
const outputA = document.querySelector(`.output--A`);

const data = document.querySelector(".data");

const identifications = [
    "baseHealth",
    "baseFireDefence",
    "defence",
    "rawDefence",
    "xpBonus",
    "lootBonus",
    "fireDamage",
    "thunderDefence",
    "waterDefence",
    "fireDefence",
    "baseDamage",
    "rawStrength",
    "baseEarthDamage",
    "strength",
    "mainAttackDamage",
    "spellDamage",
    "thorns",
    "walkSpeed",
    "baseFireDamage",
    "rawHealth",
    "manaRegen",
    "healingEfficiency",
    "raw1stSpellCost",
    "soulPointRegen",
    "earthDefence",
    "baseThunderDefence",
    "baseAirDefence",
    "agility",
    "airDamage",
    "rawAgility",
    "manaSteal",
    "elementalDamage",
    "baseThunderDamage",
    "dexterity",
    "rawSpellDamage",
    "thunderDamage",
    "waterDamage",
    "healthRegen",
    "baseWaterDefence",
    "intelligence",
    "reflection",
    "healthRegenRaw",
    "poison",
    "earthDamage",
    "baseWaterDamage",
    "baseAirDamage",
    "rawIntelligence",
    "1stSpellCost",
    "2ndSpellCost",
    "3rdSpellCost",
    "4thSpellCost",
    "rawDexterity",
    "rawMainAttackDamage",
    "baseEarthDefence",
    "airDefence",
    "lifeSteal",
    "stealing",
    "elementalDefence",
    "sprint",
    "sprintRegen",
    "jumpHeight",
    "rawAttackSpeed",
    "rawFireMainAttackDamage",
    "earthSpellDamage",
    "rawEarthSpellDamage",
    "exploding",
    "fireSpellDamage",
    "earthMainAttackDamage",
    "waterSpellDamage",
    "rawAirMainAttackDamage",
    "raw2ndSpellCost",
    "airSpellDamage",
    "rawEarthMainAttackDamage",
    "rawThunderMainAttackDamage",
    "rawFireDamage",
    "rawFireSpellDamage",
    "raw4thSpellCost",
    "raw3rdSpellCost",
    "rawWaterSpellDamage",
    "elementalMainAttackDamage",
    "knockback",
    "rawThunderSpellDamage",
    "rawElementalSpellDamage",
    "slowEnemy",
    "elementalSpellDamage",
    "rawElementalMainAttackDamage",
    "rawDamage",
    "damage",
    "neutralDamage",
    "rawNeutralDamage",
    "healing",
    "thunderSpellDamage",
    "airMainAttackDamage",
    "rawNeutralSpellDamage",
    "rawAirSpellDamage",
    "rawThunderDamage",
    "rawWaterDamage",
    "rawElementalDamage",
    "thunderMainAttackDamage",
    "fireMainAttackDamage",
    "rawNeutralMainAttackDamage",
    "rawEarthDamage",
    "rawAirDamage",
    "neutralMainAttackDamage",
    "weakenEnemy",
    "leveledXpBonus",
    "damageFromMobs",
    "leveledLootBonus",
    "gatherXpBonus",
    "rawWaterMainAttackDamage",
    "gatherSpeed",
    "lootQuality",
];

const sound = new Audio("sounds/mythic_old.ogg");
testButton.addEventListener("click", function () {
    sound.play();
});

refreshButton.addEventListener("click", function () {
    setOutput();
});

//JSONs
logData();

const findMatch = function () {
    const helmet = JSON.parse(document.querySelector(`.data--helmet`).value)[inputA.value];

    if (helmet === undefined) return;

    const ids = Object.entries(helmet["identifications"]);

    var strungTogether = "";
    for (let i = 0; i < ids.length; i++) {
        const identification = ids[i];
        strungTogether += JSON.stringify(ids[i]) + "\n";
    }

    return strungTogether;
};

const setOutput = function () {
    outputA.textContent = findMatch();
};

// document.addEventListener() can be used to catch inputs on a global level
// window.addEventListener() can be used to catch when the page fully loads, or wants to unload

window.addEventListener("load", function () {
    inputA.addEventListener("input", function () {
        setOutput();
    });
});

async function logData() {
    const item_types = [
        "helmet",
        "chestplate",
        "leggings",
        "boots",
        "ring",
        "bracelet",
        "necklace",
        "relik",
        "spear",
        "wand",
        "bow",
        "dagger",
    ];

    for (let i = 0; i < item_types.length; i++) {
        const data = document.querySelector(".data--" + item_types[i]);
        data.value = JSON.stringify(await fetchData(item_types[i]));
    }
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
