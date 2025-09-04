`use strict`;

function display(input, builds) {
    if (!builds[0]) return;
    displaySkillPoints(input);
    displayBuilds(builds);
    validateTree(input.level, input.wynnClass);
    renderHighlights();
    setPageEmbellishments(input.items.weapons[0].name, input.wynnClass);
    displayEquipOrder(input);
}

function displayPrimaryBuild(build) {
    addDamageDisplays(build);
    displayBuildStats(build);
    setToggles(build);

    displayForDevelopment(build);

    resetCopyText();
}

function displayBuilds(builds) {
    displayPrimaryBuild(builds[0]);
}

function displaySkillPoints(input) {
    const spClusters = document.getElementById("sp_section").querySelectorAll(".sp_cluster");
    const spRemaining = document.getElementById("remaining_sp");

    const firstItemAdded = getItemAddedSP(getItem(input.items.weapons[0].name));
    const assigned = input.sp_assigned.map((sp, i) =>
        sp + input.sp_modified[i]);
    const totals = input.sp_assigned.map((sp, i) =>
        sp + input.sp_provided[i] + input.sp_modified[i] + firstItemAdded[i]);

    for (let cluster of spClusters) {
        const index = damageTypePrefixes.indexOf(cluster.dataset.element) - 1;

        cluster.querySelector(".total_display").textContent = String(totals[index]);
        cluster.querySelector(".assigned_display").textContent = String(assigned[index]);

        if (assigned[index] > 100) addWarning(`Manually assigning ${assigned[index]} Skill Points to ${capitalizedSkillPointNames[index]} is not possible.`);
    }

    const maxSP = 2 * Math.min(input.level - 1, 100);
    const remainingSP = assigned.reduce((a, b) => a - b, maxSP);
    spRemaining.innerHTML = minecraftToHTML(codeDictionaryPositivityColors[remainingSP >= 0] + remainingSP);
    spRemaining.dataset.value = String(remainingSP);
    if (remainingSP < 0) {
        addWarning(`Maximum Skill Points exceeded! For level ${input.level}, there are only ${maxSP} Skill Points available.`);
    }
}

function setPageEmbellishments(weaponName, wynnClass) {
    document.title = `${weaponName} - WynnSmith`;

    let icon = document.querySelector("link[rel~='icon']");
    if (!icon) {
        icon = document.createElement("link");
        icon.rel = "icon";
        document.head.appendChild(icon);
    }
    icon.href = "img/icons/" + wynnClass + ".png";
}

function displayEquipOrder(input) {
    document.getElementById("equip_order").innerHTML =
        "<b>Equip Order:</b><br>" + input.equip_order.join("<br>");
}
