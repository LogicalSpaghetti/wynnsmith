import * as search from "../../control/item_search.js";
import {getItemAddedSP} from "../skill_point/skill_points.js";
import {attackSpeedMultipliers, damageTypeNames, damageTypePrefixes, orderedAttackSpeed} from "../../../../data/small_stuff.ts";
import {getPowderData} from "./powders.ts";
import {addIdsToObject} from "../build/permute.js"; // TODO: move all related from permute.js to here

const radianceExcludedIds = Object.freeze([
    "xpBonus", "lootBonus", "lootQuality", "gatherXpBonus", "gatherSpeed",
    "rawStrength", "rawDexterity", "rawIntelligence", "rawDefense", "rawAgility"
]);

export default function modifyIdentifications(build) {
    radiance(build);
    addOtherIdSources(build);

    getMeleeAttackSpeed(build);
}

function radiance(build) {
    for (let radiance of build.id_multipliers) for (let idName in build.identifications) {
        if (radianceExcludedIds.includes(idName)) continue;
        if (build.identifications[idName] <= 0) continue;
        const multiplier = (1 + radiance.multiplier / 100) + Number.EPSILON;
        build.identifications[idName] = Math.floor(build.identifications[idName] * multiplier);
    }
}

function addOtherIdSources(build) {
    addBasePlayerStats(build);

    addPowderDefences(build);

    applyExternalBuffs(build);

    includeTomes(build);
    includeCharms(build);

    addSkillPointPercents(build);

    applyStatEffects(build);
}

function addBasePlayerStats(build) {
    build.base.baseHealth += 5 + build.level * 5;
}

function addPowderDefences(build) {
    for (let equipment of build.equipment) if (equipment)
        for (let powder of equipment.powders.map(name => getPowderData(name))) for (let i in powder.def)
            addBaseToObject(build.base, `base${damageTypeNames[i]}Defence`, powder.def[i]);
}

export function addBaseToObject(object, baseKey, base) {
    if (!base) return;
    if (Number.isInteger(base)) {
        object[baseKey] += base;
    } else {
        addMinAndMaxTo(object[baseKey], base);
    }
}

function addMinAndMaxTo(target, source) {
    target.min += source.min;
    target.max += source.max;
}

function applyExternalBuffs(build) {
    // TODO
    // Consumables
    // LR boons
    // Raid Buffs
    // etc.
}

function includeTomes(build) {
    for (let tome of build.tomes) if (tome)
        build.identifications = addIdsToObject(build.identifications, search.getItemByName(tome.name).identifications);
}

function includeCharms(build) {
    // TODO
}

function addSkillPointPercents(build) {
    for (let i = 0; i < build.sp_multipliers.length; i++) {
        const multiplier = build.sp_multipliers[i] * 100;

        build.identifications[damageTypePrefixes[i + 1] + "MainAttackDamage"] += multiplier;
        build.identifications[damageTypePrefixes[i + 1] + "SpellDamage"] += multiplier;
    }
}

function getMeleeAttackSpeed(build) {
    build.stats.attackSpeed =
        Math.max(0, Math.min(Object.keys(attackSpeedMultipliers).length - 1,
                orderedAttackSpeed.indexOf(build.base.attackSpeed) + build.identifications.rawAttackSpeed
            )
        );
}

function applyStatEffects(build) {
    // TODO: effect stat modifiers
    // if (build.has("toggles", "maskOfTheCoward"))
    //     ids.walkSpeed +=
    //         80 + ((aspects.shaman["Aspect of Stances"][build.aspects["Aspect of Stances"] - 1] ?? {}).heretic ?? 0);
    // if (build.has("toggles", "maskOfTheAwakened"))
    //     ids.walkSpeed +=
    //         80 + ((aspects.shaman["Aspect of Stances"][build.aspects["Aspect of Stances"] - 1] ?? {}).heretic ?? 0);
    // if (build.has("toggles", "maskOfTheFanatic")) ids.walkSpeed -= 35;
    // if (build.has("toggles", "cowardMemory")) ids.slowEnemy += 30;
}
