`use strict`;

const classSpellNames = {
    archer: ["Arrow Storm", "Escape", "Arrow Bomb", "Arrow Shield"],
    assassin: ["Spin Attack", "Dash", "Multihit", "Smoke Bomb"],
    mage: ["Heal", "Teleport", "Meteor", "Ice Snake"],
    shaman: ["Totem", "Haul", "Aura", "Uproot"],
    warrior: ["Bash", "Charge", "Uppercut", "War Scream"],
};

function snakeToTitle(string) {
    return string.split('_').map(upperFirst).join(' ');
}

function upperFirst(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
}

function isSpellCost(stat) {
    return stat.includes("SpellCost");
}

function getFormattedBase(name, value, source) {
    if (!value) return "";
    if (value.max) {
        return `§7${source[name].name} ${value.min}${source[name].suffix ?? ""}§7-${value.max}${source[name].suffix ?? ""}`;
    } else {
        return `§7${source[name].name}§7: ${value}${source[name].suffix ?? ""}`;
    }
}

function getFormattedSP(name, value, source) {
    if (!value) return "";
    const colorPrefix = codeDictionaryPositivityColors[isSpellCost(name) !== (value.max ?? value >= 0)];
    if (value.max) {
        return `${colorPrefix}${value.min}${source[name].suffix ?? ""}§7 to ${colorPrefix}${value.max}${source[name].suffix ?? ""} §7${source[name].name}`;
    } else {
        return `${colorPrefix}${value > 0 ? "+" : ""}${value}${source[name].suffix ?? ""} §7${source[name].name}`;
    }
}

function getFormattedId(name, value, source, colorSign = true, wynnClass = "") {
    if (!value) return "";
    const color_prefix = colorSign ? codeDictionaryPositivityColors[isSpellCost(name) !== ((value.max ?? value) >= 0)] : "§7";
    const suffix = source[name].suffix ?? "";
    let nameOfId = source[name].name;
    if (wynnClass && isSpellCost(name)) {
        const spellNumber = parseInt(name.replace(/\D/g, '')) - 1;
        nameOfId = classSpellNames[wynnClass][spellNumber] + " Cost " + (source[name].suffix ?? "");
    }

    if (value.max) {
        return (
            color_prefix + value.min + suffix +
            "§7 to " +
            color_prefix + value.max + suffix +
            " §7" + nameOfId);
    } else {
        return (
            color_prefix + value + suffix +
            " §7" + nameOfId);
    }
}

function getAverageDPS(item) {
    let result = 0;
    if (item.base)
        for (let i = 0; i < 6; i++) {
            const baseDamage = item.base[`base${i === 0 ? "" : damageTypeNames[i]}Damage`];
            if (baseDamage) {
                result += baseDamage.min + baseDamage.max;
            }
        }
    return roundForDisplay(attackSpeedMultipliers[item.attackSpeed] * result / 2);
}


function wrapText(text) {
    if (!text) return "";

    const words = text.split(" ");

    let result = "";

    let subString = "";
    words.forEach((word) => {
        if (lengthWithoutFormatting(subString) + lengthWithoutFormatting(word) >= 29) {
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

function lengthWithoutFormatting(word) {
    return stripMinecraftFormatting(word).length
}