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
        getStatDisplay("health", "⚔", "Health", final.health) +
        getStatDisplay("health", "⚔", "Health Regen", final.healthRegen, "/4s") +
        getStatDisplay("earth", "✤", "Earth Defence", final.totalEarthDefence) +
        getStatDisplay("thunder", "✦", "Thunder Defence", final.totalThunderDefence) +
        getStatDisplay("water", "❉", "Water Defence", final.totalWaterDefence) +
        getStatDisplay("fire", "✹", "Fire Defence", final.totalFireDefence) +
        getStatDisplay("air", "❋", "Air Defence", final.totalAirDefence) +
        "<hr></hr>" +
        getStatDisplay("water", "✺", "<b class=\"font-minecraft\"></b>Mana Regen", ids.manaRegen, "/5s") +
        getStatDisplay("water", false, "→ True Mana Regen", final.trueManaRegen, "/5s", false, true) +
        getStatDisplay("water", "✺", "<b class=\"font-minecraft\">✺</b>Mana Steal", ids.manaSteal, "/3s") +
        getStatDisplay("water", "✺", "Total Max Mana", final.maxMana) +
        getStatDisplay("health", "⚔", "Life Steal", ids.lifeSteal, "/3s") +
        getStatDisplay("earth", false, "Poison", ids.poison, "/3s") +
        getStatDisplay("earth", false, "Thorns", ids.thorns, "%") +
        getStatDisplay("thunder", false, "Reflection", ids.reflection, "%") +
        getStatDisplay("fire", false, "Exploding Chance", ids.exploding, "%") +
        getStatDisplay("air", false, "Walk Speed", ids.walkSpeed, "%") +
        getStatDisplay("air", false, "→ Sprint Speed", final.effectiveWS, "m/s", true, true) +
        getStatDisplay("air", false, "Sprint Duration", ids.sprint, "%") +
        getStatDisplay("air", false, "Sprint Regen", ids.sprintRegen, "%") +
        getStatDisplay("air", false, "Jump Height", ids.jumpHeight) +
        getStatDisplay("water", false, "Knockback", ids.knockback) +
        getStatDisplay("thunder", false, "Main Attack Range", ids.mainAttackRange, "%") +
        getStatDisplay("earth", false, "Slow Enemy", ids.slowEnemy, "%") +
        getStatDisplay("earth", false, "Weaken Enemy", ids.weakenEnemy, "%") +
        getStatDisplay("air", false, "Gather Speed", ids.gatherSpeed, "%") +
        getStatDisplay("air", false, "Gather XP Bonus", ids.gatherXpBonus, "%") +
        getStatDisplay("air", false, "Loot Bonus", ids.lootBonus, "%") +
        getStatDisplay("air", false, "Loot Quality", ids.lootQuality, "%") +
        getStatDisplay("air", false, "Stealing", ids.stealing, "%") +
        getStatDisplay("air", false, "XP Bonus", ids.xpBonus, "%") +

        ""
}

function getStatDisplay(colorClass, symbol, label, stat, post, noColor, isSub) {
    if (stat === undefined || stat === NaN) return "";
    return (stat === undefined || stat === NaN) ? "" : 
    ('<div class="stat_row">' + 
        "<div class=\"left" + (isSub ? " sub" : "") + "\">" + 
            "<span class=\"" + colorClass + "\">" + 
                (symbol ? "<b class=\"font-minecraft\">" + symbol + "</b>" : "") + 
                " " + label + 
            ":</span>" + 
        "</div>" + 
        "<div class=\"right " + (noColor ? "" : (Math.sign(stat) === 1 ? "positive" : "negative")) + "\">" + stat + (post === undefined ? "" : post) + 
        "</div>" + 
    "</div>"
);
}
