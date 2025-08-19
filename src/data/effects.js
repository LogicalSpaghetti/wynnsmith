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
        }
    },
    assassin: {},
    mage: {},
    shaman: {},
    warrior: {},
};
