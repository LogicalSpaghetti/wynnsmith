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
                "data": {"type": "dps", "label": "DPS", "internal_name": "melee", "attack": "melee"}
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
                "data": {"type": "multi", "internal_name": "multihit_total", "label": "Multihit", "attack": "multihit"}
            },
            "1": {
                "name": "Finality Attack",
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
                "name": "Finality Bonus",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "81"}],
                "blocks": [],
                "requires_all": true,
                "type": "variant",
                "data": {
                    "type": "scaling-multi",
                    "internal_name": "finality",
                    "label": "Finality Bonus",
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
                "data": {
                    "internal_name": "multihit",
                    "name": "Multihit",
                    "variants": ["0", "3"],
                    "label": "Total Damage",
                    "spell": "2"
                }
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
            },
            "8": {
                "name": "Melee Attack",
                "toggle_name": "",
                "parents": [],
                "blocks": [],
                "requires_all": true,
                "type": "conv",
                "data": {
                    "internal_name": "melee",
                    "type": "MainAttack",
                    "is_melee": true,
                    "conversion": [100, 0, 0, 0, 0, 0]
                }
            },
            "9": {
                "name": "Melee DPS",
                "toggle_name": "",
                "parents": [],
                "blocks": [],
                "requires_all": true,
                "type": "variant",
                "data": {"type": "dps", "internal_name": "melee_dps", "label": "DPS", "attack": "melee"}
            },
            "10": {
                "name": "Melee Display",
                "toggle_name": "",
                "parents": [],
                "blocks": [],
                "requires_all": true,
                "type": "display",
                "data": {"internal_name": "melee", "name": "Melee", "variants": ["9"], "label": "DPS"}
            }
        }
    },
    mage: {"effects": {}},
    shaman: {
        "wynnClass": "shaman", "effects": {
            "0": {
                "name": "Totem Damage",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": true,
                "type": "conv",
                "data": {
                    "internal_name": "totem",
                    "type": "Spell",
                    "duration": 30,
                    "frequency": 0.4,
                    "conversion": [6, 0, 0, 0, 0, 6]
                }
            },
            "1": {
                "name": "Totem Cost",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": true,
                "type": "cost",
                "data": {"spell_number": 0, "cost": 30, "is_base_spell": true}
            },
            "2": {
                "name": "Totem DPS Variant",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": true,
                "type": "variant",
                "data": {"type": "dps", "internal_name": "totem_dps", "label": "Totem DPS", "attack": "totem"}
            },
            "3": {
                "name": "Totem Display",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": true,
                "type": "display",
                "data": {
                    "internal_name": "totem",
                    "name": "Totem",
                    "variants": ["2"],
                    "label": "DPS",
                    "spell": "0",
                    "is_shift": false
                }
            },
            "4": {
                "name": "Totem Smash Attack",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "4"}],
                "blocks": [],
                "requires_all": true,
                "type": "conv",
                "data": {"internal_name": "totem_smash", "type": "Spell", "conversion": [120, 0, 0, 0, 30, 0]}
            },
            "5": {
                "name": "Smash Variant",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "4"}],
                "blocks": [],
                "requires_all": true,
                "type": "variant",
                "data": {
                    "type": "hit",
                    "internal_name": "totem_smash",
                    "label": "Smash Damage",
                    "attack": "totem_smash"
                }
            },
            "6": {
                "name": "Totem Smash Display",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "4"}],
                "blocks": [],
                "requires_all": true,
                "type": "display",
                "data": {
                    "internal_name": "totem_smash",
                    "name": "Totem Smash",
                    "variants": ["5"],
                    "label": "Totem Smash Damage",
                    "parent": "totem"
                }
            },
            "7": {
                "name": "Melee Damage",
                "toggle_name": "",
                "parents": [],
                "blocks": [],
                "requires_all": true,
                "type": "conv",
                "data": {
                    "internal_name": "melee",
                    "type": "MainAttack",
                    "is_melee": true,
                    "extra_hits": 2,
                    "conversion": [33.4, 0, 0, 0, 0, 0]
                }
            },
            "8": {
                "name": "Melee Variant",
                "toggle_name": "",
                "parents": [],
                "blocks": [],
                "requires_all": true,
                "type": "variant",
                "data": {"type": "dps", "internal_name": "melee_dps", "label": "Melee DPS", "attack": "melee"}
            },
            "9": {
                "name": "Melee Display",
                "toggle_name": "",
                "parents": [],
                "blocks": [],
                "requires_all": true,
                "type": "display",
                "data": {"internal_name": "melee_dps", "name": "Melee", "variants": ["8"], "label": "DPS"}
            }
        }
    },
    warrior: {"effects": {}}
};
