const attackSection = document.querySelector("#attack_display");

function addDamageDisplays(build) {
    var attackStrings = "";

    Object.keys(build.attacks).forEach((attackName) => {
        const attack = build.attacks[attackName];
        attackStrings += attackName + ":\n";
        for (let i = 0; i < 6; i++) {
            if (attack.max[i] <= 0) continue;
            attackStrings +=
                "   " +
                damageTypes[i] +
                ": " +
                roundForDisplay(attack.min[i]) +
                " - " +
                roundForDisplay(attack.max[i]) +
                "\n";
        }
    });

    attackSection.textContent = attackStrings;
}
