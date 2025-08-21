const classEffects = {
    archer: {
        "wynnClass": "archer",
        "effects": {
            "0": {
                "name": "Archer Melee",
                "parents": [],
                "blocks": [],
                "requires_all": false,
                "type": "conv",
                "data": {
                    "internal_name": "melee",
                    "type": "MainAttack",
                    "is_melee": true,
                    "conversion": [100, 0, 0, 0, 0, 0]
                }
            },
            "1": {
                "name": "Arrow Bomb Attack",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": false,
                "type": "conv",
                "data": {"internal_name": "arrow_bomb", "type": "Spell", "conversion": [140, 0, 0, 0, 20, 0]}
            },
            "2": {
                "name": "Arrow Bomb Cost",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": true,
                "type": "cost",
                "data": {"spell_number": 2, "cost": 45, "is_base_spell": false}
            },
            "3": {
                "name": "Cheaper Arrow Bomb I",
                "parents": [{"section": "nodes", "id": "3"}],
                "blocks": [],
                "requires_all": true,
                "type": "cost",
                "data": {"spell_number": 2, "cost": -10, "is_base_spell": false}
            },
            "4": {
                "name": "Arrow Shield Resistance",
                "parents": [{"section": "nodes", "id": "10"}],
                "blocks": [],
                "requires_all": true,
                "type": "resistance",
                "data": {"internal_name": "arrow_shield", "multiplier": 0.2}
            }
        }
    },
    assassin: {},
    mage: {},
    shaman: {},
    warrior: {}
};
