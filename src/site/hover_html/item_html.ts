import * as codeDictionary from "../../js_data/code_dictionary.js";
import {attackSpeedMap} from "../misc/small_stuff.ts";
import {
    base_stats,
    identifications,
    orderedBaseStats,
    orderedRegularIds,
    orderedSkillPointIds,
} from "../../js_data/base_and_ids.js";
import {
    getAverageDPS,
    getFormattedBase,
    getFormattedId,
    getFormattedSP,
    snakeToTitle,
    upperFirst,
    wrapText,
} from "../misc/display_item.js";
import {skillPointNames} from "../skill_point/skill_points.js";
import {objectFind} from "../misc/object_search.js";
import major_id_descriptions from "../../js_data/major_ids.js";
import {minecraftToHTML, TextSection, TextSections} from "./minecraft_html.js";
import type {GenericGearItemType, WeaponItemType} from "../item/item_types.ts";

// todo: ings
export function getHoverTextForItem(item: GenericGearItemType | null, invalidityText = "") {
    if (!item) return invalidityText;

    const sections = new TextSections();

    const header = new TextSection(codeDictionary.rarityColor[item.rarity] + item.name);
    if ("attackSpeed" in item) header.add(`§7${attackSpeedMap[(item as WeaponItemType).attackSpeed]} Attack Speed`);

    sections.add(header);

    if ("base" in item && item.base) {
        let section = new TextSection();
        for (let stat of orderedBaseStats) {
            if (stat === "") {
                sections.add(section);
                section = new TextSection();
                continue;
            }
            section.add(getFormattedBase(stat, item.base[stat], base_stats));
        }

        if (item.type === "weapon") section.add(`§8Average DPS: ${getAverageDPS(item)}`);
        sections.add(section);
    }

    const reqs = new TextSection();

    const checkMark = codeDictionary.reqIndicators["false"];

    if ("requirements" in item) {
        const requirements = item.requirements;
        if ("classRequirement" in requirements) {
            const classReq = requirements.classRequirement;
            if (classReq) reqs.add(`${checkMark} §7Class Req: ${snakeToTitle(classReq)}`);
        }
        if ("level" in requirements) {
            const levelReq = requirements.level;
            if (levelReq) reqs.add(`${checkMark} §7Combat Lv. Min: ${levelReq}`);
        }
        skillPointNames.forEach((name) => {
            if (!(name in requirements)) return
            const requirement = requirements[name];
            if (requirement) {
                reqs.add(`${checkMark} §7${upperFirst(name)} Min§7: ${requirement}`);
            }
        });
    }




    sections.add(reqs);

    if (item.identifications) {
        const spSection = new TextSection();
        for (let point of orderedSkillPointIds)
            spSection.add(getFormattedSP(point, item.identifications[point], identifications));
        sections.add(spSection);

        let idSection = new TextSection();
        for (let id of orderedRegularIds) {
            if (!id) {
                sections.add(idSection);
                idSection = new TextSection();
                continue;
            }
            idSection.add(getFormattedId(id, item.identifications[id], identifications,
                true, item.requirements?.classRequirement ?? ""));
        }
        sections.add(idSection);
    }

    // TODO: map item database entries to use Major Id ids.
    if (item.majorIds) {
        let section = new TextSection();
        for (let name in item.majorIds)
            section.add(wrapText(`§b+${name}: §3${
                objectFind(major_id_descriptions, (mId: {name: string}) => mId.name = name).description}`));
        sections.add(section);
    }

    const footer = new TextSection();

    if (item.powderSlots && item.powderSlots > 0) footer.add(`§7[0/${item.powderSlots}] Powder Slots []`);

    if (item.rarity) footer.add(`${codeDictionary.rarityColor[item.rarity]}${upperFirst(item.rarity)} ${snakeToTitle(item.subType)}`);

    // todo: item set, i.e. Set: Morph

    if (item.requirements?.quest) footer.add(`§7Quest Req: ${item.requirements.quest}`);


    if (item.lore) footer.add(`§8${wrapText(item.lore)}`);

    if (item.restrictions) footer.add("§c" +
        (item.restrictions === "untradable" ? "Untradable Item"
            : item.restrictions === "quest item" ? "Quest Item Only!"
                : "Error! Unknown item restriction: " + item.restrictions));

    sections.add(footer);

    return minecraftToHTML(sections.toString());
}