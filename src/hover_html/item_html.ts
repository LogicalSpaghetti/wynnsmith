import * as codeDictionary from "./code_dictionary.js";
import {attackSpeedMap, attackSpeedMultipliers} from "../to_sort/small_stuff.ts";
import {
    base_stats, categorizedBaseStats, categorizedRegularIds,
    identifications, type IdStyler,
    orderedSkillPointIds,
} from "../item/base_and_ids.js";
import {skillPointNames} from "../item/skill_point/skill_points.js";
import {TextSection, SectionedText, stripMinecraftFormatting} from "./minecraft_html.js";
import type {ItemData} from "../item/item_types.ts";
import {majorIdDatabase} from "../database/majorIdDatabase.ts";
import {roundForDisplay} from "../encoding/numbers.ts";
import {getMax, getMin} from "../attack/attacks";
import type {ClassName} from "../ability/tree/ability_tree.ts";
import {positivityColor} from "./code_dictionary.js";

const check = codeDictionary.reqIndicators["false"];


const classSpellNames = {
    archer: ["Arrow Storm", "Escape", "Arrow Bomb", "Arrow Shield"],
    assassin: ["Spin Attack", "Dash", "Multihit", "Smoke Bomb"],
    mage: ["Heal", "Teleport", "Meteor", "Ice Snake"],
    shaman: ["Totem", "Haul", "Aura", "Uproot"],
    warrior: ["Bash", "Charge", "Uppercut", "War Scream"],
};

// todo: ingredients
export function getHoverTextForItem(item: ItemData | null, invalidityText = "") {
    if (!item) return invalidityText;

    const requirements = item.requirements;

    return new SectionedText()
        .addSection(TextSection.of(codeDictionary.rarityColor[item.rarity ?? "common"] + item.name)
            .add(item.attackSpeed ? `§7${item.attackSpeed ? attackSpeedMap[item.attackSpeed] : "ERROR"} Attack Speed` : ""),
        )
        .add(...(item.base ? categorizedBaseStats.map(group =>
            group.map(stat =>
                getFormattedBase(stat, item.base?.[stat], base_stats))
                .filter(line => line.length > 0)) // don't add ids that aren't present
            .filter(lines => lines.length > 0) // don't add id groups that are empty
            .map(lines => TextSection.of(...lines)) : []),
        )
        .appendToLast(
            item.base && item.type === "weapon" ? `§8Average DPS: ${getAverageDPS(item)}` : "",
        )
        .add(
            requirements ? new TextSection()
                .add(requirements.classRequirement ?
                    `${check} §7Class Req: ${snakeToTitle(requirements.classRequirement)}` : "")
                .add(requirements.level ? `${check} §7Combat Lv. Min: ${requirements.level}` : "")
                .add(...(skillPointNames
                    .filter(name => name in requirements && requirements[name])
                    .map(name =>
                        `${check} §7${upperFirst(name)} Min§7: ${requirements[name]}`))) : "",
        )
        .add(item.identifications ? TextSection.of(
            ...orderedSkillPointIds.map(point =>
                getFormattedSP(point, item.identifications?.[point], identifications))) : "",
        )
        .add(
            ...(item.identifications ? categorizedRegularIds.map(group =>
                group.map(stat =>
                    getFormattedId(stat, item.identifications?.[stat], identifications,
                        true, item.requirements?.classRequirement))
                    .filter(line => line.length > 0)) // don't add ids that aren't present
                .filter(lines => lines.length > 0) // don't add id groups that are empty
                .map(lines => TextSection.of(...lines)) : []),
        )
        .add(...(item.majorIds ? Object.keys(item.majorIds ?? {}).map(name => wrapText(
            `§b+${name}: §3${majorIdDatabase.getMajorId(name)?.description ?? `No description found for ${name}`}`)) : []))
        .addSection(new TextSection()
            .add(item.powderSlots && item.powderSlots > 0 ? `§7[0/${item.powderSlots}] Powder Slots []` : "")
            .add(item.rarity ?
                `${codeDictionary.rarityColor[item.rarity]}${upperFirst(item.rarity)} ${snakeToTitle(item.subType)}` : "")
            // todo: item set, i.e. Set: Morph
            .add(item.requirements?.quest ? `§7Quest Req: ${item.requirements.quest}` : "")
            .add(item.lore ? `§8${wrapText(item.lore ?? "")}` : "")
            .add(item.restrictions ? `§c${
                item.restrictions === "untradable" ? "Untradable Item"
                    : item.restrictions === "quest item" ? "Quest Item Only!"
                        : `Error! Unknown item restriction: ${item.restrictions}`}` : ""))
        .toMinecraftHTML();
}

