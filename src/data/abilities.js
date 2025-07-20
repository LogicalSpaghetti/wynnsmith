const amazinglynamedalternateclasses = {
    shaman: {
        defaultAttack: {
            primary: {
                id: "meleeTotal",
                name: "Beam Total",
                conv: [100.2, 0, 0, 0, 0, 0],
            },
            secondary: {
                id: "meleeSingle",
                name: "Single Beam",
                conv: [33.4, 0, 0, 0, 0, 0],
            },
        },
        spells: {
            totem: {
                name: "Totem",
                attack: "totem",
                mana: 30,
                spell: "1st",
            },
            haul: {
                name: "Haul",
                mana: 15,
                spell: "2nd",
            },
            aura: {
                name: "Aura",
                attack: "aura",
                mana: 40,
                spell: "3rd",
            },
            uproot: {
                name: "Uproot",
                attack: "uproot",
                mana: 30,
                spell: "4th",
            },
        },
        attacks: {
            totem: {
                name: "Tick",
                conv: [6, 0, 0, 0, 0, 6],
                dps: {
                    override: true,
                    mult: 2.5,
                },
            },
            aura: {
                name: "Aura",
                conv: [150, 0, 0, 30, 0, 0],
            },
            uproot: {
                name: "Uproot",
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
    },
    archer: {
        defaultAttack: {
            primary: {
                id: "melee",
                name: "Melee",
                conv: [100, 0, 0, 0, 0, 0],
            },
        },
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
                lunatic: 0.05,
                fanatic: 0.05,
                heratic: 10,
            },
            {
                lunatic: 0.08,
                fanatic: 0.08,
                heratic: 16,
            },
            {
                lunatic: 0.10,
                fanatic: 0.10,
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
                mult: 1,
            },
            {
                duration: 2,
                tentacles: 1,
                mult: 1.334,
            },
            {
                duration: 3,
                tentacles: 1,
                mult: 1.334,
            },
        ],
        "Summoner's Embodiment of the Omnipotent Overseer": [
            {
                hummingbirds: 0,
            },
            {
                hummingbirds: 1,
            },
            {
                hummingbirds: 1,
            },
        ],
    },
};

const castedSpells = {
    shaman: [
        {
            name: "Totem",
            attack: "totem",
            mana: 30,
        },
        {
            name: "Haul",
            mana: 15,
        },
        {
            name: "Aura",
            attack: "aura",
            mana: 40,
        },
        {
            name: "Uproot",
            attack: "uproot",
            mana: 30,
        },
    ],
};
