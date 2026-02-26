import * as codeDictionary from "./code_dictionary.js";
import {attackSpeedMap} from "../to_sort/small_stuff.ts";
import {
    base_stats, categorizedBaseStats, categorizedRegularIds,
    identifications,
    orderedSkillPointIds,
} from "../item/base_and_ids.js";
import {
    getAverageDPS,
    getFormattedBase,
    getFormattedId,
    getFormattedSP,
    snakeToTitle,
    upperFirst,
    wrapText,
} from "./display_item.js";
import {skillPointNames} from "../item/skill_point/skill_points.js";
import {TextSection, SectionedText} from "./minecraft_html.js";
import type {NormalItemData} from "../item/item_types.ts";
import {majorIdDatabase} from "../database/majorIdDatabase.ts";

const check = codeDictionary.reqIndicators["false"];

// todo: ingredients
export function getHoverTextForItem(item: NormalItemData | null, invalidityText = "") {
    if (!item) return invalidityText;

    const requirements = item.requirements;

    return new SectionedText()
        .addSection(TextSection.of(codeDictionary.rarityColor[item.rarity ?? "common"] + item.name)
            .add(item.attackSpeed ? `§7${item.attackSpeed ? attackSpeedMap[item.attackSpeed] : "ERROR"} Attack Speed` : ""),
        )
        .add(...(!item.base ? [] : categorizedBaseStats.map(group =>
                group.map(stat =>
                    getFormattedBase(stat, item.base?.[stat], base_stats))
                    .filter(line => line.length > 0)) // don't add ids that aren't present
                .filter(lines => lines.length > 0) // don't add id groups that are empty
                .map(lines => TextSection.of(...lines))),
        )
        .appendToLast(
            item.base && item.type === "weapon" ? `§8Average DPS: ${getAverageDPS(item)}` : "",
        )
        .add(
            requirements ? new TextSection()
                .add(requirements.classRequirement ?
                    `${check} §7Class Req: ${snakeToTitle(requirements.classRequirement)}`: "")
                .add(requirements.level ? `${check} §7Combat Lv. Min: ${requirements.level}`: "")
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
                        true, item.requirements?.classRequirement ?? ""))
                    .filter(line => line.length > 0)) // don't add ids that aren't present
                .filter(lines => lines.length > 0) // don't add id groups that are empty
                .map(lines => TextSection.of(...lines)) : []),
        )
        .add(...(item.majorIds ? Object.keys(item.majorIds ?? {}).map(name => wrapText(
            `§b+${name}: §3${majorIdDatabase.getMajorId(name)?.description ?? `No description found for ${name}`}`)): []))
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