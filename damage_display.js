const attackSection = document.getElementById("attack_display");

function addDamageDisplays(build) {
    var attackStrings = "";

    Object.keys(build.attacks).forEach((attackName) => {
        const attack = build.attacks[attackName];

        attackStrings += attackName + ": ";

        let hasCost = false;
        Object.keys(build.spells).forEach((spellName) => {
            const spell = build.spells[spellName];
            if (spell.name == attackName) {
                attackStrings += getMana(spell.cost);
                hasCost = true;
            }
        });
        let normAverage = 0;
        let critAverage = 0;
        const elementalAverages = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 6; i++) {
            if (attack.max[i] <= 0) continue;
            normAverage += attack.min[i] + attack.max[i];
            critAverage += attack.minc[i] + attack.maxc[i];
            elementalAverages[i] +=
                ((attack.min[i] + attack.max[i]) * (1 - build.sp.mults[1]) +
                    (attack.minc[i] + attack.maxc[i]) * build.sp.mults[1]) /
                2;
        }
        normAverage /= 2;
        critAverage /= 2;

        const average = normAverage * (1 - build.sp.mults[1]) + critAverage * build.sp.mults[1];

        attackStrings += "<br>";
        if (!(average <= 0 && build.spells["2nd"].name === attackName))
            attackStrings += "Average: " + selvify(average) + "<br>";
        if (showDetailedDamage()) {
            if (!(average <= 0 && build.spells["2nd"].name === attackName) || normAverage < 0)
                attackStrings += "Non-Crit:<br>";
            for (let i = 0; i < 6; i++) {
                if (attack.max[i] <= 0) continue;
                attackStrings +=
                    iconHeaders[prefixes[i]] +
                    selvify(attack.min[i], true) +
                    " - " +
                    selvify(attack.max[i], true) +
                    "</span><br>";
            }
            if (!(average <= 0 && build.spells["2nd"].name === attackName) || critAverage < 0)
                attackStrings += "Crit:<br>";
            for (let i = 0; i < 6; i++) {
                if (attack.max[i] <= 0) continue;
                attackStrings +=
                    iconHeaders[prefixes[i]] +
                    selvify(attack.minc[i], true) +
                    " - " +
                    selvify(attack.maxc[i], true) +
                    "</span><br>";
            }
        } else {
            attackStrings += `<div>`;

            attackStrings +=
                `<span class="color-bar" style="width: ` +
                (elementalAverages[0] * 100) / average +
                `%; background-color: #fca800"></span>`;
            attackStrings +=
                `<span class="color-bar" style="width: ` +
                (elementalAverages[1] * 100) / average +
                `%; background-color: #0a0"></span>`;
            attackStrings +=
                `<span class="color-bar" style="width: ` +
                (elementalAverages[2] * 100) / average +
                `%; background-color: #ff0"></span>`;
            attackStrings +=
                `<span class="color-bar" style="width: ` +
                (elementalAverages[3] * 100) / average +
                `%; background-color: #1cc"></span>`;
            attackStrings +=
                `<span class="color-bar" style="width: ` +
                (elementalAverages[4] * 100) / average +
                `%; background-color: #f11"></span>`;
            attackStrings +=
                `<span class="color-bar" style="width: ` +
                (elementalAverages[5] * 100) / average +
                `%; background-color: #fff"></span>`;
            attackStrings += `</div>`;
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

function getMana(cost) {
    return "(" + iconHeaders["mana"] + roundForDisplay(cost, true) + "</span>)";
}
