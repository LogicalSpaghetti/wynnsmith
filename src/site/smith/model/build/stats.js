import {damageTypeNames, damageTypePrefixes} from "../../../../data/small_stuff";
import {getPowder} from "../item/powders";
import {neutral_index} from "../attack/attack_calculations.js";

export default class Stats {
    other; // other.ehp
    base; // base.rawHealth
    identifications; // identifications.health
    effects; // effects.effectType[i]


    constructor(build) {

    }
}

// TODO: integrate into Stats
function init(base, ids) {
    const damage = {};

    damage.base = [
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

    damage.raw = {
        MainAttack: [],
        Spell: []
    };

    for (let i in damageTypeNames) {
        const type = damageTypeNames[i];
        for (let category in damage.raw)
            damage.raw[category][i] =
                ids[`raw${type}${category}Damage`] + ids[`raw${type}Damage`];
    }

    // TODO: figure out where these were being used and ensure both are
    // ids.rawElementalSpellDamage += ids.rawElementalDamage;
    // ids.rawElementalMainAttackDamage += ids.rawElementalDamage;

    damage.percent = {
        MainAttack: [],
        Spell: []
    };

    damageTypePrefixes.forEach((prefix, i) => {
        const type = damageTypePrefixes[i];
        const typedDamage =
            ids.damage + ids[type + "Damage"] + (i === neutral_index ? 0 : ids.elementalDamage);

        damage.percent.MainAttack[i] =
            ids[type + "MainAttackDamage"] +
            ids.mainAttackDamage +
            typedDamage +
            (i === neutral_index ? 0 : ids.elementalMainAttackDamage);

        damage.percent.Spell[i] =
            ids[type + "SpellDamage"] +
            ids.spellDamage +
            typedDamage +
            (i === neutral_index ? 0 : ids.elementalSpellDamage);

    });
}

// TODO: integrate into Stats
function applyPowders(base, powders) {
    // TODO: ensure the powder format at this point is correct
    for (let powder of powders.map(name => getPowder(name)))
        for (let extreme in base)
            base[extreme][damageTypeNames.indexOf(powder.element)] += powder.damage[extreme];
}