type Id = { min: number, raw: number, max: number } | number

export function getFormattedId(name: string, value: Id | undefined, source: IdStyler, colorSign = true, wynnClass: ClassName = "archer") {
    if (value == null) return "";
    const color_prefix = colorSign ? idPositivityColor(name, value) : "§7";
    const suffix = source[name].suffix ?? "";
    let nameOfId = source[name].name;
    if (wynnClass && isSpellCost(name)) {
        const spellNumber = parseInt(name.replace(/\D/g, '')) - 1;
        nameOfId = classSpellNames[wynnClass][spellNumber] + " Cost " + (source[name].suffix ?? "");
    }

    if (!(typeof value === "number")) {
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


export function snakeToTitle(string?: string) {
    if (string == null) return "";
    return string.split('_').map(upperFirst).join(' ');
}

export function upperFirst(string: string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
}

export function getFormattedBase(name: string, value: Id | undefined, source: IdStyler) {
    if (value == null) return "";
    return typeof value === "number"
        ? `§7${source[name].name}§7: ${value}${source[name].suffix ?? ""}`
        : `§7${source[name].name} ${value.min}${source[name].suffix ?? ""}§7-${value.max}${source[name].suffix ?? ""}`;
}


export function getFormattedSP(name: string, value: Id | undefined, source: IdStyler) {
    if (value == null) return "";
    const colorPrefix = idPositivityColor(name, value);
    return typeof value === "number"
        ? `${colorPrefix}${value > 0 ? "+" : ""}${value}${source[name].suffix ?? ""} §7${source[name].name}`
        : `${colorPrefix}${value.min}${source[name].suffix ?? ""}§7 to ${colorPrefix}${value.max}${source[name].suffix ?? ""} §7${source[name].name}`;
}

// TODO: reformat the API names to remove inconsistencies like this.
const baseDamageElements = ["", "Earth", "Thunder", "Water", "Fire", "Air"] as const;

// TODO: powders
export function getAverageDPS(item: ItemData) {
    if (!item.attackSpeed) return "";
    let result = 0;
    if (item.base)
        for (let i = 0; i < 6; i++) {
            const baseDamage = item.base[`base${baseDamageElements[i]}Damage`];
            if (baseDamage != null)
                result += getMin(baseDamage) + getMax(baseDamage);
        }
    return roundForDisplay(attackSpeedMultipliers[item.attackSpeed] * result / 2);
}

export function wrapText(text: string, maxLength = 29) {
    if (!text.length) return "";

    const words = text.split(" ");

    let result = "";

    let subString = "";
    for (let word of words) {
        if (lengthWithoutFormatting(subString) + lengthWithoutFormatting(word) >= maxLength) {
            if (subString.length > 1)
                result += subString + "\n";
            subString = word;
        } else {
            if (subString.length > 0)
                subString += " ";
            subString += word;
        }
    }

    result += subString;

    return result;
}

function isSpellCost(stat: string) {
    return stat.includes("SpellCost");
}

function lengthWithoutFormatting(word: string) {
    return stripMinecraftFormatting(word).length;
}

function idPositivityColor(name: string, value: Id) {
    return positivityColor(isSpellCost(name) !== (getMax(value) >= 0));
}