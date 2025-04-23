const support = document.querySelector("#support_display")

function displayFinalValues(build) {
    displayStats(build);
}

function displayStats(build) {
    const ids = build.ids;
    const final = build.final;

    outputAll.textContent = JSON.stringify(build)
        .replaceAll(',"', ',\n"')
        .replaceAll("{", "{\n")
        .replaceAll("}", "\n}")
        .replaceAll("[", "[\n")
        .replaceAll("]", "\n]")
        .replaceAll("{\n\n}", "{}")
        .replaceAll("[\n\n]", "[]");
    
    support.innerHTML = 
        getStatDisplay("health", "<b class=\"font-minecraft\">⚔</b> Health", final.health) +
        getStatDisplay("health", "<b class=\"font-minecraft\">⚔</b> Health Regen", final.healthRegen, "/4s") +
        getStatDisplay("earth", "<b class=\"font-minecraft\">✤</b> Earth Defence", final.totalEarthDefence) +
        getStatDisplay("thunder", "<b class=\"font-minecraft\">✦</b> Thunder Defence", final.totalThunderDefence) +
        getStatDisplay("water", "<b class=\"font-minecraft\">❉</b> Water Defence", final.totalWaterDefence) +
        getStatDisplay("fire", "<b class=\"font-minecraft\">✹</b> Fire Defence", final.totalFireDefence) +
        getStatDisplay("air", "<b class=\"font-minecraft\">❋</b> Air Defence", final.totalAirDefence) +
        "<hr></hr>" +
        getStatDisplay("water", "<b class=\"font-minecraft\">✺</b>Mana Regen", ids.manaRegen, "/5s") +
        getStatDisplay("water", "→ True Mana Regen", final.trueManaRegen, "/5s", false, true) +
        getStatDisplay("water", "<b class=\"font-minecraft\">✺</b>Mana Steal", ids.manaSteal, "/3s") +
        getStatDisplay("water", "Total Max Mana", final.maxMana) +
        getStatDisplay("health", "<b class=\"font-minecraft\">⚔</b> Life Steal", ids.lifeSteal, "/3s") +
        getStatDisplay("earth", "Poison", ids.poison, "/3s") +
        getStatDisplay("earth", "Thorns", ids.thorns, "%") +
        getStatDisplay("thunder", "Reflection", ids.reflection, "%") +
        getStatDisplay("fire", "Exploding Chance", ids.exploding, "%") +
        getStatDisplay("air", "Walk Speed", ids.walkSpeed, "%") +
        getStatDisplay("air", "→ Sprint Speed", final.effectiveWS, "m/s", true, true) +
        getStatDisplay("air", "Sprint Duration", ids.sprint, "%") +
        getStatDisplay("air", "Sprint Regen", ids.sprintRegen, "%") +
        getStatDisplay("air", "Jump Height", ids.jumpHeight) +
        getStatDisplay("water", "Knockback", ids.knockback) +
        getStatDisplay("air", "Main Attack Range", ids.mainAttackRange, "%") +
        getStatDisplay("earth", "Slow Enemy", ids.slowEnemy, "%") +
        getStatDisplay("earth", "Weaken Enemy", ids.weakenEnemy, "%") +
        getStatDisplay("air", "Gather Speed", ids.gatherSpeed, "%") +
        getStatDisplay("air", "Gather XP Bonus", ids.gatherXpBonus, "%") +
        getStatDisplay("air", "Loot Bonus", ids.lootBonus, "%") +
        getStatDisplay("air", "Loot Quality", ids.lootQuality, "%") +
        getStatDisplay("air", "Stealing", ids.stealing, "%") +
        getStatDisplay("air", "XP Bonus", ids.xpBonus, "%") +

        ""
}

function getStatDisplay(colorClass, label, stat, post, noColor, isSub) {
    return (stat === undefined || stat === NaN) ? "" : ("<div class=\"stat_row\"><div class=\"left" + (isSub ? " sub" : "") + "\">" + "<span class=\"" + colorClass + "\">" + label + ":</span>" + "</div><div class=\"right " + (noColor ? "" : (Math.sign(stat) === 1 ? "positive" : "negative")) + "\">" + stat + (post === undefined ? "" : post) + "</div></div>");
}
