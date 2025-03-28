const shaman = {
    spellCostMods: {
        cheaperTotem1: -10,
        cheaperTotem2: -5,
        cheaperHaul1: -5,
        cheaperHaul2: -5,
        cheaperAura1: -5,
        cheaperAura2: -5,
        cheaperUproot1: -5,
        cheaperUproot2: -5,
    },
    spells: {
        totem: {
            mana: 30,
            conv: [6, 0, 0, 0, 0, 6],
            duration: 30,
            frequency: 0.4,
        },
        aura: {
            mana: 40,
            conv: [150, 0, 0, 30, 0, 0],
        },
        uproot: {
            mana: 30,
            conv: [80, 30, 20, 0, 0, 0],
        },
        totemicSmash: {
            conv: [120, 0, 0, 0, 30, 0],
        },
        totemShove: {
            conv: [90, 0, 0, 0, 0, 30],
        },
        natureJolt: {
            conv: [90, 30, 0, 0, 0, 0],
        },
        rainDance: {
            conv: [30, 0, 0, 30, 0, 0],
            duration: 6,
            frequency: 0.4,
        },
        puppetMaster: {
            conv: [16, 2, 0, 0, 0, 2],
            frequency: 0.5,
        },
    },
    spellmodifers: {
        shockingAura: {
            conv: [0, 0, 20, 0, 0, 0],
        },
        flamingTongue: {
            conv: [-15, -30, -15, 0, 10, 0],
        },
    },
    proficiencies: {
        relikProficiency: {
            mult: 1.05,
        },
    },
    masteries: {
        earthMastery: {
            base: {
                min: 2,
                max: 4,
            },
            mult: 1.2,
        },
        airMastery: {
            base: {
                min: 3,
                max: 4,
            },
            mult: 1.15,
        },
        waterMastery: {
            base: {
                min: 2,
                max: 4,
            },
            mult: 1.15,
        },
        thunderMastery: {
            base: {
                min: 1,
                max: 8,
            },
            mult: 1.1,
        },
        fireMastery: {
            base: {
                min: 3,
                max: 5,
            },
            mult: 1.15,
        },
    },
    other: {},
};
const warrior = {
    other: {
        radiance: {
            multiplier: 1.2,
            excludedIds: ["xpBonus", "lootBonus", "lootQuality", "gatherXpBonus", "gatherSpeed"],
        },
    },
};
const majorIds = {};
