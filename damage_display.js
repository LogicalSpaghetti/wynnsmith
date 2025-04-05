const attackSection = document.querySelector("#attack_display");

function addDamageDisplays(build) {
    var attackStrings = "";

    Object.keys(build.attacks).forEach((attackName) => {
        const attack = build.attacks[attackName];

        attackStrings += "-- " + attackName + ": --\n";
        attackStrings += "Non-Crit:\n";
        for (let i = 0; i < 6; i++) {
            if (attack.max[i] <= 0) continue;
            attackStrings +=
                elementalHeaders[damageTypes[i]] +
                roundForDisplay(attack.min[i], true) +
                " - " +
                roundForDisplay(attack.max[i], true) +
                "</span><br>";
        }
        attackStrings += "Crit:\n";
        for (let i = 0; i < 6; i++) {
            if (attack.max[i] <= 0) continue;
            attackStrings +=
                elementalHeaders[damageTypes[i]] +
                roundForDisplay(attack.minc[i], true) +
                " - " +
                roundForDisplay(attack.maxc[i], true) +
                "</span><br>";
        }
    });

    // TODO
    if (build.nodes.includes("altruism")) {
        if (build.ids.lifeSteal !== undefined) {
        }
        attackStrings += "\nSpaghetti" + build.ids.lifeSteal;
    }

    attackSection.innerHTML = attackStrings;
}
