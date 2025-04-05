const attacks = {
    melee: {
        name: "Melee",
        conv: [100, 0, 0, 0, 0, 0],
    },
    relikMelee: {
        cata: "Melee",
        name: "Single Beam",
        conv: [33.4, 0, 0, 0, 0, 0],
        alts: [
            {
                name: "Per Attack",
                mult: 3,
                display: true,
            },
            {
                name: "Average DPS",
                scaling: "",
            },
        ],
    },
    shaman: {
        totem: {
            cata: "Totem",
            name: "Totem Tick",
            mana: 30,
            conv: [6, 0, 0, 0, 0, 6],
            alts: [
                {
                    name: "Totem Tick DPS",
                    mult: 2.5,
                },
            ],
        },
        aura: {
            name: "Aura",
            mana: 40,
            conv: [150, 0, 0, 30, 0, 0],
        },
        uproot: {
            name: "Uproot",
            mana: 30,
            conv: [80, 30, 20, 0, 0, 0],
        },
        totemicSmash: {
            name: "Totemic Smash",
            conv: [120, 0, 0, 0, 30, 0],
        },
        totemShove: {
            name: "Totem Shove",
            parent: "Totem",
            conv: [90, 0, 0, 0, 0, 30],
        },
        natureJolt: {
            name: "Nature's Jolt",
            parent: "Haul",
            conv: [90, 30, 0, 0, 0, 0],
        },
        rainDance: {
            name: "Rain Dance",
            conv: [30, 0, 0, 30, 0, 0],
            duration: 6,
            frequency: 0.4,
        },
        puppetMaster: {
            name: "Puppet Master",
            conv: [16, 2, 0, 0, 0, 2],
            frequency: 0.5,
        },
        shockingAura: {
            name: "Aura",
            conv: [0, 0, 20, 0, 0, 0],
        },
        flamingTongue: {
            name: "Uproot",
            conv: [-15, -30, -15, 0, 10, 0],
        },
    },
};

const spellCostMods = {
    shaman: {
        totem: ["1st", 30],
        haul: ["2nd", 15],
        aura: ["3rd", 40],
        uproot: ["4th", 30],
        totemCost1: ["1st", -10],
        totemCost2: ["1st", -5],
        haulCost1: ["2nd", -5],
        haulCost2: ["2nd", -5],
        auraCost1: ["3rd", -5],
        auraCost2: ["3rd", -5],
        uprootCost1: ["4th", -5],
        uprootCost2: ["4th", -5],
    },
};
const proficiencies = {
    shaman: {
        relikProficiency: {
            mult: 1.05,
        },
    },
};

const masteries = {
    shaman: {
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
};

const oddities = {
    warrior: {
        radiance: {
            multiplier: 1.2,
            excludedIds: ["xpBonus", "lootBonus", "lootQuality", "gatherXpBonus", "gatherSpeed"],
        },
    },
};

const majorIds = {};

const meleeAttacks = ["concentration", "Melee"];

const aspects = {
    shaman: {
        "Aspect of the Beckoned Legion": [
            {
                slider: 1,
                conv: [0, -1, 0, 0, 0, 0],
            },
            {
                slider: 2,
                conv: [0, -1, 0, 0, 0, -1],
            },
            {
                slider: 3,
                conv: [-1, -1, 0, 0, 0, -1],
            },
        ],
        "Aspect of the Amphibian": [2, 3, 4],
        "Aspect of Stances": [
            {
                lunatic: 5,
                fanatic: 5,
                heratic: 10,
            },
            {
                lunatic: 8,
                fanatic: 8,
                heratic: 18,
            },
            {
                lunatic: 10,
                fanatic: 10,
                heratic: 20,
            },
        ],
        "Aspect of Lashing Fire": [
            {
                hits: 1,
                conv: [-11, 0, -1, 0, -2, 0],
            },
            {
                hits: 2,
                conv: [-17, 0, -2, 0, -4, 0],
            },
            {
                hits: 3,
                conv: [-20, 0, -3, 0, -6, 0],
            },
            {
                hits: 4,
                conv: [-22, 0, -4, 0, -8, 0],
            },
        ],
        "Aspect of Motivation": [5, 9, 12, 15],
        "Acolyte's Embodiment of Unwavering Adherence": [
            {
                duration: 2,
                tentacles: 0,
                mult: 1
            },
            {
                duration: 2,
                tentacles: 1,
                mult: 1.334
            },
            {
                duration: 3,
                tentacles: 1,
                mult: 1.334
            },
        ],
        "Summoner's Embodiment of the Omnipotent Overseer": [
            {
                hummingbirds: 0
            },
            {
                hummingbirds: 1
            },
            {
                hummingbirds: 1
            },
        ]
    },
};
