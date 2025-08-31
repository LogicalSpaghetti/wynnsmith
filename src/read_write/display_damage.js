function addDamageDisplays(build, attackDisplayId = "attack_display") {
    const dexterity = build.sp_multipliers[SkillPointIndexes.Dexterity];

    const attackDisplay = document.getElementById(attackDisplayId);
    attackDisplay.innerHTML = "";

    const parentDisplays = [];
    const sortedChildDisplays = {};

    for (let display of build.displays) {
        if (display.parent) addToSortingObject(sortedChildDisplays, display, display.parent);
        else parentDisplays.push(display);
    }

    console.log(parentDisplays);
    console.log(sortedChildDisplays);

    for (let display of parentDisplays) {
        const children = sortedChildDisplays[display.internal_name];
        console.log(display.internal_name);
        const displayElement =
            createDisplayElement(display, children, build.variants, dexterity, build.spell_costs);
        if (displayElement) attackDisplay.appendChild(displayElement);
    }
}

function addToSortingObject(sortingObject, entry, entryCategory) {
    if (!sortingObject[entryCategory]) sortingObject[entryCategory] = [];
    sortingObject[entryCategory].push(entry);
}

function createDisplayElement(display, children, variants, dexterity, spell_costs) {
    const data = getDisplayData(display, variants, dexterity, spell_costs);
    if (!isDisplayWorthShowing(data)) return null;

    console.log(children)

    const holder = document.createElement("div");
    holder.classList.add("attack-group")

    holder.appendChild(getDamageElement(display, data.damage, data.spell_cost, dexterity));

    if (children) for (let child of children) {
        const childElement = createChildDisplayElement(child, variants, dexterity, spell_costs);
        if (childElement) holder.appendChild(childElement);
    }

    return holder;
}

function getDisplayData(display, variants, dexterity, spell_costs) {
    const displayVariants = getVariantsForDisplay(display, variants);
    const spell_cost = spell_costs[display.spell];
    const damage = displayVariants.reduce((damage, variant) => variant ? sumDamages(damage, variant.damage) : damage, newMinMax().concat(newMinMax()));

    return {
        variants: displayVariants,
        damage: damage,
        spell_cost: spell_cost
    };
}

function isDisplayWorthShowing(displayData) {
    return displayData.spell_cost || displayData.variants.length;
}

function createChildDisplayElement(childDisplay, variants, dexterity, spell_costs) {
    const data = getDisplayData(childDisplay, variants, dexterity, spell_costs);
    return isDisplayWorthShowing(data) ? getChildDamageElement(childDisplay, data.damage, data.spell_cost, dexterity) : null;
}

function getVariantsForDisplay(display, variants) {
    return display.variants.map(variantName => variants.find(variant => variant.internal_name === variantName))
        .filter(v => v != null);
}

function getDamageElement(display, damage, spell_cost, dexterity) {
    const averages = getAverages(damage, dexterity);
    const average = averages.reduce((x, y) => x + y);

    const holder = document.createElement("div");
    holder.classList.add("attack-holder");

    holder.appendChild(getAttackSpellCostElement(display.name, spell_cost));
    holder.appendChild(getSimpleDamageElement(display.label, average));
    holder.appendChild(getElementBarElement(averages.map(avg => (avg * 100) / average)));

    return holder;
}

function getChildDamageElement(display, damage, spell_cost, dexterity) {
    const averages = getAverages(damage, dexterity);
    const average = averages.reduce((x, y) => x + y);

    const holder = document.createElement("div");
    holder.classList.add("flex-row");
    holder.classList.add("medium-font");

    const left = holder.appendChild(document.createElement("span"));
    left.textContent = "↳";
    left.classList.add("left");

    holder.appendChild(getSimpleDamageElement(display.label, average));

    return holder;
}

function getSimpleDamageElement(label, average_damage) {
    return minecraftAsElement(`§7${label}: §f${selvify(average_damage, true)}`);
}

function getAttackSpellCostElement(name, spell_cost, holderType = "div") {
    const header = document.createElement(holderType);
    header.appendChild(document.createTextNode(name));

    if (spell_cost) {
        header.appendChild(document.createTextNode(" ("));
        header.appendChild(minecraftAsElement(codeDictionaryGenericSymbols["mana"], true));
        header.appendChild(minecraftAsElement(
            codeDictionaryNamedColors["mana"] + roundForDisplay(spell_cost, true)));
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
