import {roundForDisplay} from "../../../common/numbers.js";
import {attackSpeedMap, orderedAttackSpeed} from "../../../../data/small_stuff.js";
import {minecraftToHTML} from "../../../common/minecraft_html.js";
import {player_bps} from "./stat_calculations.js";
import * as codeDictionary from "../../../../data/code_dictionary.js";

export function displayBuildStats(build) {
    const support = document.getElementById("support_display");

    if (!build.wynnClass) {
        support.style.display = "none";
        return;
    } else {
        support.style.display = "inline-block";
    }

    const ids = build.identifications;
    const stats = build.stats;

    support.innerHTML =
        getAttackSpeedDisplay(stats.attackSpeed) +
        getStatDisplay("health", true, "Health", stats.health) +
        getStatDisplay("health", false, "Effective Hp", stats.ehp, "", true, true) +
        getStatDisplay("health", false, "EHp (no Agi)", stats.ehp_no_agi, "", true, true) +
        getStatDisplay("health", true, "Health Regen", stats.healthRegen, "/4s") +
        getStatDisplay("health", false, "Effective HPR", stats.ehprPercent, "%/s", true, true) +
        getStatDisplay("earth", true, "Earth Defence", stats.defences[0]) +
        getStatDisplay("thunder", true, "Thunder Defence", stats.defences[1]) +
        getStatDisplay("water", true, "Water Defence", stats.defences[2]) +
        getStatDisplay("fire", true, "Fire Defence", stats.defences[3]) +
        getStatDisplay("air", true, "Air Defence", stats.defences[4]) +
        "<hr>" +
        getStatDisplay("water", true, "Mana Regen", ids.manaRegen, "/5s") +
        getStatDisplay("water", false, "True Mana Regen", stats.trueManaRegen, "/5s", true, true, 25) +
        getStatDisplay("water", true, "Mana Steal", ids.manaSteal, "/3s") +
        getStatDisplay("water", false, "Mana per Hit", stats.manaPerHit, "", true, true) +
        getStatDisplay("water", true, "Total Max Mana", stats.maxMana, "", true, false, 100) +
        getStatDisplay("health", true, "Life Steal", ids.lifeSteal, "/3s") +
        getStatDisplay("health", false, "Life per Hit", stats.lifePerHit, "", true, true) +
        getStatDisplay("health", false, "Effective Life Steal", stats.lsPercent, "%/s", true, true) +
        getStatDisplay("earth", false, "Poison", ids.poison, "/3s") +
        getStatDisplay("earth", false, "Thorns", ids.thorns, "%") +
        getStatDisplay("thunder", false, "Reflection", ids.reflection, "%") +
        getStatDisplay("fire", false, "Exploding Chance", ids.exploding, "%") +
        getStatDisplay("air", false, "Walk Speed", ids.walkSpeed, "%") +
        getStatDisplay("air", false, "Sprint Speed", stats.effectiveWS, "m/s", false, true, player_bps) +
        getStatDisplay("air", false, "Sprint Duration", ids.sprint, "%") +
        getStatDisplay("air", false, "Sprint Regen", ids.sprintRegen, "%") +
        getStatDisplay("air", false, "Jump Height", ids.jumpHeight) +
        getStatDisplay("water", false, "Knockback", ids.knockback, "%") +
        getStatDisplay("thunder", false, "Main Attack Range", ids.mainAttackRange, "%") +
        getStatDisplay("earth", false, "Slow Enemy", ids.slowEnemy, "%") +
        getStatDisplay("earth", false, "Weaken Enemy", ids.weakenEnemy, "%") +
        getStatDisplay("air", false, "Gather Speed", ids.gatherSpeed, "%") +
        getStatDisplay("air", false, "Gather XP Bonus", ids.gatherXpBonus, "%") +
        getStatDisplay("air", false, "Loot Bonus", ids.lootBonus, "%") +
        getStatDisplay("air", false, "Loot Quality", ids.lootQuality, "%") +
        getStatDisplay("air", false, "Stealing", ids.stealing, "%") +
        getStatDisplay("air", false, "XP Bonus", ids.xpBonus, "%");
}

function getStatDisplay(colorClass, includeSymbol, label, stat, post = "", color = true, indent = false, statOrigin = 0) {
    if (stat === undefined || isNaN(stat)) return "";

    const displayStat = roundForDisplay(stat);
    if (displayStat === roundForDisplay(statOrigin)) return "";

    return `<div class='flex-row${indent ? " medium-font" : ""}' ${indent ? `style="line-height: 150%;"` : ""}>` +
        `<div class='left${indent ? " sub" : ""}'>` +
        getStatLabel(includeSymbol, colorClass, indent, label) +
        "</div>" +
        `<span class='right ${(color ? (displayStat > 0 ? "positive" : "negative") : "")}'>${displayStat}${post}</span>` +
        "</div>";
}

function getStatLabel(includeSymbol, colorClass, indent, label) {
    return minecraftToHTML(
        (includeSymbol ? codeDictionary.genericSymbols[colorClass] : codeDictionary.namedColors[colorClass]) +
        (indent ? "→ " : "") + `${label}:`);
}

function getAttackSpeedDisplay(attack_speed) {
    return "<div class='flex-row'>" +
        `<span class="left">${minecraftToHTML("§eAttack Speed:")}</span>` +
        `<span class="right">${minecraftToHTML("§o" + attackSpeedMap[orderedAttackSpeed[attack_speed]])}</span>` +
        "</div>";
}

export function displayForDevelopment(build) {
    document.getElementById(`dev_output`).textContent =
        JSON.stringify(build, undefined, 1);
}