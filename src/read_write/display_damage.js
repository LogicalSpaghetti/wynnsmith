function addDamageDisplays(build, attackDisplayId = "attack_display") {
    const attackDisplay = document.getElementById(attackDisplayId);
    attackDisplay.innerHTML = "";

    for (let display of build.displays) {
        const displayElement = createDisplayElement(build, display);
        if (displayElement) attackDisplay.appendChild(displayElement);
    }
}

function createDisplayElement(build, display) {
    const variants =
        display.variants.map(variantName => build.variants.find(variant => variant.internal_name === variantName));
    const hasDefined = variants.find((v) => v != null);
    if (!hasDefined) return;

    const damage = variants.reduce((damage, variant) => variant ? sumDamages(damage, variant.damage) : damage, newMinMax().concat(newMinMax()));
    return (getDamageElement(build, damage, display));
}

function getDamageElement(build, damage, display) {
    const holder = document.createElement("div");
    holder.classList.add("attack-holder");

    let headerText = display.name

    if (display.spell) headerText += ` (${codeDictionaryGenericSymbols["mana"]}${roundForDisplay(build.spell_costs[display.spell], true)}§f)`;

    holder.appendChild(minecraftAsElement(headerText));

    holder.appendChild(document.createElement("br"));

    const averages = [];
    for (let i = 0; i < damage_type_count; i++) {
        averages[i] = 0;
        for (const j in damage) {
            let type_damage = damage[j][i];

            if (j < DamageExtremes.MINC)
                type_damage *= 1 - build.sp_multipliers[SkillPointIndexes.Dexterity];
            else
                type_damage *= build.sp_multipliers[SkillPointIndexes.Dexterity];

            averages[i] += type_damage;
        }
        averages[i] /= 2;
    }

    const average = averages.reduce((x, y) => x + y);
    holder.appendChild(document.createTextNode(selvify(average, true)));

    const barHolder = holder.appendChild(document.createElement("div"));
    barHolder.classList.add("color-bar-holder");

    for (let i = 0; i < damage_type_count; i++) {
        const span = barHolder.appendChild(document.createElement("span"));

        span.classList.add("color-bar");
        console.log(100 * averages[i] / average);
        span.style.width = `${(averages[i] * 100) / average}%`;
        span.style.backgroundColor = damageColors[i];
    }

    return holder;
}

const oneSelv = 80000;

function selvify(num, addPeriod) {
    return loadBoolean("selvs") ? roundForDisplay(num / oneSelv, addPeriod) + ` ${new Date().getMonth() === 11 ? "santa" : "selv"}` : roundForDisplay(num, addPeriod);
}
