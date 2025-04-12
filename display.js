const support = document.querySelector("#support_display")

function displayFinalValues(build) {
    displayStats(build);
}

function displayStats(build) {
    outputAll.textContent = JSON.stringify(build)
        .replaceAll(',"', ',\n"')
        .replaceAll("{", "{\n")
        .replaceAll("}", "\n}")
        .replaceAll("[", "[\n")
        .replaceAll("]", "\n]")
        .replaceAll("{\n\n}", "{}")
        .replaceAll("[\n\n]", "[]");
    
    const maxMana = 
        roundForDisplay(100 + getSPMult(spInputs[2].value) * 100 + ((build.ids.rawMaxMana === undefined) ? 0 : build.ids.rawMaxMana));

    support.innerHTML = 
        getStatDisplay("health", "<b class=\"font-minecraft\">⚔</b> Health", build.final.health) +
        getStatDisplay("health", "<b class=\"font-minecraft\">⚔</b> Health Regen", build.final.healthRegen, "/4s") +
        getStatDisplay("earth", "<b class=\"font-minecraft\">✤</b> Earth Defence", build.final.totalEarthDefence) +
        getStatDisplay("thunder", "<b class=\"font-minecraft\">✦</b> Thunder Defence", build.final.totalThunderDefence) +
        getStatDisplay("water", "<b class=\"font-minecraft\">❉</b> Water Defence", build.final.totalWaterDefence) +
        getStatDisplay("fire", "<b class=\"font-minecraft\">✹</b> Fire Defence", build.final.totalFireDefence) +
        getStatDisplay("air", "<b class=\"font-minecraft\">❋</b> Air Defence", build.final.totalAirDefence) +
        "<hr></hr>" +
        getStatDisplay("water", "<b class=\"font-minecraft\">✺</b>Mana Regen", build.ids.manaRegen, "/5s") +
        (build.ids.manaRegen === undefined ? "" : (getStatDisplay("water", "→ True Mana Regen",(25 + build.ids.manaRegen), "/5s", false, true))) +
        getStatDisplay("water", "<b class=\"font-minecraft\">✺</b>Mana Steal", build.ids.manaSteal, "/3s") +
        (maxMana === 100 ? "" : getStatDisplay("water", "Total Max Mana", maxMana)) +
        getStatDisplay("health", "<b class=\"font-minecraft\">⚔</b> Life Steal", build.ids.lifeSteal, "/3s") +
        getStatDisplay("earth", "Poison", build.ids.poison, "%") +
        getStatDisplay("earth", "Thorns", build.ids.thorns, "%") +
        getStatDisplay("thunder", "Reflection", build.ids.reflection, "%") +
        getStatDisplay("fire", "Exploding Chance", build.ids.exploding, "%") +
        getStatDisplay("air", "Walk Speed", build.ids.walkSpeed, "%") +
        getStatDisplay("air", "→ Sprint Speed", (build.ids.walkSpeed === undefined) ? undefined : roundForDisplay(5.612 * ((build.ids.walkSpeed / 100) + 1)), "m/s", true, true) +
        getStatDisplay("air", "Sprint Duration", build.ids.sprint, "%") +
        getStatDisplay("air", "Sprint Regen", build.ids.sprintRegen, "%") +
        getStatDisplay("air", "Jump Height", build.ids.jumpHeight) +
        getStatDisplay("water", "Knockback", build.ids.knockback) +
        getStatDisplay("air", "Main Attack Range", build.ids.mainAttackRange, "%") +
        getStatDisplay("earth", "Slow Enemy", build.ids.slowEnemy, "%") +
        getStatDisplay("earth", "Weaken Enemy", build.ids.weakenEnemy, "%") +
        getStatDisplay("air", "Gather Speed", build.ids.gatherSpeed, "%") +
        getStatDisplay("air", "Gather XP Bonus", build.ids.gatherXpBonus, "%") +
        getStatDisplay("air", "Loot Bonus", build.ids.lootBonus, "%") +
        getStatDisplay("air", "Loot Quality", build.ids.lootQuality, "%") +
        getStatDisplay("air", "Stealing", build.ids.stealing, "%") +
        getStatDisplay("air", "XP Bonus", build.ids.xpBonus, "%") +

        ""
}

function getStatDisplay(colorClass, label, stat, post, noColor, isSub) {
    return (stat === undefined || stat === NaN) ? "" : ("<div class=\"stat_row\"><div class=\"left" + (isSub ? " sub" : "") + "\">" + "<span class=\"" + colorClass + "\">" + label + ":</span>" + "</div><div class=\"right " + (noColor ? "" : (Math.sign(stat) === 1 ? "positive" : "negative")) + "\">" + stat + (post === undefined ? "" : post) + "</div></div>");
}
