`use strict`;

// enum
const DamageExtremes = Object.freeze({
    MIN: 0,
    MAX: 1,
    MINC: 2,
    MAXC: 3
});

function calculateDamageConversions(build) {
    damageIdsToArrays(build);

    addPowderBase(build);

    convertBase(build);
    convertRaw(build);
    powderNeutralConversions(build);

    applyPercents(build);
    applyMasteries(build);
    applySpellAttackSpeed(build);

    mergeAttackDamage(build);

    applyPersonalDamageMultipliers(build);
    applyOverridingDamageMultipliers(build);
    applyStrDex(build);

    addAttackVariants(build);
    zeroNegatives(build);
}

function damageIdsToArrays(build) {
    const statArrays = build.statArrays;
    const base = build.base;
    const ids = build.ids;

    base.damage = [
        [
            base.baseDamage.min,
            base.baseEarthDamage.min,
            base.baseThunderDamage.min,
            base.baseWaterDamage.min,
            base.baseFireDamage.min,
            base.baseAirDamage.min
        ],
        [
            base.baseDamage.max,
            base.baseEarthDamage.max,
            base.baseThunderDamage.max,
            base.baseWaterDamage.max,
            base.baseFireDamage.max,
            base.baseAirDamage.max
        ]
    ];

    statArrays.rawDamages = {
        MainAttack: [],
        Spell: []
    };

    for (let i in damageTypeNames) {
        const type = damageTypeNames[i];
        for (let category in statArrays.rawDamages)
            statArrays.rawDamages[category][i] =
                ids[`raw${type}${category}Damage`] + ids[`raw${type}Damage`];
    }

    ids.rawElementalSpellDamage += ids.rawElementalDamage;
    ids.rawElementalMainAttackDamage += ids.rawElementalDamage;

    statArrays.percentDamages = {
        MainAttack: [],
        Spell: []
    };

    damageTypePrefixes.forEach((prefix, i) => {
        const type = damageTypePrefixes[i];
        const typedDamage =
            ids.damage + ids[type + "Damage"] + (i === neutral_index ? 0 : ids.elementalDamage);

        statArrays.percentDamages.MainAttack[i] =
            ids[type + "MainAttackDamage"] +
            ids.mainAttackDamage +
            typedDamage +
            (i === neutral_index ? 0 : ids["elementalMainAttackDamage"]);

        statArrays.percentDamages.Spell[i] =
            ids[type + "SpellDamage"] +
            ids.spellDamage +
            typedDamage +
            (i === neutral_index ? 0 : ids["elementalSpellDamage"]);

    });
}

function addPowderBase(build) {
    for (let powderName of build.powders.weapon) {
        const powder = powders[powderName];
        const i = damageTypeNames.indexOf(powder.element);

        build.base.damage[DamageExtremes.MIN][i] += powder.dmg.min;
        build.base.damage[DamageExtremes.MAX][i] += powder.dmg.max;
    }
}

function convertBase(build) {
    build.attacks.forEach((attack) => {
        const neutralConversion = attack.conversion[0] / 100;

        for (let extremeIndex in attack.base) {
            const extremeTotal = build.base.damage[extremeIndex].reduce((a, b) => a + b);

            for (let i in attack.base[extremeIndex]) attack.base[extremeIndex][i] +=
                build.base.damage[extremeIndex][i] * neutralConversion +
                (parseInt(i) !== neutral_index ? (attack.conversion[i] / 100) * extremeTotal : 0);
        }
    });
}

function convertRaw(build) {
    build.attacks.forEach((attack) => {
        const raw = attack.raw;

        const conversionTotal =
            attack.conversion.reduce((sum, a) => sum + parseInt(a), 0) / 100;

        const baseTotal = attack.base.map(extreme =>
            extreme.reduce((a, b) => a + b))
            .reduce((a, b) => a + b);

        const baseElementalTotal = attack.base.map(extreme =>
            extreme.reduce((a, b, i) => a + (i === neutral_index ? 0 : b), 0))
            .reduce((a, b) => a + b);

        const ratios = attack.base[0].map((e, i) => (e + attack.base[1][i]));

        for (let i in raw) {
            if (attack.base[DamageExtremes.MAX][i] === 0) continue;

            // NETWFA
            raw[i] = build.statArrays.rawDamages[attack.type][i];
            // damage
            raw[i] += build.ids.rawDamage * (ratios[i] / baseTotal);
            // ElementalDamage
            if (i !== neutral_index) raw[i] +=
                build.ids[`rawElemental${attack.type}Damage`] *
                (ratios[i] / baseElementalTotal);
            // main/spell
            raw[i] += (ratios[i] / baseTotal) * build.ids[`raw${attack.type}Damage`];
            raw[i] *= conversionTotal;
        }
    });
}

function powderNeutralConversions(build) {
    const weaponPowders = build.powders.weapon;

    let neutral = 100;
    let modifierPercents = [0, 0, 0, 0, 0, 0];

    for (let i in weaponPowders) {
        const powder = powders[weaponPowders[i]];

        const elementalIndex = damageTypeNames.indexOf(powder.element);
        const modPercent = Math.min(neutral, powder.conversion);

        neutral -= modPercent;
        modifierPercents[elementalIndex] += modPercent;

        if (neutral < 1) break;
    }

    build.attacks.forEach(attack => {

        const convertedDamages = attack.base.map(extreme =>
            extreme.map((element, i) => extreme[neutral_index] * modifierPercents[i] / 100));

        for (let extremeIndex in attack.base) for (let i = 0; i < damage_type_count; i++)
            if (i === neutral_index)
                attack.base[extremeIndex][i] *= neutral / 100;
            else
                attack.base[extremeIndex][i] += convertedDamages[extremeIndex][i];
    });
}

