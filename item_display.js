function setDisplay(display, item, itemName) {
    if (item === undefined) {
        // TODO: disable the dropdown, hide the icon for it
        display.textContent = "Invalid item!";
        return;
    }

    display.innerHTML =
        formatName(item, itemName) + formatAttackSpeed(item) + formatCombined(item.base) + formatCombined(item.identifications) + formatMId(item);
}

function formatName(item, itemName) {
    return "<div data-rarity=" + item.rarity + ">" + itemName + "</div>";
}

function formatAttackSpeed(item) {
    if (item.type !== "weapon") return "";

    var attackSpeed = item.attackSpeed;
    const uSPos = attackSpeed.indexOf("_");
    attackSpeed = replaceCharacterAt(attackSpeed, 0, attackSpeed[0].toUpperCase());
    attackSpeed = replaceCharacterAt(attackSpeed, uSPos + 1, attackSpeed[uSPos + 1].toUpperCase());
    attackSpeed = attackSpeed.replaceAll("_", " ");

    return "<br><div>Attack Speed: " + attackSpeed + "</div>";
}

function replaceCharacterAt(string, index, replacement) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}

function formatCombined(ids) {
    if (ids === undefined) return "";
    const keys = Object.keys(ids);
    if (keys.length < 1) return "";

    var combinedString = "<div>";

    for (let i = 0; i < keys.length; i++) {
        combinedString += "<br>" + keys[i] + ": ";
        const id = ids[keys[i]];
        if (Number.isInteger(id)) {
            combinedString += id >= 0 ? '<span class="positive">+' : '<span class="negative">';
            combinedString += id + "</span>";
        } else {
            combinedString += id.min >= 0 ? '<span class="positive">+' : '<span class="negative">';
            combinedString += id.min + "</span> to ";
            combinedString += id.min >= 0 ? '<span class="positive">+' : '<span class="negative">';
            combinedString += id.max + "</span>";
        }
    }

    return combinedString + "</div>";
}

function getColoredNumber() {
    
}

function formatMId(item) {
    if (item.majorIds === undefined) return "";

    var returnString = "";
    Object.keys(item.majorIds).forEach((mIdName) => {
        returnString += "<br><div style=\"max-width: 30ch; text-wrap: wrap; word-wrap: break-word; margin: 0 auto;\">" + item.majorIds[mIdName] + "</div>"
    });

    return returnString;
}

const baseNames = {
    // Health
    baseHealth: 0,
    // Eledef Raw
    baseEarthDefence: 0,
    baseThunderDefence: 0,
    baseWaterDefence: 0,
    baseFireDefence: 0,
    baseAirDefence: 0,
    // Base Damage
    baseDamage: "Neutral Damage",
    baseEarthDamage: { min: 0, max: 0 },
    baseThunderDamage: { min: 0, max: 0 },
    baseWaterDamage: { min: 0, max: 0 },
    baseFireDamage: { min: 0, max: 0 },
    baseAirDamage: { min: 0, max: 0 },
    // Charms
    leveledLootBonus: 0,
    damageFromMobs: 0,
    leveledXpBonus: 0,
};
const idNames = {
    // Skill Points
    "rawStrength": "Strength",
    "rawDexterity": "Dexterity",
    "rawIntelligence": "Intelligence",
    "rawDefence": "Defence",
    "rawAgility": "Agility",
    // Eledef %
    "earthDefence": "Earth Defence %",
    "thunderDefence": "Thunder Defence %",
    "waterDefence": "Water Defence %",
    "fireDefence": "Fire Defence %",
    "airDefence": "Air Defence %",
    "elementalDefence": "Elemental Defence %",
    // Raw Damage
    "rawDamage": 0,
    "rawMainAttackDamage": 0,
    "rawSpellDamage": 0,
    "rawNeutralDamage": 0,
    "rawNeutralMainAttackDamage": 0,
    "rawNeutralSpellDamage": 0,
    "rawElementalDamage": 0,
    "rawElementalMainAttackDamage": 0,
    "rawElementalSpellDamage": 0,
    "rawEarthDamage": 0,
    "rawEarthMainAttackDamage": 0,
    "rawEarthSpellDamage": 0,
    "rawThunderDamage": 0,
    "rawThunderMainAttackDamage": 0,
    "rawThunderSpellDamage": 0,
    "rawWaterDamage": 0,
    "rawWaterMainAttackDamage": 0,
    "rawWaterSpellDamage": 0,
    "rawFireDamage": 0,
    "rawFireMainAttackDamage": 0,
    "rawFireSpellDamage": 0,
    "rawAirDamage": 0,
    "rawAirMainAttackDamage": 0,
    "rawAirSpellDamage": 0,
    // % Damage
    "damage": 0,
    "spellDamage": 0,
    "mainAttackDamage": 0,
    "neutralDamage": 0,
    "neutralMainAttackDamage": 0,
    "neutralSpellDamage": 0,
    "elementalDamage": 0,
    "elementalMainAttackDamage": 0,
    "elementalSpellDamage": 0,
    "earthDamage": 0,
    "earthMainAttackDamage": 0,
    "earthSpellDamage": 0,
    "thunderDamage": 0,
    "thunderMainAttackDamage": 0,
    "thunderSpellDamage": 0,
    "waterDamage": 0,
    "waterMainAttackDamage": 0,
    "waterSpellDamage": 0,
    "fireDamage": 0,
    "fireMainAttackDamage": 0,
    "fireSpellDamage": 0,
    "airDamage": 0,
    "airMainAttackDamage": 0,
    "airSpellDamage": 0,
    // Passive Damage
    "exploding": 0,
    "poison": 0,
    "thorns": 0,
    "reflection": 0,
    // Other Damage
    "criticalDamageBonus": 0,
    "knockback": 0,
    "mainAttackRange": 0,
    "rawAttackSpeed": 0,
    // Health
    "rawHealth": 0,
    "healingEfficiency": 0,
    "healthRegenRaw": 0,
    "healthRegen": 0,
    // Mana
    "rawMaxMana": 0,
    "manaRegen": 0,
    // Steals
    "lifeSteal": 0,
    "manaSteal": 0,
    // Costs
    "1stSpellCost": 0,
    "2ndSpellCost": 0,
    "3rdSpellCost": 0,
    "4thSpellCost": 0,
    "raw1stSpellCost": 0,
    "raw2ndSpellCost": 0,
    "raw3rdSpellCost": 0,
    "raw4thSpellCost": 0,
    // Movement
    "walkSpeed": 0,
    "jumpHeight": 0,
    "sprint": 0,
    "sprintRegen": 0,
    // XP and Gathering
    "gatherSpeed": 0,
    "gatherXpBonus": 0,
    "lootBonus": 0,
    "lootQuality": 0,
    "stealing": 0,
    "xpBonus": 0,
    // Debuffs
    "weakenEnemy": 0,
    "slowEnemy": 0,
};
