function addDamageDisplays(build, attackDisplayId = "attack_display") {
    const attackDisplay = document.getElementById(attackDisplayId);
    attackDisplay.innerHTML = "";

    // TODO: parent logic
    for (let display of build.displays) {
        const displayElement = createDisplayElement(build, display);
        if (displayElement) attackDisplay.appendChild(displayElement);
    }
}

function createDisplayElement(build, display) {
    const variants =
        display.variants.map(variantName => build.variants.find(variant => variant.internal_name === variantName));
    const hasSomethingToShow =
        build.spell_costs[display.spell] ||
        variants.find(v => v);
    if (!hasSomethingToShow) return;

    const damage = variants.reduce((damage, variant) => variant ? sumDamages(damage, variant.damage) : damage, newMinMax().concat(newMinMax()));
    return (getDamageElement(build, damage, display));
}

function getDamageElement(build, damage, display) {
    const averages = getAverages(damage, build.sp_multipliers[SkillPointIndexes.Dexterity]);
    const average = averages.reduce((x, y) => x + y);

    const holder = document.createElement("div");
    holder.classList.add("attack-holder");

    holder.appendChild(getAttackSpellCostElement(display.name, display.spell, build.spell_costs));
    holder.appendChild(getSimpleDamageElement(display.label, average));
    holder.appendChild(getElementBarElement(averages.map(avg => (avg * 100) / average)));

    return holder;
}

function getSimpleDamageElement(label, average_damage) {
    return minecraftAsElement(`§7${label}: §f${selvify(average_damage, true)}`)
}

function getAttackSpellCostElement(name, spell, spell_costs) {
    const header = document.createElement("div");
    header.appendChild(document.createTextNode(name));

    if (spell) {
        header.appendChild(document.createTextNode(" ("));
        header.appendChild(minecraftAsElement(codeDictionaryGenericSymbols["mana"], true));
        header.appendChild(minecraftAsElement(
            codeDictionaryNamedColors["mana"] + roundForDisplay(spell_costs[spell], true)));
        header.appendChild(document.createTextNode(")"));
    }

    return header;
}

function getAverages(damage, dexterity) {
    const averages = [];
    for (let i = 0; i < damage_type_count; i++) {
        averages[i] = 0;
        for (const j in damage)
            averages[i] += damage[j][i]
                * (j < DamageExtremes.MINC ? 1 - dexterity : dexterity);
        averages[i] /= 2;
    }
    return averages;
}

function getElementBarElement(averages) {
    const barHolder = document.createElement("div");
    barHolder.classList.add("color-bar-holder");

    for (let i = 0; i < damage_type_count; i++) {
        const span = barHolder.appendChild(document.createElement("span"));

        span.classList.add("color-bar");
        span.style.width = `${averages[i]}%`;
        span.style.backgroundColor = damageColors[i];
    }

    return barHolder;
}

const oneSelv = 80000;

function selvify(num, addPeriod) {
    return loadBoolean("selvs") ?
        roundForDisplay(num / oneSelv, addPeriod) + ` ${new Date().getMonth() === 11 ? "santa" : "selv"}`
        : roundForDisplay(num, addPeriod);
}
