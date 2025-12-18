import {
    attackSpeedMultipliers,
    damageTypeNames,
    damageTypePrefixes,
    orderedAttackSpeed
} from "../../../../data/small_stuff.js";
import {getPowder} from "../item/powders.js";
import {SkillPointIndexes} from "../skill_points.js";
import {newDamages, newMinMax} from "../ability/effect_parsing.js";


export const damage_type_count = 6;
export const DamageExtremes = Object.freeze({
    MIN: 0,
    MAX: 1,
    MINC: 2,
    MAXC: 3
});
export const ExtremeNames = Object.freeze([
    "min",
    "max"
]);
export const neutral_index = 0;

export default class Attacks {
    constructor(stats, weaponPowders) {
        this.damageTicks = new DamageTicks(stats, weaponPowders);
        this.damageVariants = new DamageVariants(this.damageTicks, stats.effects.variants);
    }
}

class DamageTicks extends Array {
    constructor(stats, weaponPowders) {
        super();
        const powders = weaponPowders.map(name => getPowder(name));
        this.convertBases(stats, powders);
        this.convertRaws(stats);
        this.powderNeutralConversions(stats, powders);

        this.applyPercents(stats.identifications, stats.effects.conversions);
        applyMasteries(build, stats);
        applySpellAttackSpeed(build, stats);

        mergeAttackDamage(build, stats);

        applyPersonalDamageMultipliers(build, stats);
        applyOverridingDamageMultipliers(build, stats);
        applyStrDex(build, stats);

        addAttackVariants(build, stats);
        zeroNegatives(build, stats);
    }

    convertBases(stats, powders) {
        const baseDamage = this.parseBase(stats.base, powders);
        for (let i in stats.effects.conversions)
            this[i] = {base: this.convertBase(stats.effects.conversions[i], baseDamage), raw: null};
    }

    // assumes powder base is perfectly normal base
    parseBase(base, powders) {
        const result = [
            [
                base.baseDamage.min,
                base.baseEarthDamage.min,
                base.baseThunderDamage.min,
                base.baseWaterDamage.min,
                base.baseFireDamage.min,
                base.baseAirDamage.min
            ], [
                base.baseDamage.max,
                base.baseEarthDamage.max,
                base.baseThunderDamage.max,
                base.baseWaterDamage.max,
                base.baseFireDamage.max,
                base.baseAirDamage.max
            ]
        ];

        for (let powder of powders)
            for (let extreme in this.base)
                result[extreme][damageTypeNames.indexOf(powder.element)] += powder.damage[extreme];

        return result;
    }

    convertBase(conversion, baseDamage) {
        const result = newMinMax();

        const neutralConversion = conversion.ratios[0] / 100;
        for (let extremeIndex in result) {
            const extremeTotal = baseDamage[extremeIndex].reduce((a, b) => a + b);
            for (let i in result[extremeIndex]) result[extremeIndex][i] +=
                baseDamage[extremeIndex][i] * neutralConversion +
                (parseInt(i) !== neutral_index ? (conversion.ratios[i] / 100) * extremeTotal : 0);
        }

        return result;
    }

    convertRaws(stats) {
        const raw = this.parseRaw(stats.identifications);
        for (let i in stats.effects.conversions)
            this[i].raw = this.convertRaw(stats.effects.conversions[i], stats.identifications, this[i].base, raw);
    }

    parseRaw(ids) {
        const raw = {
            MainAttack: [],
            Spell: []
        };

        for (let i in damageTypeNames) for (let category in raw)
            raw[category][i] = ids[`raw${damageTypeNames[i]}${category}Damage`] + ids[`raw${damageTypeNames[i]}Damage`];

        return raw;
    }

    convertRaw(conversion, ids, convertedBase, raw) {
        const convertedRaw = newDamages();

        const conversionTotal = conversion.ratios.reduce((sum, a) => sum + parseInt(a), 0) / 100;
        const baseTotal = convertedBase.map(extreme =>
            extreme.reduce((a, b) => a + b))
            .reduce((a, b) => a + b);
        const baseElementalTotal = conversion.base.map(extreme =>
            extreme.reduce((a, b, i) => a + (i === neutral_index ? 0 : b), 0))
            .reduce((a, b) => a + b);
        const ratios = conversion.base[DamageExtremes.MIN].map((e, i) =>
            (e + conversion.base[DamageExtremes.MAX][i]));

        for (let i in convertedRaw)
            convertedRaw[i] = conversion.base[DamageExtremes.MAX][i] === 0 ? 0 : conversionTotal * (
                // NETWFA
                raw[conversion.type][i]
                // damage
                + ids.rawDamage * (ratios[i] / baseTotal)
                // ElementalDamage
                + (i !== neutral_index ?
                    (ids[`rawElemental${conversion.type}Damage`] + ids[`rawElementalDamage`]) *
                    (ratios[i] / baseElementalTotal) : 0)
                // main/spell
                + (ratios[i] / baseTotal) * ids[`raw${conversion.type}Damage`]);

        return convertedRaw;
    }

