const attackSection = document.querySelector("#attack_display");

function addDamageDisplays(build) {
    var attackStrings = "";

    Object.keys(build.attacks).forEach((attackName) => {
        const attack = build.attacks[attackName];

        attackStrings += attackName + ":\n";
        attackStrings += "Non-Crit:\n";
        for (let i = 0; i < 6; i++) {
            if (attack.max[i] <= 0) continue;
            attackStrings +=
                elementalHeaders[damageTypes[i]] +
                selvify(attack.min[i], true) +
                " - " +
                selvify(attack.max[i], true) +
                "</span><br>";
        }
        attackStrings += "Crit:<br>";
        for (let i = 0; i < 6; i++) {
            if (attack.max[i] <= 0) continue;
            attackStrings +=
                elementalHeaders[damageTypes[i]] +
                selvify(attack.minc[i], true) +
                " - " +
                selvify(attack.maxc[i], true) +
                "</span><br>";
        }
        attackStrings += "<hr>";
    });

    Object.keys(build.heals).forEach((healName) => {
        const heal = build.heals[healName];

        if (heal <= 0) return;

        const healAmount = roundForDisplay(
            build.final.health * (heal / 100) * (1 + build.ids.healingEfficiency / 100),
            true
        );

        attackStrings += "" + healName + ':<br><div class="positive">' + healAmount + "</div><br>";
    });

    // TODO
    if (build.nodes.includes("altruism")) {
        if (build.ids.lifeSteal !== undefined) {
        }
        attackStrings += "\nSpaghetti" + build.ids.lifeSteal;
    }

    attackSection.innerHTML = attackStrings;
}

function selvify(num, addPeriod) {
    return selvs() ? roundForDisplay(num / 80000, addPeriod) + " selv" : roundForDisplay(num, addPeriod);
}
