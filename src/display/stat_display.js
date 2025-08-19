const support = document.getElementById("support_display");

function displayBuildStats(build) {
    removeAllZeros(build);
    displayStats(build);
}

function removeAllZeros(build) {
    // deleteAllZerosFromObject(build.ids);
    // deleteAllZerosFromObject(build.base);
    // deleteAllZerosFromObject(build.final);
}

function displayStats(build) {
    const ids = build.ids;
    const final = build.final;

    // simple check for whether the build has a weapon, TODO: replace with better hide logic
    if (build.wynnClass === undefined) {
        support.style.display = "none";
        return;
    } else {
        support.style.display = "inline-block";
    }

    support.innerHTML =
        getStatDisplay("health", true, "Health", final.health) +
        getStatDisplay("health", false, "Effective Hp", final.ehp, "", true, true) +
        getStatDisplay("health", false, "EHp (no Agi)", final.ehp, "", true, true) +
        getStatDisplay("health", true, "Health Regen", final.healthRegen, "/4s") +
        getStatDisplay("earth", true, "Earth Defence", final["totalEarthDefence"]) +
        getStatDisplay("thunder", true, "Thunder Defence", final["totalThunderDefence"]) +
        getStatDisplay("water", true, "Water Defence", final["totalWaterDefence"]) +
        getStatDisplay("fire", true, "Fire Defence", final["totalFireDefence"]) +
        getStatDisplay("air", true, "Air Defence", final["totalAirDefence"]) +
        "<hr>" +
        getStatDisplay("water", true, "Mana Regen", ids.manaRegen, "/5s") +
        getStatDisplay("water", false, "True Mana Regen", final.trueManaRegen, "/5s", true, true) +
        getStatDisplay("water", true, "Mana Steal", ids.manaSteal, "/3s") +
        getStatDisplay("water", false, "Mana per Hit", final.manaPerHit, "", true, true) +
        getStatDisplay("water", true, "Total Max Mana", final.maxMana, "", true, false, 100) +
        getStatDisplay("health", true, "Life Steal", ids.lifeSteal, "/3s") +
        getStatDisplay("health", false, "Life per Hit", final.lifePerHit, "", true, true) +
        getStatDisplay("earth", false, "Poison", ids.poison, "/3s") +
        getStatDisplay("earth", false, "Thorns", ids.thorns, "%") +
        getStatDisplay("thunder", false, "Reflection", ids.reflection, "%") +
        getStatDisplay("fire", false, "Exploding Chance", ids.exploding, "%") +
        getStatDisplay("air", false, "Walk Speed", ids.walkSpeed, "%") +
        getStatDisplay("air", false, "Sprint Speed", final.effectiveWS, "m/s", false, true, player_bps) +
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

    return (
        "<div class=\"stat_row\">" +
        "<div class=\"left" + (indent ? " sub" : "") + "\">" +
        (includeSymbol ? iconHeaders[colorClass] : colorHeaders[colorClass]) +
        (indent ? "→ " : "") +
        label +
        ":</span>" +
        "</div>" +
        "<div class=\"right " + (color ? (displayStat > 0 ? "positive" : "negative") : "") + "\">" +
        displayStat + post +
        "</div>" +
        "</div>"
    );
}

function displayForDevelopment(build) {
    roundAllForDisplay(build);

    const devOutput = document.getElementById(`dev_output`);
    devOutput.textContent = JSON.stringify(build, undefined, 1);
}

function roundAllForDisplay(build) {
    const base = build.base;
    Object.keys(base).forEach((baseName) => {
        if (!Number.isInteger(base[baseName])) return;
        base[baseName] = roundForDisplay(base[baseName]);
    });
    const ids = build.ids;
    Object.keys(ids).forEach((idName) => {
        ids[idName] = roundForDisplay(ids[idName]);
    });
    const final = build.final;
    Object.keys(final).forEach((idName) => {
        final[idName] = roundForDisplay(final[idName]);
    });
}