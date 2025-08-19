const classEffects = {
    archer: {
        "wynnClass": "archer",
        "effects": {
            "0": {
                "name": "Archer Melee",
                "parents": [],
                "requires_all": false,
                "type": "conv",
                "data": {"internal_name": "melee", "type": "MainAttack", "conversion": [100, 0, 0, 0, 0, 0], "is_melee": true}
            },
            "1": {
                "name": "Arrow Bomb",
                "parents": [{"section": "nodes", "id": "1"}],
                "requires_all": false,
                "type": "conv",
                "data": {"internal_name": "arrow_bomb", "type": "Spell", "conversion": [140, 0, 0, 0, 20, 0]}
            },
            "2": {
                "name": "Air Mastery",
                "parents": [{"section": "nodes", "id": "12"}],
                "requires_all": true,
                "type": "mastery",
                "data": {"element": "Air", "base": [3, 4], "pct": 15},
            },
            "3": {
                "name": "Heal",
                "parents": [],
                "requires_all": false,
                "type": "heal",
                "data": {"internal_name": "heal_mc_heal", "heal": 25},
            },
            "4": {
                "name": "Coursing Restraints",
                "parents": [{"section": "nodes", "id": "64"}],
                "requires_all": true,
                "type": "team-multiplier",
                "data": {"internal_name": "coursing_restraints", "multiplier": 1.15, "type": "vulnerability"},
            },
            "5": {
                "name": "",
                "parents": [{"section": "nodes", "id": "2"}],
                "requires_all": true,
                "type": "personal-multiplier",
                "data": {"internal_name": "proficiency", "multiplier": 1.05, "target": "melee"},
            },
        }
    },
    assassin: {},
    mage: {},
    shaman: {},
    warrior: {},
};
