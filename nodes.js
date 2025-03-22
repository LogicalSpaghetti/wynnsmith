const abilities = {
    "relikProficiency": {
        "adds": {
            "mainAttackDamage": 5
        }
    },
    "shamanEarthPath": {
        "adds": {
            "rawEarthDamage": {
                "min":2,
                "max":4
            },
            "earthDamage": 20
        }
    },
    "shamanThunderPath": {
        "adds": {
            "rawThunderDamage": {
                "min":1,
                "max":8
            },
            "thunderDamage": 10
        }
    },
    "shamanWaterPath": {
        "adds": {
            "rawWaterDamage": {
                "min":2,
                "max":4
            },
            "waterDamage": 15
        }
    },
    "shamanFirePath": {
        "adds": {
            "rawFireDamage": {
                "min":3,
                "max":5
            },
            "fireDamage": 15
        }
    },
    "shamanAirPath": {
        "adds": {
            "rawAirDamage": {
                "min":3,
                "max":4
            },
            "airDamage": 15
        }
    },
    "totem": {
        "attack": {
            "category": "Totem",
            "name": "Tick",
            "isSpell": true,
            "mana": 30,
            "conversion": [6, 0, 0, 0, 0, 6],
            "frequency": 0.4,
            "duration": 30,
            "aoe": 8,
        }
    },
    "aura": {
        "spell": {
            "category": "Aura",
            "mana": 40
        },
        "attack": {
            "category": "Aura",
            "name": "Aura",
            "isSpell": true,
            "conversion": [150, 0, 0, 30, 0, 0],
            "range": 16
        }
    },
    "uproot": {
        "spell": {
            "category": "Uproot",
            "mana": 30
        },
        "attack": {
            "category": "Uproot",
            "name": "Uproot",
            "isSpell": true,
            "mana": 30,
            "conversion": [80, 30, 20, 0, 0, 0],
            "range": 18,
            "aoe": 5
        }
    },
    "auraPull": {
        "mod": {
            "name": "Aura",
            "conversion": [0, 0, 0, 0, 0, 30]
        }
    },
    "relikProficiency": {
        "spell": {
            "category": "Totem",
            "mana": -10
        },
    },
    "protectiveBash": {
        "radiance": 1.2
    }
}