function applySpellAttackSpeed(build) {
    const attackSpeedMultiplier = attackSpeedMultipliers[orderedAttackSpeed[build.stats.attackSpeed]];

    for (let attack of build.attacks)
        if (attack.type === "Spell")
            for (let extreme of attack.base) for (let i in extreme)
                extreme[i] *= attackSpeedMultiplier;
}

function applyMasteries(build) {
    build.masteries.forEach(mastery => {
        const elementIndex = damageTypeNames.indexOf(mastery.element);

        build.attacks.forEach(attack => {
            for (let extremeIndex in attack.base) {
                if (attack.base[DamageExtremes.MAX][elementIndex] === 0) continue;
                attack.base[extremeIndex][elementIndex] += mastery.base[extremeIndex];
                attack.base[extremeIndex][elementIndex] *= 1 + (mastery.pct / 100);
            }
        });

    });
}

function applyPercents(build) {
    build.attacks.forEach(attack => {
        const mults = build.statArrays.percentDamages[attack.type];
        for (let i in mults) for (const extreme in attack.base)
            attack.base[extreme][i] *= mults[i] / 100 + 1;
    });
}

function mergeAttackDamage(build) {
    build.attacks.forEach(attack => {
        for (let extremeIndex in attack.damage) for (let i = 0; i < damage_type_count; i++)
            attack.damage[extremeIndex][i] =
                attack.base[extremeIndex][i] +
                attack.raw[i];
    });
}

function applyPersonalDamageMultipliers(build) {
    for (let effect of build.personal_multipliers) for (let attack of build.attacks)
        if (effect.target === "all" || effect.target === attack.internal_name)
            for (let extreme of attack.damage) for (let i in extreme)
                extreme[i] *= effect.multiplier;
}

function applyOverridingDamageMultipliers(build) {
    let dmgUp = 1;
    let vuln = 1;
    for (let effect of build.team_multipliers) {
        if (effect.type === "damage-boost")
            dmgUp = Math.max(dmgUp, effect.multiplier);
        else if (effect.type === "vulnerability")
            vuln = Math.max(vuln, effect.multiplier);
        else throw new Error("invalid overriding effect type: " + effect.type);
    }
    for (let attack of build.attacks) for (let extreme of attack.damage) for (let i in extreme)
        extreme[i] *= dmgUp * vuln;
}

function applyStrDex(build) {
    const strength = 1 + build.sp_multipliers[SkillPointIndexes.Strength];
    const dexterity = 1 + build.ids.criticalDamageBonus / 100;

    for (const attack of build.attacks) {
        const damage = attack.damage = attack.damage.concat(newMinMax());

        for (let i = 0; i < damage_type_count; i++) {
            damage[DamageExtremes.MINC][i] = damage[DamageExtremes.MIN][i] * (dexterity + strength);
            damage[DamageExtremes.MAXC][i] = damage[DamageExtremes.MAX][i] * (dexterity + strength);
            damage[DamageExtremes.MIN][i] *= strength;
            damage[DamageExtremes.MAX][i] *= strength;
        }
    }
}

function addAttackVariants(build) {
    for (let i in build.variants) {
        const variant = build.variants[i];

        const attack = build.attacks.find(attack => attack.internal_name === variant.attack);

        if (!attack) {
            build.variants.splice(build.variants.indexOf(variant), 1);
            continue;
        }

        variant.damage = getVariantConversion(variant.type, attack, build.stats.attackSpeed);
    }
}

function getVariantConversion(variantType, attack, attack_speed) {
    switch (variantType) {
        case "basic":
            return attack.damage;
        case "multi":
            return multiplyDamageByHits(attack.damage, attack.extra_hits);
        case "dps":
            return multiplyDamageByDPS(attack.damage, attack, attack_speed);
        case "scaling-multi":
            return multiplyScalingDamageByHits(attack.damage, attack.extra_hits);
        default:
            throw new Error(`invalid variant type: ${variantType}`);
    }
}

function multiplyDamageByHits(damage, extra_hits) {
    console.log(JSON.stringify(damage));
    return damage.map(extreme => extreme.map(x => x * (1 + (extra_hits ?? 0))));
}

function multiplyScalingDamageByHits(damage, extra_hits) {
    const hits = 1 + (extra_hits ?? 0);
    if (hits === 1) return damage;
    const multiplier = ((hits - 1) * hits) / 2; // == Σ(n - 1)
    console.log(multiplier);

    return damage.map(extreme => extreme.map(x => x * multiplier));
}

function multiplyDamageByDPS(damage, attack, attack_speed) {
    console.log(attackSpeedMultipliers[orderedAttackSpeed[attack_speed]]);
    return multiplyDamageByHits(damage, attack.extra_hits).map(extreme => extreme.map(x =>
        x * ((attack.is_melee) ? attackSpeedMultipliers[orderedAttackSpeed[attack_speed]] : (attack.duration / attack.frequency))
    ));
}

function zeroNegatives(build) {
    for (let attack of build.attacks) for (let extreme of attack.damage) for (let i in extreme)
        if (extreme[i] < 0) extreme[i] = 0;
}
