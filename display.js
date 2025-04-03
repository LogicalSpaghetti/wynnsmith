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
    
    support.innerHTML = 
        getStatDisplay("<span class=\"health\"><b class=\"font-minecraft\">⚔</b> Health:</span> ", build.final.health) +
        getStatDisplay("<span class=\"health\"><b class=\"font-minecraft\">⚔</b> Health Regen:</span>", build.final.healthRegen, "/4s") +
        getStatDisplay("<span class=\"earth\"><b class=\"font-minecraft\">✤</b> Earth Defence:</span>", build.final.totalEarthDefence) +
        getStatDisplay("<span class=\"thunder\"><b class=\"font-minecraft\">✦</b> Thunder Defence:</span>", build.final.totalThunderDefence) +
        getStatDisplay("<span class=\"water\"><b class=\"font-minecraft\">❉</b> Water Defence:</span>", build.final.totalWaterDefence) +
        getStatDisplay("<span class=\"fire\"><b class=\"font-minecraft\">✹</b> Fire Defence:</span>", build.final.totalFireDefence) +
        getStatDisplay("<span class=\"air\"><b class=\"font-minecraft\">❋</b> Air Defence:</span>", build.final.totalAirDefence) +
        "<hr></hr>" +
        getStatDisplay("<span class=\"water\"><b class=\"font-minecraft\">✺</b> Mana Regen:</span> ", build.ids.manaRegen, "/5s") +
        getStatDisplay("<span class=\"water\">\t➜ True Mana Regen:</span>",(25 + (build.ids.manaRegen === undefined ? 0 : build.ids.manaRegen)), "/5s", false, true) +
        getStatDisplay("<span class=\"health\"><b class=\"font-minecraft\">⚔</b> Life Steal:</span>", build.ids.lifeSteal, "/3s") +
        getStatDisplay("<span class=\"earth\">Thorns:</span>", build.ids.thorns, "%") +
        getStatDisplay("<span class=\"thunder\">Reflection:</span>", build.ids.reflection, "%") +
        getStatDisplay("<span class=\"fire\">Exploding Chance:</span>", build.ids.exploding, "%") +
        getStatDisplay("<span class=\"air\">Walk Speed %:</span> ", build.ids.walkSpeed, "%") 
}

function getStatDisplay(label, stat, post, noColor, isSub) {
    return (stat === undefined || stat === NaN) ? "" : ("<div class=\"stat_row\"><div class=\"left" + (isSub ? " sub" : "") + "\">" + label + "</div><div class=\"right " + (noColor ? "" : (Math.sign(stat) === 1 ? "positive" : "negative")) + "\">" + stat + (post === undefined ? "" : post) + "</div></div>");
}
