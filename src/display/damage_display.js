function addDamageDisplays(build, attackDisplayId = "attack_display") {
    let html = "";

    html += getNewAttackHTML(build);

    document.getElementById(attackDisplayId).innerHTML = html;
}

function getNewAttackHTML(build) {
    let html = "";

    // doing this explicitly until I can abstract away child attack types
    html += perAttackHTML(build, "Melee DPS");
    html += perAttackHTML(build, "Melee Total");
    html += perAttackHTML(build, "Melee");
    html += perAttackHTML(build, "Totem");

    return html;
}

function perAttackHTML(build, name) {
    if (!build.has("old_attacks", name)) return "";

    let html = "";
    html += "<div class='attack-holder'>";

    const attack = build.old_attacks[name];

    html += name + " ";

    Object.keys(build.spells).forEach((spellName) => {
        const spell = build.spells[spellName];
        if (spell.name === name) {
            html += getMana(spell.cost);
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

    html += "<br>";

    if (!(average <= 0 && build.spells["2nd"].name === name)) html += "Average: " + selvify(average) + "<br>";
    if (loadBoolean("detailed_damage")) {
        if (!(average <= 0 && build.spells["2nd"].name === name) || normAverage < 0) html += "Non-Crit:<br>";
        for (let i = 0; i < 6; i++) {
            if (attack.max[i] <= 0) continue;
            html +=
                iconHeaders[elementalPrefixes[i]] +
                selvify(attack.min[i], true) +
                " – " +
                selvify(attack.max[i], true) +
                "</span><br>";
        }
        if (!(average <= 0 && build.spells["2nd"].name === name) || critAverage < 0) html += "Crit:<br>";
        for (let i = 0; i < 6; i++) {
            if (attack.max[i] <= 0) continue;
            html +=
                iconHeaders[elementalPrefixes[i]] +
                selvify(attack.minc[i], true) +
                " – " +
                selvify(attack.maxc[i], true) +
                "</span><br>";
        }
    }

    html += `<div class="color-bar-holder">`;
    for (let i = 0; i < 6; i++) {
        html +=
            `<span class="color-bar" style="width: ` +
            (elementalAverages[i] * 100) / average +
            `%; background-color: ` +
            getDamageColor(i) +
            `"></span>`;
    }
    html += `</div>`;

    html += "</div>";
    return html;
}

function getDamageColor(index) {
    switch (index) {
        case 0:
            return "#fca800";
        case 1:
            return "#0a0";
        case 2:
            return "#ff0";
        case 3:
            return "#1cc";
        case 4:
            return "#f11";
        case 5:
            return "#fff";
        default:
            return "#ff00ff";
    }
}

const oneSelv = 80000;

function selvify(num, addPeriod) {
    return loadBoolean("selvs") ? roundForDisplay(num / oneSelv, addPeriod) + ` ${new Date().getMonth() === 11 ? "santa" : "selv"}` : roundForDisplay(num, addPeriod);
}

function getMana(cost) {
    return "(" + iconHeaders["mana"] + roundForDisplay(cost, true) + "</span>)";
}
