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

export const neutral_index = 0;

export default class Attacks {
    damageTicks;
    damageVariants;
    damageDisplays;

    constructor(stats, weaponPowders) {
        this.damageTicks = new DamageTicks(stats, weaponPowders);
        this.damageVariants = new DamageVariants(this.damageTicks, stats.effects.variants);
    }
}

class DamageTicks extends Array {
    constructor(stats, weaponPowders) {
        super();
        const attackEffects = stats.effects.attacks;
        const powders = weaponPowders.map(name => getPowder(name));
        this.convertBases(stats.base, attackEffects, powders);
        this.convertRaws(stats.identifications, attackEffects);
        this.powderNeutralConversions(powders);

        this.applyPercents(stats.identifications, attackEffects);
        this.applyMasteries(stats.effects.masteries);
        this.applySpellAttackSpeed(stats.attackSpeed, attackEffects);

        this.mergeAttackDamage();

        this.applyPersonalDamageMultipliers(stats.effects.personal_multipliers);
        this.applyOverridingDamageMultipliers(stats.effects.team_multipliers);
        this.applyStrDex(stats.identifications, stats.sp_multipliers);

        this.zeroNegatives();
    }

    convertBases(stats, powders) {
        const baseDamage = this.parseBase(stats.base, powders);
        for (let i in stats.effects.conversions)
            this[i] = {base: this.convertBase(stats.effects.conversions[i], baseDamage), raw: null, damage: newMinMax()};
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

    convertRaws(ids, attackEffects) {
        const raw = this.parseRaw(ids);
        for (let i in attackEffects) this[i].raw = this.convertRaw(attackEffects[i], ids, this[i].base, raw);
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

    powderNeutralConversions(powders) {
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

    applyPercents(ids, attackEffects) {

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
            const mults = percent[attackEffects[i].type];
            for (const i in mults) for (const extreme of this[i].base)
                extreme[i] *= mults[i] / 100 + 1;
        }
    }

    applyMasteries(masteries) {
        masteries.forEach(mastery => {
            const elementIndex = damageTypeNames.indexOf(mastery.element);

            for (const tick of this) for (let extremeIndex of tick.base) {
                if (tick.base[DamageExtremes.MAX][elementIndex] === 0) continue;
                extremeIndex[elementIndex] += mastery.base[extremeIndex];
                extremeIndex[elementIndex] *= 1 + (mastery.pct / 100);
            }
        });
    }

    applySpellAttackSpeed(attackSpeed, attackEffects) {
        const attackSpeedMultiplier = attackSpeedMultipliers[orderedAttackSpeed[attackSpeed]];

        for (const i in this)
            if (attackEffects[i].type === "Spell")
                for (let extreme of this[i].base) for (let i in extreme)
                    extreme[i] *= attackSpeedMultiplier;
    }

    mergeAttackDamage() {
        for (let tick of this) for (let extremeIndex in tick.base)
            for (let i = 0; i < damage_type_count; i++)
                tick.damage[extremeIndex][i] = tick.base[extremeIndex][i] + tick.raw[i];
    }

    applyPersonalDamageMultipliers(personal_multipliers) {
        for (let personalMultiplier of personal_multipliers)
            for (let id in this)
                // TODO: fix targets referring to "internal_name"
                if (personalMultiplier.target === "all" || personalMultiplier.target === id)
                    for (let extreme of this[id].damage) for (let i in extreme)
                        extreme[i] *= personalMultiplier.multiplier;
    }

    applyOverridingDamageMultipliers(team_multipliers) {
        let dmgUp = 1;
        let resDown = 1;
        for (let effect of team_multipliers) {
            if (effect.type === "damage-boost")
                dmgUp = Math.max(dmgUp, effect.multiplier);
            else if (effect.type === "vulnerability")
                resDown = Math.max(resDown, effect.multiplier);
            else throw new Error("invalid overriding effect type: " + effect.type);
        }
        for (let tick of this) for (let extreme of tick.damage) for (let i in extreme)
            extreme[i] *= dmgUp * resDown;
    }

    applyStrDex(identifications, sp_multipliers) {
        const strength = 1 + sp_multipliers[SkillPointIndexes.Strength];
        const dexterity = 1 + identifications.criticalDamageBonus / 100;

        for (const tick of this) {
            const damage = tick.damage = tick.damage.concat(newMinMax());

            for (let i = 0; i < damage_type_count; i++) {
                damage[DamageExtremes.MINC][i] = damage[DamageExtremes.MIN][i] * (dexterity + strength);
                damage[DamageExtremes.MAXC][i] = damage[DamageExtremes.MAX][i] * (dexterity + strength);
                damage[DamageExtremes.MIN][i] *= strength;
                damage[DamageExtremes.MAX][i] *= strength;
            }
        }

    }

    zeroNegatives() {
        for (let tick of this)
            for (let extreme of tick.damage) for (let i in extreme)
                if (extreme[i] < 0) extreme[i] = 0;
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

class DamageVariants {
    constructor(damageTicks, effectVariants) {
        // TODO
    }
}