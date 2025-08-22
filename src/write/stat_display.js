const support = document.getElementById("support_display");

function displayBuildStats(build) {
    if (!build.wynnClass) {
        support.style.display = "none";
        return;
    } else {
        support.style.display = "inline-block";
    }

    const ids = build.ids;
    const stats = build.stats;

    support.innerHTML =
        getStatDisplay("health", true, "Health", stats.health) +
        getStatDisplay("health", false, "Effective Hp", stats.ehp, "", true, true) +
        getStatDisplay("health", false, "EHp (no Agi)", stats.ehp, "", true, true) +
        getStatDisplay("health", true, "Health Regen", stats.healthRegen, "/4s") +
        getStatDisplay("earth", true, "Earth Defence", stats["totalEarthDefence"]) +
        getStatDisplay("thunder", true, "Thunder Defence", stats["totalThunderDefence"]) +
        getStatDisplay("water", true, "Water Defence", stats["totalWaterDefence"]) +
        getStatDisplay("fire", true, "Fire Defence", stats["totalFireDefence"]) +
        getStatDisplay("air", true, "Air Defence", stats["totalAirDefence"]) +
        "<hr>" +
        getStatDisplay("water", true, "Mana Regen", ids.manaRegen, "/5s") +
        getStatDisplay("water", false, "True Mana Regen", stats.trueManaRegen, "/5s", true, true) +
        getStatDisplay("water", true, "Mana Steal", ids.manaSteal, "/3s") +
        getStatDisplay("water", false, "Mana per Hit", stats.manaPerHit, "", true, true) +
        getStatDisplay("water", true, "Total Max Mana", stats.maxMana, "", true, false, 100) +
        getStatDisplay("health", true, "Life Steal", ids.lifeSteal, "/3s") +
        getStatDisplay("health", false, "Life per Hit", stats.lifePerHit, "", true, true) +
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
    document.getElementById(`dev_output`).textContent =
        JSON.stringify(build, undefined, 1);
}