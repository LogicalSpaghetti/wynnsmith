export default {
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
                    "ratios": [100, 0, 0, 0, 0, 0]
                }
            },
            "1": {
                "name": "Arrow Bomb Attack",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": false,
                "type": "conv",
                "data": {"internal_name": "arrow_bomb", "type": "Spell", "ratios": [140, 0, 0, 0, 20, 0]}
            },
            "2": {
                "name": "Arrow Bomb Cost",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": true,
                "type": "cost",
                "data": {"spell_number": 2, "cost": 45, "is_base_spell": true}
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
                "data": {"type": "dps", "internal_name": "melee", "label": "DPS", "attack": "melee"}
            },
            "6": {
                "name": "Melee Display",
                "toggle_name": "",
                "parents": [],
                "blocks": [],
                "requires_all": true,
                "type": "display",
                "data": {"internal_name": "melee", "name": "Melee", "variants": ["5"], "label": "DPS"}
            },
            "7": {
                "name": "Arrow Bomb Variant",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": true,
                "type": "variant",
                "data": {"type": "hit", "internal_name": "", "label": "Total Damage", "attack": "arrow_bomb"}
            },
            "8": {
                "name": "Arrow Bomb Display",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": true,
                "type": "display",
                "data": {
                    "internal_name": "arrow_bomb",
                    "name": "Arrow Bomb",
                    "variants": ["7"],
                    "label": "Total Damage",
                    "spell": "2"
                }
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
                    "ratios": [4, 0, 0, 0, 0, 2]
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
                    "ratios": [30, 0, 0, 10, 0, 0]
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
                    "ratios": [100, 0, 0, 0, 0, 0]
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
    mage: {
        "wynnClass": "mage",
        "effects": {
            "0": {
                "name": "Heal Heal",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "8"}],
                "blocks": [],
                "requires_all": true,
                "type": "heal",
                "data": {"id": "0", "percent": 15}
            },
            "1": {
                "name": "",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "39"}],
                "blocks": [],
                "requires_all": true,
                "type": "id-heal-multiplier",
                "data": {"target": "0", "multiplier": 0.3, "identification": "waterDamage", "max": 75}
            }
        }
    },
    shaman: {
        "wynnClass": "shaman", "effects": {
            "0": {
                "name": "Totem Damage",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": true,
                "type": "conv",
                "data": {"id": "0", "type": "Spell", "frequency": 0.4, "duration": 30, "ratios": [6, 0, 0, 0, 0, 6]}
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
                "data": {"type": "dps", "label": "Totem DPS", "attack": "0"}
            },
            "3": {
                "name": "Totem Display",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "1"}],
                "blocks": [],
                "requires_all": true,
                "type": "display",
                "data": {"name": "Totem", "variants": ["2"], "label": "DPS", "heals": [], "spell": "0"}
            },
            "4": {
                "name": "Totem Smash Attack",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "4"}],
                "blocks": [],
                "requires_all": true,
                "type": "conv",
                "data": {"id": "4", "type": "Spell", "ratios": [120, 0, 0, 0, 30, 0]}
            },
            "5": {
                "name": "Smash Variant",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "4"}],
                "blocks": [],
                "requires_all": true,
                "type": "variant",
                "data": {"type": "hit", "label": "Smash Damage", "attack": "4"}
            },
            "6": {
                "name": "Totem Smash Display",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "4"}],
                "blocks": [],
                "requires_all": true,
                "type": "display",
                "data": {
                    "name": "Totem Smash",
                    "variants": ["5"],
                    "label": "Totem Smash Damage",
                    "heals": [],
                    "parent": "3"
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
                    "id": "7",
                    "type": "MainAttack",
                    "is_melee": true,
                    "extra_hits": 2,
                    "ratios": [33.4, 0, 0, 0, 0, 0]
                }
            },
            "8": {
                "name": "Melee Variant",
                "toggle_name": "",
                "parents": [],
                "blocks": [],
                "requires_all": true,
                "type": "variant",
                "data": {"type": "dps", "label": "Melee DPS", "attack": "7"}
            },
            "9": {
                "name": "Melee Display",
                "toggle_name": "",
                "parents": [],
                "blocks": [],
                "requires_all": true,
                "type": "display",
                "data": {"name": "Melee", "variants": ["8"], "label": "DPS", "heals": []}
            },
            "10": {
                "name": "Imbued Totem",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "47"}],
                "blocks": [],
                "requires_all": true,
                "type": "conv",
                "data": {"id": "0", "ratios": [4, 0, 0, 0, 0, 0]}
            },
            "11": {
                "name": "Shatter Variant",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "46"}],
                "blocks": [],
                "requires_all": true,
                "type": "variant",
                "data": {"type": "dps", "label": "Shatter Damage", "attack": "0", "multiplier": "8"}
            },
            "12": {
                "name": "Shatter Display",
                "toggle_name": "",
                "parents": [{"section": "nodes", "id": "46"}],
                "blocks": [],
                "requires_all": true,
                "type": "display",
                "data": {"name": "Totemic Shatter", "variants": ["11"], "label": "Shatter Damage", "parent": "3"}
            }
        }
    },
    warrior: {
        "wynnClass": "warrior",
        "effects": {
            "0": {
                "name": "",
                "toggle_name": "Radiance",
                "parents": [{"section": "nodes", "id": "61"}],
                "blocks": [],
                "requires_all": true,
                "type": "id-multiplier",
                "data": {"multiplier": 20}
            }
        }
    }
};
