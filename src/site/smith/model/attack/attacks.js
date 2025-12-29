import {
    attackSpeedMultipliers,
    damageTypeNames,
    damageTypePrefixes,
    orderedAttackSpeed
} from "../../../../data/small_stuff.js";
import {getPowder} from "../item/powders.js";
import {SkillPointIndexes} from "../skill_points.js";
import {DamageDisplays} from "./attack_display.js";


export const damage_type_count = 6;
export const DamageExtremes = Object.freeze({
    MIN: 0,
    MAX: 1,
    MINC: 2,
    MAXC: 3
});
const DamageBreakdownIndexes = Object.freeze({
    NON_CRIT: 0,
    CRIT: 1,
    AVERAGE: 2
});

export const neutral_index = 0;

export class DamageArray extends Array {
    constructor() {
        super(6);
        this.fill(0);
    }
}

export class MinMax extends Array {
    constructor() {
        super();
        this.push(new DamageArray(), new DamageArray());
    }

    multiply(multiplier) {
        for (const extreme of this) for (const i in extreme)
            extreme[i] *= multiplier;
        return this;
    }

    toMultiply(multiplier) {
        return this.map(extreme => extreme.map(x => x * multiplier));
    }

    addMinMax(minMax) {
        for (const i in this) for (const j in this[i]) this[i][j] += minMax[i][j];
        return this;
    }

    toAddMinMax(minMax) {
        return this.map((extreme, i) => extreme.map((x, j) => x + minMax[i][j]));
    }

    addDamageArray(damageArray) {
        for (const extreme of this) for (const i in extreme) extreme[i] += damageArray[i];
        return this;
    }

    toAddDamageArray(damageArray) {
        this.map((extreme) => extreme.map((x, i) => x + damageArray[i]));
    }
}

export default class Attacks {
    damageTicks;
    damageVariants;
    damageDisplays;

    constructor(stats, weaponPowders) {
        this.damageTicks = new DamageTicks(stats, weaponPowders);
        this.damageVariants = new DamageVariants(this.damageTicks, stats.effects.variants, stats.attackSpeed);
        this.damageDisplays = new DamageDisplays(stats.effects.displays, this.damageVariants, stats.sp_multipliers[SkillPointIndexes.Dexterity]);
    }
}

class DamageTicks extends Array {
    constructor(stats, weaponPowders) {
        super();
        const powders = weaponPowders.map(name => getPowder(name));
        this.initTicks(stats.effects.attacks);
        this.convertBases(stats.base, powders);
        this.convertRaws(stats.identifications);
        this.powderNeutralConversions(powders);

        this.applyPercents(stats.identifications);
        this.applyMasteries(stats.effects.masteries);
        this.applySpellAttackSpeed(stats.baseAttackSpeed);

        this.mergeDamageTypes();

        this.zeroNegatives();

        this.applyPersonalDamageMultipliers(stats.effects.personal_multipliers);
        this.applyOverridingDamageMultipliers(stats.effects.team_multipliers);
        this.applyStrDex(stats.identifications, stats.sp_multipliers);
    }

    initTicks(attackEffects) {
        for (let i in attackEffects) {
            const a = attackEffects[i];
            this[i] = {
                base: null,
                raw: null,
                damage: null,
                type: a.type,
                is_melee: a.is_melee,
                extra_hits: a.extra_hits,
                frequency: a.frequency,
                duration: a.duration
            };
        }
    }

