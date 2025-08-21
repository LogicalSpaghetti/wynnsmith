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
                "data": {"internal_name": "melee", "type": "MainAttack", "conversion": [100, 0, 0, 0, 0, 0], "is_melee": true}
            },
            "1": {
                "name": "Arrow Bomb",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": false,
                "type": "conv",
                "data": {"internal_name": "arrow_bomb", "type": "Spell", "conversion": [140, 0, 0, 0, 20, 0]}
            },
            "2": {
                "name": "Bomby",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": true,
                "type": "",
                "data": {},
            },
            "3": {
                "name": "",
                "parents": [{"section": "nodes", "id": "5"}],
                "blocks": [2],
                "requires_all": true,
                "type": "",
                "data": {},
            },
        }
    },
    assassin: {},
    mage: {},
    shaman: {},
    warrior: {},
};
