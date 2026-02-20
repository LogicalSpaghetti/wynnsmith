import {getItemAddedSP, getSkillPointName} from "../skill_point/skill_points.ts";
import * as search from "../database/item_database.ts";
import {damageTypePrefixes} from "../misc/small_stuff.ts";
import {addWarning} from "./warnings.js";
import {minecraftToHTML} from "../hover_html/minecraft_html.ts";
import {renderHighlights, setToggles, validateTree} from "../ability/ability.js";
import {displayStats, displayForDevelopment} from "../stats/display_stats.js";
import addDamageDisplays from "../attack/attack_display.js";
import * as codeDictionary from "../../js_data/code_dictionary.ts";

export function displayBuilds(input, builds) {
    if (!builds?.[0]) return;
    displaySkillPoints(input);
    displayPrimaryBuild(builds[0]);
    validateTree(input.level, input.wynnClass);
    renderHighlights();
    setPageEmbellishments(input.items.weapon.name, input.wynnClass);
    displayEquipOrder(input);
}

function displayPrimaryBuild(build) {
    addDamageDisplays(build);
    displayStats(build);
    setToggles(build);

    displayForDevelopment(build);

    resetCopyText();
}

function displaySkillPoints(input) {
    const spClusters = document.getElementById("sp_section").querySelectorAll(".sp_cluster");
    const spRemaining = document.getElementById("remaining_sp");

    // TODO: needs 1st build info to know Tome SP, and id multiplier SP.
    const firstItemAdded = getItemAddedSP(search.getItemByName(input.items.weapon.name));
    const assigned = input.sp_assigned.map((sp, i) =>
        sp + input.sp_modified[i]);
    const totals = input.sp_assigned.map((sp, i) =>
        sp + input.sp_provided[i] + input.sp_modified[i] + firstItemAdded[i]);

    for (let cluster of spClusters) {
        const index = damageTypePrefixes.indexOf(cluster.dataset.element) - 1;

        cluster.querySelector(".total_display").textContent = String(totals[index]);
        cluster.querySelector(".assigned_display").textContent = String(assigned[index]);

        if (assigned[index] > 100) addWarning(`Manually assigning ${assigned[index]} Skill Points to ${getSkillPointName(index)} is not possible.`);
    }

    const maxSP = 2 * Math.min(input.level - 1, 100);
    const remainingSP = assigned.reduce((a, b) => a - b, maxSP);
    spRemaining.innerHTML = minecraftToHTML(codeDictionary.positivityColors[remainingSP >= 0] + remainingSP);
    spRemaining.dataset.value = String(remainingSP);
    if (remainingSP < 0) {
        addWarning(`Maximum Skill Points exceeded! For level ${input.level}, there are only ${maxSP} Skill Points available.`);
    }
}

function setPageEmbellishments(weaponName, wynnClass) {
    document.title = `${weaponName} - WynnSmith`;

    let icon = document.querySelector("link[rel='icon']");
    if (!icon) {
        icon = document.createElement("link");
        icon.rel = "icon";
        document.head.appendChild(icon);
    }
    icon.href = "img/icons/" + wynnClass + ".png";
}

function displayEquipOrder(input) {
    const element = document.getElementById("equip_order");
    if (!input.items.weapons.length) {
        element.innerHTML = "<b>Input Weapon to Begin</b>";
        return;
    }
    if (input.equip_order.length)
        element.innerHTML = "Equip Order:<br>" + minecraftToHTML(input.equip_order
            .map(name => codeDictionary.rarityColor[search.getItemByName(name).rarity] + name)
            .join("\n"));
    else element.innerHTML = "<span class=''>No Equipment Added</span>";

}

function resetCopyText() {
    document.querySelectorAll(".copy_button").forEach(button =>
        button.textContent = button.dataset["default"]);
}