    convertBases(base, attackEffects, powders) {
        const baseDamage = this.parseBase(base, powders);
        for (let tick of this) tick.base = this.convertBase(tick.conversion, baseDamage);
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

    convertBase = (conversion, baseDamage) => baseDamage.map(extreme => {
        const extremeTotal = extreme.reduce((a, b) => a + b);
        return extreme.map((x, i) =>
            (x * conversion[i] + (i !== neutral_index ? conversion[i] * extremeTotal : 0)) / 100
        );
    });

    convertRaws(ids) {
        const raw = this.parseRaw(ids);
        for (let tick of this) tick.raw = this.convertRaw(tick, ids, tick.base, raw);
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

    convertRaw(attackEffect, ids, convertedBase, raw) {
        const convertedRaw = new DamageArray();

        const conversionTotal = attackEffect.conversion.reduce((sum, a) => sum + parseInt(a), 0) / 100;
        const baseTotal = convertedBase.map(extreme =>
            extreme.reduce((a, b) => a + b))
            .reduce((a, b) => a + b);
        const baseElementalTotal = convertedBase.map(extreme =>
            extreme.reduce((a, b, i) => a + (i === neutral_index ? 0 : b), 0))
            .reduce((a, b) => a + b);
        const minMaxSum = convertedBase[DamageExtremes.MIN].map((x, i) =>
            (x + convertedBase[DamageExtremes.MAX][i]));

        for (let i in convertedRaw)
            convertedRaw[i] = convertedBase[DamageExtremes.MAX][i] === 0 ? 0 : conversionTotal * (
                // NETWFA
                raw[attackEffect.type][i]
                // damage
                + ids.rawDamage * (minMaxSum[i] / baseTotal)
                // ElementalDamage
                + (i !== neutral_index ?
                    (ids[`rawElemental${attackEffect.type}Damage`] + ids[`rawElementalDamage`]) *
                    (minMaxSum[i] / baseElementalTotal) : 0)
                // main/spell
                + (minMaxSum[i] / baseTotal) * ids[`raw${attackEffect.type}Damage`]);

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

    applyPercents(ids) {

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

        for (const tick of this) {
            const mults = percent[tick.type];
            for (const i in mults) for (const extreme of tick.base)
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

    applySpellAttackSpeed(baseAttackSpeed) {
        const attackSpeedMultiplier = attackSpeedMultipliers[orderedAttackSpeed[baseAttackSpeed]];

        for (const tick of this.filter(tick => tick.type === "Spell"))
            for (let extreme of tick.base) for (let i in extreme)
                extreme[i] *= attackSpeedMultiplier;
    }

    mergeDamageTypes() {
        for (let tick of this)
            tick.damage = tick.base.map(extreme => extreme.map((x, i) => x + tick.raw[i]));
    }

    zeroNegatives() {
        for (let tick of this)
            for (let extreme of tick.damage) for (let i in extreme)
                if (extreme[i] < 0) extreme[i] = 0;
    }

    applyPersonalDamageMultipliers(personal_multipliers) {
        for (let personalMultiplier of personal_multipliers)
            for (let id in this)
                // TODO:
                //  fix targets referring to "internal_name"
                //  replace "all" with ""
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
        const critChance = sp_multipliers[SkillPointIndexes.Dexterity];

        for (const tick of this) {
            const nonCrit = tick.damage.toMultiply(strength)
            const crit = tick.damage.toMultiply(dexterity + strength);
            tick.damages = {
                nonCrit,
                crit,
                average: crit.toMultiply(critChance).addMinMax(nonCrit.toMultiply(1 - critChance))
            };
        }

        // TODO: switch all following code to use .damages instead of .damage, use for...of to iterate over.

    }
}

class DamageVariants {
    constructor(damageTicks, variantEffects) {
        for (let key in variantEffects) {
            const damageTick = damageTicks[variantEffects[key].attack];
            if (!damageTick) continue;
            // ?? -1 is to account for the 1 assumed hit.
            const secondTickHits = damageTicks[variantEffects[key].second_attack]?.extra_hits ?? -1;

            this[key] = {
                label: variantEffects[key].label,
                damage: this.getVariantConversion(variantEffects[key], damageTick, secondTickHits)
            };
        }
    }

    getVariantConversion = (variant, tick, secondTickHits) =>
        this.multiplyDamage(this.multiplyDamage(tick.damage, this.getVariantMultiplier(variant, tick, secondTickHits)), variant.multiplier);

    multiplyDamage = (damage, multiplier) => {
        if (!multiplier || multiplier === 1) return damage;
        return damage.map(extreme => extreme.map(x => x * multiplier));
    };

    getVariantMultiplier(variant, tick, secondTickHits) {
        switch (variant.type) {
            case "hit":
                return 1;
            case "multi":
                return this.getHitsMultiplier(tick.extra_hits);
            case "dps":
                return this.getDPSMultiplier(tick.extra_hits, tick.frequency);
            case "total":
                return this.getDoTMultiplier(tick.extra_hits, tick.frequency, tick.duration);
            case "scaling-multi":
                return this.getScalingMultiplier(tick.extra_hits, secondTickHits);
            case "hit-modifier":
                return this.getHitsMultiplier(secondTickHits);
            default:
                throw new Error(`invalid variant type: ${variant.type}`);
        }
    }

    getHitsMultiplier = (extra_hits) => 1 + extra_hits || 1;
    getDPSMultiplier = (extra_hits, frequency) => this.getHitsMultiplier(extra_hits) * 1 / frequency;
    getDoTMultiplier = (extra_hits, frequency, duration) => this.getDPSMultiplier(extra_hits, frequency) * duration;
    // SUM_{n=1}^{total_hits}(min(n,hit_cap)) === c(2t-c+1)/2, t >= c
    getScalingMultiplier = (scale_cap, extra_hits) => scale_cap * (2 * this.getHitsMultiplier(extra_hits) - scale_cap + 1) / 2;
}
