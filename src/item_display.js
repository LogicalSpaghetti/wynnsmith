`use strict`;

function formatName(item, itemName) {
    return "<div data-rarity=" + item.rarity + ">" + itemName + "</div>";
}

function getFormattedAttackSpeed(item) {
    if (item.type !== "weapon") throw new Error(`Trying to Format Attack Speed for non-weapon: ${item.name}!`);

    return item.attackSpeed.split('_').map(upperFirst).join(' ');
}

function upperFirst(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
}

function formatIds(ids, colorIds) {
    if (ids === undefined) return "";
    const keys = Object.keys(ids);
    if (keys.length < 1) return "";

    let combinedString = "<div>";

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
        combinedString += signTag + id.min + "</span> – ";
        combinedString += signTag + id.max + "</span>";
    }
    return combinedString;
}

function isSpellCost(stat) {
    return stat.includes("SpellCost");
}

function formatMId(item) {
    if (item.majorIds === undefined) return "";

    let returnString = "";
    Object.keys(item.majorIds).forEach((mIdName) => {
        returnString +=
            '<br><div style="max-width: 30ch; text-wrap: wrap; word-wrap: break-word; margin: 0 auto;">' + item.majorIds[mIdName] + "</div>";
    });

    return returnString;
}

function getHoverTextForItem(item) {

    let result = '';

// §5Olympic
    result += codeDictionaryRarityColor[item.rarity] + item.name + "\n";
// §7Fast Attack Speed
    if (item.type === "weapon")
        result += "§7" + getFormattedAttackSpeed(item) + " Attack Speed\n";
//
    result += "\n";
    if (item.base) {
// §f❋ Air§7 Damage 325-355
        // TODO: orderedBaseStats[]
        let hasDamage = false;
        for (let i = 0; i < 6; i++) {
            const baseDamage = item.base[`base${damageTypes[i]}Damage`];
            if (baseDamage) {
                result += `${codeDictionaryGenericSymbols[prefixes[i]]} ${damageTypes[i]} §7Damage: ${baseDamage.min}-${baseDamage.max}\n`;
                hasDamage = true;
            }
        }
//    §8Average DPS: §7850
//
        if (hasDamage)
            result += `§8Average DPS: ${getAverageDPS(item)}\n\n`;
    }
// Class Req: Shaman
    const classReq = item.requirements.classRequirement;
    if (classReq) {
        result += `§7Class Req: ${upperFirst(classReq)}\n`;
    }
// §4Combat Lv. Min: §793
    const levelReq = item.requirements.level;
    if (levelReq) {
        result += `§4Combat Lv. Min: §7${levelReq}\n`;
    }
// §fAgility §7Min: 105
    skillPointNames.forEach((name) => {
        const requirement = item.requirements[name];
        if (requirement) {
            result += `${codeDictionarySkillPointColor[name]}${upperFirst(name)} §7Min: ${requirement}\n`;
        }
    })
//
    result += `\n`;
// §a+25 §7Agility
    //TODO: orderedSkillPointIds[]
    // TODO: orderedRegularIds[]
//
// §a11% §7to §a46% §7Walk Speed
// §a2 §7to §a8 §7Jump Height
//
// §a6% §7to §a26% §7Air Damage
// §a9% §7to §a39% §7Air Defense
//
// §a-3 §7to §a-13 §7Totem Cost
// §a-3 §7to §a-13 §7Haul Cost
//
// [3/3] Powder Slots [§f❋§f❋§f❋§7]
    if (item.powderSlots > 0) {
        result += `§7[0/${item.powderSlots}] Powder Slots []\n`
    }
// §5Mythic Relik
    result += `${codeDictionaryRarityColor[item.rarity]}${upperFirst(item.rarity)} ${upperFirst(item.subType)}\n`;
// §8When one has climbed the
// highest mountain, traversed
// the vastest plain, what is
// left to conquer? One
// challenges the human limit,
// and attempts to push beyond
// what any has accomplished
// before. Sculpted in honor of
// the first champion, this idol
// emboldens you to best your
// greatest opponent: yourself.
    result += "§8" + formatLore(item);

    return minecraftToHTML(result);
}

function getAverageDPS(item) {
    let result = 0;
    if (item.base)
        for (let i = 0; i < 6; i++) {
            const baseDamage = item.base[`base${damageTypes[i]}Damage`];
            if (baseDamage) {
                result += baseDamage.min + baseDamage.max;
            }
        }
    return roundForDisplay(result / 2) * attackSpeedMultipliers[item.attackSpeed];
}

function formatLore(item) {
    const lore = item.lore;
    const words = lore.split(" ");

    let result = "";

    let subString = "";
    words.forEach((word) => {
        // TODO: is 29 the correct number?
        if (subString.length + word.length >= 29) {
            if (subString.length > 1)
                result += subString + "\n";
            subString = word;
        } else {
            if (subString.length > 0)
                subString += " ";
            subString += word;
        }
    })
    result += subString;

    return result;
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
