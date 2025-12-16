export default class Stats {
    other; // other.ehp
    base; // base.rawHealth
    identifications; // identifications.health
    effects; // effects.effectType[i]
    damage;

    constructor(build) {

    }
}

// TODO: this structure should not be used. Left for reference to compare and ensure all ids referenced here are accounted for.
function arrayifyDamage(base, ids) {
    this.base = [
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
        for (let category in raw)
            raw[category][i] =
                ids[`raw${type}${category}Damage`] + ids[`raw${type}Damage`];
    }

    elementalRaw = {
        MainAttack: ids[`rawElemental${"MainAttack"}Damage`] + ids.rawElementalDamage,
        Spell: ids[`rawElemental${"Spell"}Damage`] + ids.rawElementalDamage
    };

    damage.percent = {
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
}

function applyPowders(powders) {
    for (let powder of powders.map(name => getPowder(name)))
        for (let extreme in this.base)
            this.base[extreme][damageTypeNames.indexOf(powder.element)] += powder.damage[extreme];
}
