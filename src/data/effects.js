const classEffects = {
    archer: {
        "wynnClass": "archer",
        "effects": {
            "0": {
                "name": "Archer Melee",
                "parents": [],
                "requires_all": false,
                "type": "conv",
                "data": {"internal_name": "melee", "display_name": "Melee", "type": "MainAttack", "conversion": [100, 0, 0, 0, 0, 0]}
            },
            "1": {
                "name": "Arrow Bomb",
                "parents": [{"section": "nodes", "id": "1"}],
                "requires_all": false,
                "type": "conv",
                "data": {"internal_name": "arrow_bomb", "display_name": "Arrow Bomb", "type": "Spell", "conversion": [140, 0, 0, 0, 20, 0]}
            }
        }
    },
    assassin: {},
    mage: {},
    shaman: {},
    warrior: {},
};
