`use strict`;

function getFormattedAttackSpeed(item) {
    if (item.type !== "weapon") throw new Error(`Trying to Format Attack Speed for non-weapon: ${item.name}!`);

    return item.attackSpeed.split('_').map(upperFirst).join(' ');
}

function upperFirst(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
}

function isSpellCost(stat) {
    return stat.includes("SpellCost");
}

function getHoverHTMLForItem(item, invalidityText = "") {
    if (!item) return invalidityText;

    let sections = []
    let section = ""

    section += codeDictionaryRarityColor[item.rarity] + item.name + "\n";
    if (item.type === "weapon")
        section += `§7${getFormattedAttackSpeed(item)} Attack Speed\n`;

    sections.push(section);
    section = "";

    if (item.base) {
        for (let i in orderedBaseStats)
            section += getFormattedBase(orderedBaseStats[i], item.base[orderedBaseStats[i]], base_stats, false);

        if (item.type === "weapon")
            section += `§8Average DPS: ${getAverageDPS(item)}\n`;
    }

    sections.push(section);
    section = "";

    const classReq = item.requirements.classRequirement;
    if (classReq) {
        section += `§7Class Req: ${upperFirst(classReq)}\n`;
    }

    const levelReq = item.requirements.level;
    if (levelReq) {
        section += `§4Combat Lv.§7 Min: ${levelReq}\n`;
    }

    skillPointNames.forEach((name) => {
        const requirement = item.requirements[name];
        if (requirement) {
            section += `${codeDictionarySkillPointColor[name]}${upperFirst(name)} §7Min: ${requirement}\n`;
        }
    });

    sections.push(section);
    section = "";

    for (let i in orderedSkillPointIds)
        section += getFormattedSP(orderedSkillPointIds[i], item.identifications[orderedSkillPointIds[i]], identifications);

    sections.push(section);
    section = "";

    for (let i in orderedRegularIds)
        section += getFormattedId(orderedRegularIds[i], item.identifications[orderedRegularIds[i]], identifications);

    sections.push(section);
    section = "";

    if (item.powderSlots > 0) {
        section += `§7[0/${item.powderSlots}] Powder Slots []\n`;
    }

    section += `${codeDictionaryRarityColor[item.rarity]}${upperFirst(item.rarity)} ${upperFirst(item.subType)}\n`;

    section += "§8" + formatLore(item);

    sections.push(section);
    section = "";

    return minecraftToHTML(sections.filter(str => str !== "").join("\n"));
}

function getFormattedBase(name, value, source) {
    if (!value) return "";
    if (value.max) {
        return `§7${source[name].name} ${value.min}${source[name].suffix ?? ""}§7-${value.max}${source[name].suffix ?? ""}\n`
    } else {
        return `§7${source[name].name}§7: ${value}${source[name].suffix ?? ""}\n`
    }
}

function getFormattedSP(name, value, source) {
    if (!value) return "";
    const colorPrefix = codeDictionaryPositivityColors[isSpellCost(name) !== (value.max ?? value >= 0)];
    if (value.max) {
        return `${colorPrefix}${value.min}${source[name].suffix ?? ""}§7 to ${colorPrefix}${value.max}${source[name].suffix ?? ""} §7${source[name].name}\n`
    } else {
        return `${colorPrefix}${value > 0 ? "+" : ""}${value}${source[name].suffix ?? ""} §7${source[name].name}\n`
    }
}

function getFormattedId(name, value, source, colorSign = true) {
    if (!value) return "";
    const colorPrefix = colorSign ? codeDictionaryPositivityColors[isSpellCost(name) !== ((value.max ?? value) >= 0)] : "§7";
    if (value.max) {
        return `${colorPrefix}${value.min}${source[name].suffix ?? ""}§7 to ${colorPrefix}${value.max}${source[name].suffix ?? ""} §7${source[name].name}\n`
    } else {
        return `${colorPrefix}${value}${source[name].suffix ?? ""} §7${source[name].name}\n`
    }
}

function getAverageDPS(item) {
    let result = 0;
    if (item.base)
        for (let i = 0; i < 6; i++) {
            const baseDamage = item.base[`base${elementalNames[i]}Damage`];
            if (baseDamage) {
                result += baseDamage.min + baseDamage.max;
            }
        }
    return roundForDisplay(result / 2) * attackSpeedMultipliers[item.attackSpeed];
}

function formatLore(item) {
    const lore = item.lore;

    if (!lore) return "";

    const words = lore.split(" ");

    let result = "";

    let subString = "";
    words.forEach((word) => {
        if (subString.length + word.length >= 29) {
            if (subString.length > 1)
                result += subString + "\n";
            subString = word;
        } else {
            if (subString.length > 0)
                subString += " ";
            subString += word;
        }
    });
    result += subString;

    return result;
}