    powderNeutralConversions(stats, powders) {
        let neutral = 100;
        let modifierPercents = [0, 0, 0, 0, 0, 0];

        for (let powder of powders) {
            const elementalIndex = damageTypeNames.indexOf(powder.element);
            const modPercent = Math.min(neutral, powder.conversion);

            neutral -= modPercent;
            modifierPercents[elementalIndex] += modPercent;

            if (neutral < 1) break;
        }

        for (let i in this) {
            const convertedDamages = this[i].base.map(extreme =>
                extreme.map((element, i) => extreme[neutral_index] * modifierPercents[i] / 100));

            for (let extremeIndex in this[i].base)
                for (let i = 0; i < damage_type_count; i++)
                    if (i === neutral_index)
                        this[i].base[extremeIndex][i] *= neutral / 100;
                    else
                        this[i].base[extremeIndex][i] += convertedDamages[extremeIndex][i];
        }
    }

    applyPercents(ids, conversions) {

        const percent = {
            MainAttack: [],
            Spell: []
        };

        damageTypePrefixes.forEach((prefix, i) => {
            const type = damageTypePrefixes[i];
            const typedDamage =
                ids.damage + ids[type + "Damage"] + (i === neutral_index ? 0 : ids.elementalDamage);

            this.percent.MainAttack[i] =
                ids[type + "MainAttackDamage"] +
                ids.mainAttackDamage +
                typedDamage +
                (i === neutral_index ? 0 : ids.elementalMainAttackDamage);

            this.percent.Spell[i] =
                ids[type + "SpellDamage"] +
                ids.spellDamage +
                typedDamage +
                (i === neutral_index ? 0 : ids.elementalSpellDamage);
        });

        for (const i in this) {
            const mults = percent[conversions[i].type];
            for (const i in mults) for (const extreme of this[i].base)
                extreme[i] *= mults[i] / 100 + 1;
        }
    }
}

function applySpellAttackSpeed(build) {
    const attackSpeedMultiplier = attackSpeedMultipliers[orderedAttackSpeed[build.base.attackSpeed]];

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
    const dexterity = 1 + build.identifications.criticalDamageBonus / 100;

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
    for (let key in build.variants) {
        const variant = build.variants[key];

        const attack = build.attacks.find(attack => attack.internal_name === variant.attack);

        if (!attack)
            delete build.variants[key];
        else
            variant.damage = getVariantConversion(build, variant, attack);
    }
}

function getVariantConversion(build, variant, attack) {
    const secondAttack = build.attacks.find(attack => attack.internal_name === variant.second_attack) ?? {extra_hits: 0};
    // TODO: secondAttack.extraHits should never be called if secondAttack doesn't exist. pass build and get second attack in the next function?
    //  (will matter greatly for Winded)


    const damage = getBeforeMultiplying();

    return variant.multiplier ? multiplyDamageByMultiplier(damage, variant.multiplier) : damage;

    function getBeforeMultiplying() {
        switch (variant.type) {
            case "hit":
                return attack.damage;
            case "multi":
                return multiplyDamageByExtraHits(attack.damage, attack.extra_hits);
            case "dps":
                return multiplyDamageByDPS(build, attack);
            case "total":
                return multiplyDamageOverTime(build, attack);
            case "scaling-multi":
                return multiplyScalingDamageByHits(attack.damage, attack.extra_hits, secondAttack?.extra_hits);
            case "hit-modifier":
                return multiplyDamageByExtraHits(attack.damage, secondAttack?.extra_hits);
            default:
                throw new Error(`invalid variant type: ${variant.type}`);
        }
    }
}

function multiplyDamageByMultiplier(damage, multiplier) {
    return damage.map(extreme => extreme.map(x => x * multiplier));
}

function multiplyDamageByExtraHits(damage, extra_hits) {
    return multiplyDamageByMultiplier(damage, (1 + (extra_hits ?? 0)));
}

function multiplyScalingDamageByHits(damage, scaling_cap, extra_hits) {
    const total_hits = 1 + (extra_hits ?? 0);
    let multiplier = 0;
    for (let n = 1; n < total_hits - 1; n++) multiplier += Math.min(n, scaling_cap);

    return multiplyDamageByMultiplier(damage, multiplier);
}

function multiplyDamageOverTime(build, attack) {
    return multiplyDamageByMultiplier(multiplyDamageByDPS(build, attack), attack.duration);
}

function multiplyDamageByDPS(build, attack) {
    const multiplier = (attack.is_melee) ? attackSpeedMultipliers[orderedAttackSpeed[build.stats.attackSpeed]] : (1 / attack.frequency);
    return multiplyDamageByMultiplier(multiplyDamageByExtraHits(attack.damage, attack.extra_hits), multiplier);
}

function zeroNegatives(build) {
    for (let attack of build.attacks) for (let extreme of attack.damage) for (let i in extreme)
        if (extreme[i] < 0) extreme[i] = 0;
}

class DamageVariants {
    constructor(damageTicks, effectVariants) {
        // TODO
    }
}