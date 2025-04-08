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
        attackStrings += "Crit:<br>";
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
