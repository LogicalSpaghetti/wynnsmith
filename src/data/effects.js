const classEffects = {
    archer: {
        "wynnClass": "archer", "effects": {
            "0": {
                "name": "Archer Melee",
                "toggle_name": "",
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
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": false,
                "type": "conv",
                "data": {"internal_name": "arrow_bomb", "type": "Spell", "conversion": [140, 0, 0, 0, 20, 0]}
            },
            "2": {
                "name": "Arrow Bomb Cost",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": true,
                "type": "cost",
                "data": {"spell_number": 2, "cost": 45, "is_base_spell": false}
            },
            "3": {
                "name": "Cheaper Arrow Bomb I",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "3"}],
                "blocks": [],
                "requires_all": true,
                "type": "cost",
                "data": {"spell_number": 2, "cost": -10, "is_base_spell": false}
            },
            "4": {
                "name": "Arrow Shield Resistance",
                "toggle_name": "Arrow Shield",
                "parents": [{"section": "nodes", "id": "10"}],
                "blocks": [],
                "requires_all": true,
                "type": "resistance",
                "data": {"internal_name": "arrow_shield", "multiplier": 0.2}
            },
            "5": {
                "name": "Melee DPS",
                "toggle_name": "",
                "parents": [],
                "blocks": [],
                "requires_all": true,
                "type": "variant",
                "data": {"type": "dps", "internal_name": "melee", "attack": "melee"}
            }
        }
    },
    assassin: {
        "wynnClass": "assassin", "effects": {
            "0": {
                "name": "Multihit Total",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "6"}],
                "blocks": [],
                "requires_all": true,
                "type": "variant",
                "data": {"type": "multi", "internal_name": "multihit_total", "attack": "multihit"}
            },
            "1": {
                "name": "Finality",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "81"}],
                "blocks": [],
                "requires_all": true,
                "type": "conv",
                "data": {
                    "internal_name": "finality",
                    "type": "Spell",
                    "extra_hits": 7,
                    "conversion": [4, 0, 0, 0, 0, 2]
                }
            },
            "2": {
                "name": "Multihit Attack",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "6"}],
                "blocks": [],
                "requires_all": true,
                "type": "conv",
                "data": {
                    "internal_name": "multihit",
                    "type": "Spell",
                    "extra_hits": 7,
                    "conversion": [30, 0, 0, 10, 0, 0]
                }
            },
            "3": {
                "name": "Finality Total",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "81"}],
                "blocks": [],
                "requires_all": true,
                "type": "variant",
                "data": {
                    "type": "scaling-multi",
                    "internal_name": "finality",
                    "attack": "finality",
                    "second_attack": "multihit"
                }
            },
            "4": {
                "name": "Multihit Display",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "6"}],
                "blocks": [],
                "requires_all": true,
                "type": "display",
                "data": {"name": "Multihit", "variants": ["multihit_total", "finality"], "spell": "2"}
            },
            "5": {
                "name": "Multihit Cost",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "6"}],
                "blocks": [],
                "requires_all": true,
                "type": "cost",
                "data": {"spell_number": 2, "cost": 40, "is_base_spell": true}
            },
            "6": {
                "name": "Cheaper Multihit",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "30"}],
                "blocks": [],
                "requires_all": true,
                "type": "cost",
                "data": {"spell_number": 2, "cost": -5, "is_base_spell": false}
            },
            "7": {
                "name": "Cheaper Multihit",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "51"}],
                "blocks": [],
                "requires_all": true,
                "type": "cost",
                "data": {"spell_number": 2, "cost": -5, "is_base_spell": false}
            }
        }
    },
    mage: {},
    shaman: {},
    warrior: {}
};
