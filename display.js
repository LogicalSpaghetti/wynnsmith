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
        getStatDisplay("<span class=\"health\"><b class=\"font-minecraft\">⚔</b> Total Health:</span> ", build.final.health, "", true) +
        getStatDisplay("<span class=\"health\"><b class=\"font-minecraft\">⚔</b> Total Health Regen: </span>", build.final.healthRegen) +
        getStatDisplay("Total <span class=\"earth\"><b class=\"font-minecraft\">✤</b> Earth Defence: </span>", build.final.totalEarthDefence) +
        getStatDisplay("Total <span class=\"thunder\"><b class=\"font-minecraft\">✦</b> Thunder Defence: </span>", build.final.totalThunderDefence) +
        getStatDisplay("Total <span class=\"water\"><b class=\"font-minecraft\">❉</b> Water Defence: </span>", build.final.totalWaterDefence) +
        getStatDisplay("Total <span class=\"fire\"><b class=\"font-minecraft\">✹</b> Fire Defence: </span>", build.final.totalFireDefence) +
        getStatDisplay("Total <span class=\"air\"><b class=\"font-minecraft\">❋</b> Air Defence: </span>", build.final.totalAirDefence) +
        "\n<hr></hr>" +
        getStatDisplay("<span class=\"mana\"><b class=\"font-minecraft\">✺</b> Mana Regen:</span> ", build.ids.manaRegen, "/5s", true) +
        getStatDisplay("<span class=\"mana\"> ➜ True Mana Regen:</span> ", (build.ids.manaRegen + 25), "/5s") +
        getStatDisplay("<span class=\"health\"><b class=\"font-minecraft\">⚔</b> Healing Efficiency %: </span>", build.ids.healingEfficiency, "%") +
        getStatDisplay("<span class=\"health\"><b class=\"font-minecraft\">⚔</b> Life Steal: </span>", build.ids.lifeSteal, "/3s") +
        getStatDisplay("Thorns: ", build.ids.thorns, "%") +
        getStatDisplay("Reflection: ", build.ids.reflection, "%") +
        getStatDisplay("Exploding Chance: ", build.ids.exploding, "%") +
        getStatDisplay("Walk Speed %: ", build.ids.walkSpeed, "%") 
}

function getStatDisplay(label, stat, post, removeNew) {
    return (stat === undefined || stat === NaN) ? "" : (removeNew ? "" : "\n") + label + stat + (post === undefined ? "" : post);
}
