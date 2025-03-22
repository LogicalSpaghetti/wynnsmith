const powders = {
    "e1": {
        "element": "Earth",
        "dmg": {
            "min": 3,
            "max": 6
        },
        "conversion": 17,
        "def": [2, 0, 0, 0, -1]
    },
    "e2": {
        "element": "Earth",
        "dmg": {
            "min": 5,
            "max": 8
        },
        "conversion": 21,
        "def": [4, 0, 0, 0, -2]
    },
    "e3": {
        "element": "Earth",
        "dmg": {
            "min": 6,
            "max": 10
        },
        "conversion": 25,
        "def": [8, 0, 0, 0, -3]
    },
    "e4": {
        "element": "Earth",
        "dmg": {
            "min": 7,
            "max": 10
        },
        "conversion": 31,
        "def": [14, 0, 0, 0, -5]
    },
    "e5": {
        "element": "Earth",
        "dmg": {
            "min": 9,
            "max": 11
        },
        "conversion": 38,
        "def": [22, 0, 0, 0, -9]
    },
    "e6": {
        "element": "Earth",
        "dmg": {
            "min": 11,
            "max": 13
        },
        "conversion": 46,
        "def": [30, 0, 0, 0, -13]
    },
    "t1": {
        "element": "Thunder",
        "dmg": {
            "min": 1,
            "max": 8
        },
        "conversion": 9,
        "def": [-1, 3, 0, 0, 0]
    },
    "t2": {
        "element": "Thunder",
        "dmg": {
            "min": 1,
            "max": 12
        },
        "conversion": 11,
        "def": [-1, 5, 0, 0, 0]
    },
    "t3": {
        "element": "Thunder",
        "dmg": {
            "min": 2,
            "max": 15
        },
        "conversion": 13,
        "def": [-2, 9, 0, 0, 0]
    },
    "t4": {
        "element": "Thunder",
        "dmg": {
            "min": 3,
            "max": 15
        },
        "conversion": 17,
        "def": [-4, 14, 0, 0, 0]
    },
    "t5": {
        "element": "Thunder",
        "dmg": {
            "min": 4,
            "max": 17
        },
        "conversion": 22,
        "def": [-7, 20, 0, 0, 0]
    },
    "t6": {
        "element": "Thunder",
        "dmg": {
            "min": 5,
            "max": 20
        },
        "conversion": 28,
        "def": [-10, 28, 0, 0, 0]
    },
    "w1": {
        "element": "Water",
        "dmg": {
            "min": 3,
            "max": 4
        },
        "conversion": 9,
        "def": [0, -1, 3, 0, 0]
    },
    "w2": {
        "element": "Water",
        "dmg": {
            "min": 4,
            "max": 6
        },
        "conversion": 13,
        "def": [0, -1, 6, 0, 0]
    },
    "w3": {
        "element": "Water",
        "dmg": {
            "min": 5,
            "max": 8
        },
        "conversion": 15,
        "def": [0, -2, 11, 0, 0]
    },
    "w4": {
        "element": "Water",
        "dmg": {
            "min": 6,
            "max": 8
        },
        "conversion": 21,
        "def": [0, -4, 18, 0, 0]
    },
    "w5": {
        "element": "Water",
        "dmg": {
            "min": 7,
            "max": 10
        },
        "conversion": 26,
        "def": [0, -7, 28, 0, 0]
    },
    "w6": {
        "element": "Water",
        "dmg": {
            "min": 9,
            "max": 11
        },
        "conversion": 32,
        "def": [0, -10, 40, 0, 0]
    },
    "f1": {
        "element": "Fire",
        "dmg": {
            "min": 2,
            "max": 5
        },
        "conversion": 14,
        "def": [0, 0, -1, 3, 0]
    },
    "f2": {
        "element": "Fire",
        "dmg": {
            "min": 4,
            "max": 8
        },
        "conversion": 16,
        "def": [0, 0, -2, 5, 0]
    },
    "f3": {
        "element": "Fire",
        "dmg": {
            "min": 5,
            "max": 9
        },
        "conversion": 19,
        "def": [0, 0, -3, 9, 0]
    },
    "f4": {
        "element": "Fire",
        "dmg": {
            "min": 6,
            "max": 9
        },
        "conversion": 24,
        "def": [0, 0, -5, 16, 0]
    },
    "f5": {
        "element": "Fire",
        "dmg": {
            "min": 8,
            "max": 10
        },
        "conversion": 30,
        "def": [0, 0, -9, 25, 0]
    },
    "f6": {
        "element": "Fire",
        "dmg": {
            "min": 10,
            "max": 12
        },
        "conversion": 37,
        "def": [0, 0, -13, 36, 0]
    },
    "a1": {
        "element": "Air",
        "dmg": {
            "min": 2,
            "max": 6
        },
        "conversion": 11,
        "def": [0, 0, 0, -1, 3]
    },
    "a2": {
        "element": "Air",
        "dmg": {
            "min": 3,
            "max": 10
        },
        "conversion": 14,
        "def": [0, 0, 0, -2, 6]
    },
    "a3": {
        "element": "Air",
        "dmg": {
            "min": 4,
            "max": 11
        },
        "conversion": 17,
        "def": [0, 0, 0, -3, 10]
    },
    "a4": {
        "element": "Air",
        "dmg": {
            "min": 5,
            "max": 11
        },
        "conversion": 22,
        "def": [0, 0, 0, -5, 16]
    },
    "a5": {
        "element": "Air",
        "dmg": {
            "min": 7,
            "max": 12
        },
        "conversion": 28,
        "def": [0, 0, 0, -9, 24]
    },
    "a6": {
        "element": "Air",
        "dmg": {
            "min": 8,
            "max": 14
        },
        "conversion": 35,
        "def": [0, 0, 0, -13, 34]
    },
}