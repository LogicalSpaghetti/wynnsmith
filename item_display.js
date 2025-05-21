function setDisplay(display, item, itemName) {
    if (item === undefined) {
        // TODO: disable the dropdown, hide the icon for it
        display.innerHTML = "Invalid item!";
        return;
    }

    display.innerHTML =
        formatName(item, itemName) + formatAttackSpeed(item) + formatIds(item.base, false) + formatIds(item.identifications, true) + formatMId(item);
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

function formatIds(ids, colorIds) {
    if (ids === undefined) return "";
    const keys = Object.keys(ids);
    if (keys.length < 1) return "";

    var combinedString = "<div>";

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const id = ids[key];
        combinedString += formatId(key, id, colorIds);
    }

    return combinedString + "</div>";
}

function formatId(idName, id, colorIds) {
    let combinedString = "<br>" + statNames[idName] + ": ";
    const signTag = colorIds
        ? (id.min ?? id) * (isSpellCost(idName) ? -1 : 1) >= 0
            ? '<span class="positive">'
            : '<span class="negative">'
        : "<span>";
    if (Number.isInteger(id)) {
        combinedString += signTag + id + "</span>";
    } else {
        combinedString += signTag + id.min + "</span> - ";
        combinedString += signTag + id.max + "</span>";
    }
    return combinedString;
}

function isSpellCost(stat) {
    return stat.includes("SpellCost");
}

function formatMId(item) {
    if (item.majorIds === undefined) return "";

    var returnString = "";
    Object.keys(item.majorIds).forEach((mIdName) => {
        returnString +=
            '<br><div style="max-width: 30ch; text-wrap: wrap; word-wrap: break-word; margin: 0 auto;">' + item.majorIds[mIdName] + "</div>";
    });

    return returnString;
}

const statNames = {
    // Base
    // Health
    "baseHealth": "Health",
    // Eledef Raw
    "baseEarthDefence": "Earth Defence",
    "baseThunderDefence": "Thunder Defence",
    "baseWaterDefence": "Water Defence",
    "baseFireDefence": "Fire Defence",
    "baseAirDefence": "Air Defence",
    // Base Damage
    "baseDamage": "Neutral Damage",
    "baseEarthDamage": "Earth Damage",
    "baseThunderDamage": "Thunder Damage",
    "baseWaterDamage": "Water Damage",
    "baseFireDamage": "Fire Damage",
    "baseAirDamage": "Air Damage",
    // Charms
    "leveledLootBonus": "Leveled Loot Bonus",
    "damageFromMobs": "Damage From Mobs %",
    "leveledXpBonus": "Leveled XP Bonus %",
    // Identifications
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
    "rawDamage": "Raw Damage",
    "rawMainAttackDamage": "Raw Main Attack Damage",
    "rawSpellDamage": "Raw Spell Damage",
    "rawNeutralDamage": "Raw Neutral Damage",
    "rawNeutralMainAttackDamage": "Raw Neutral Main Attack Damage",
    "rawNeutralSpellDamage": "Raw Neutral Spell Damage",
    "rawElementalDamage": "Raw Elemental Damage",
    "rawElementalMainAttackDamage": "Raw Elemental Main Attack Damage",
    "rawElementalSpellDamage": "Raw Elemental Spell Damage",
    "rawEarthDamage": "Raw Earth Damage",
    "rawEarthMainAttackDamage": "Raw Earth Main Attack Damage",
    "rawEarthSpellDamage": "Raw Earth Spell Damage",
    "rawThunderDamage": "Raw Thunder Damage",
    "rawThunderMainAttackDamage": "Raw Thunder Main Attack Damage",
    "rawThunderSpellDamage": "Raw Thunder Spell Damage",
    "rawWaterDamage": "Raw Water Damage",
    "rawWaterMainAttackDamage": "Raw Water Main Atttack Damage",
    "rawWaterSpellDamage": "Raw Water Spell Damage",
    "rawFireDamage": "Raw Fire Damage",
    "rawFireMainAttackDamage": "Raw Fire Main Attack Damage",
    "rawFireSpellDamage": "Raw Fire Spell Damage",
    "rawAirDamage": "Raw Air Damage",
    "rawAirMainAttackDamage": "Raw Air Main Attack Damage",
    "rawAirSpellDamage": "Raw Air Spell Damage",
    // % Damage
    "damage": "Damage %",
    "spellDamage": "Spell Damage %",
    "mainAttackDamage": "Main Attack Damage %",
    "neutralDamage": "Neutral Damage %",
    "neutralMainAttackDamage": "Neutral Main Attack Damage %",
    "neutralSpellDamage": "Neutral Spell Damage %",
    "elementalDamage": "Elemental Damage %",
    "elementalMainAttackDamage": "Elemental Main Attack Damage %",
    "elementalSpellDamage": "Elemental Spell Damage %",
    "earthDamage": "Earth Damage %",
    "earthMainAttackDamage": "Earth Main Attack Damage %",
    "earthSpellDamage": "Earth Spell Damage %",
    "thunderDamage": "Thunder Damage %",
    "thunderMainAttackDamage": "Thunder Main Attack Damage %",
    "thunderSpellDamage": "Thunder Spell Damage %",
    "waterDamage": "Water Damage %",
    "waterMainAttackDamage": "Water Main Attack Damage %",
    "waterSpellDamage": "Water Spell Damage %",
    "fireDamage": "Fire Damage %",
    "fireMainAttackDamage": "Fire Main Attack Damage %",
    "fireSpellDamage": "Fire Spell Damage %",
    "airDamage": "Air Damage %",
    "airMainAttackDamage": "Air Main Attack Damage %",
    "airSpellDamage": "Air Spell Damage %",
    // Passive Damage
    "exploding": "Exploding",
    "poison": "Poison",
    "thorns": "Thorns",
    "reflection": "Reflection",
    // Other Damage
    "criticalDamageBonus": "Critical Damage Bonus %",
    "knockback": "Knockback %",
    "mainAttackRange": "Main Attack Range %",
    "rawAttackSpeed": "Attack Speed",
    // Health
    "rawHealth": "Health Bonus",
    "healingEfficiency": "Healing Efficiency %",
    "healthRegenRaw": "Raw Health Regen",
    "healthRegen": "Health Regen %",
    // Mana
    "rawMaxMana": "Max Mana",
    "manaRegen": "Mana Regen",
    // Steals
    "lifeSteal": "Life Steal",
    "manaSteal": "Mana Steal",
    // Costs
    "1stSpellCost": "1st Spell Cost %",
    "2ndSpellCost": "2nd Spell Cost %",
    "3rdSpellCost": "3rd Spell Cost %",
    "4thSpellCost": "4th Spell Cost %",
    "raw1stSpellCost": "1st Spell Cost",
    "raw2ndSpellCost": "2nd Spell Cost",
    "raw3rdSpellCost": "3rd Spell Cost",
    "raw4thSpellCost": "4th Spell cost",
    // Movement
    "walkSpeed": "Walk Speed %",
    "jumpHeight": "Jump height",
    "sprint": "Sprint Speed %",
    "sprintRegen": "Sprint Regen %",
    // XP and Gathering
    "gatherSpeed": "Gather Speed %",
    "gatherXpBonus": "Gather Xp Bonus %",
    "lootBonus": "Loot Bonus",
    "lootQuality": "Loot Quality",
    "stealing": "Stealing %",
    "xpBonus": "Combat XP Bonus %",
    // Debuffs
    "weakenEnemy": "Weaken Enemy %",
    "slowEnemy": "Slow Enemy %",
};
