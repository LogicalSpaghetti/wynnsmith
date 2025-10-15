import {binaryToDecimal, decimalToBinary, flag, spliceOffNumber} from "../../../common/numbers.js";

const powders = {
    e1: {
        element: "Earth",
        damage: [3, 6],
        conversion: 17,
        def: [0, 2, 0, 0, 0, -1]
    },
    e2: {
        element: "Earth",
        damage: [5, 8],
        conversion: 21,
        def: [0, 4, 0, 0, 0, -2]
    },
    e3: {
        element: "Earth",
        damage: [6, 10],
        conversion: 25,
        def: [0, 8, 0, 0, 0, -3]
    },
    e4: {
        element: "Earth",
        damage: [7, 10],
        conversion: 31,
        def: [0, 14, 0, 0, 0, -5]
    },
    e5: {
        element: "Earth",
        damage: [9, 11],
        conversion: 38,
        def: [0, 22, 0, 0, 0, -9]
    },
    e6: {
        element: "Earth",
        damage: [11, 13],
        conversion: 46,
        def: [0, 30, 0, 0, 0, -13]
    },
    t1: {
        element: "Thunder",
        damage: [1, 8],
        conversion: 9,
        def: [0, -1, 3, 0, 0, 0]
    },
    t2: {
        element: "Thunder",
        damage: [1, 12],
        conversion: 11,
        def: [0, -1, 5, 0, 0, 0]
    },
    t3: {
        element: "Thunder",
        damage: [2, 15],
        conversion: 13,
        def: [0, -2, 9, 0, 0, 0]
    },
    t4: {
        element: "Thunder",
        damage: [3, 15],
        conversion: 17,
        def: [0, -4, 14, 0, 0, 0]
    },
    t5: {
        element: "Thunder",
        damage: [4, 17],
        conversion: 22,
        def: [0, -7, 20, 0, 0, 0]
    },
    t6: {
        element: "Thunder",
        damage: [5, 20],
        conversion: 28,
        def: [0, -10, 28, 0, 0, 0]
    },
    w1: {
        element: "Water",
        damage: [3, 4],
        conversion: 9,
        def: [0, 0, -1, 3, 0, 0]
    },
    w2: {
        element: "Water",
        damage: [4, 6],
        conversion: 13,
        def: [0, 0, -1, 6, 0, 0]
    },
    w3: {
        element: "Water",
        damage: [5, 8],
        conversion: 15,
        def: [0, 0, -2, 11, 0, 0]
    },
    w4: {
        element: "Water",
        damage: [6, 8],
        conversion: 21,
        def: [0, 0, -4, 18, 0, 0]
    },
    w5: {
        element: "Water",
        damage: [7, 10],
        conversion: 26,
        def: [0, 0, -7, 28, 0, 0]
    },
    w6: {
        element: "Water",
        damage: [9, 11],
        conversion: 32,
        def: [0, 0, -10, 40, 0, 0]
    },
    f1: {
        element: "Fire",
        damage: [5, 2],
        conversion: 14,
        def: [0, 0, 0, -1, 3, 0]
    },
    f2: {
        element: "Fire",
        damage: [4, 8],
        conversion: 16,
        def: [0, 0, 0, -2, 5, 0]
    },
    f3: {
        element: "Fire",
        damage: [5, 9],
        conversion: 19,
        def: [0, 0, 0, -3, 9, 0]
    },
    f4: {
        element: "Fire",
        damage: [6, 9],
        conversion: 24,
        def: [0, 0, 0, -5, 16, 0]
    },
    f5: {
        element: "Fire",
        damage: [8, 10],
        conversion: 30,
        def: [0, 0, 0, -9, 25, 0]
    },
    f6: {
        element: "Fire",
        damage: [10, 12],
        conversion: 37,
        def: [0, 0, 0, -13, 36, 0]
    },
    a1: {
        element: "Air",
        damage: [2, 6],
        conversion: 11,
        def: [0, 0, 0, 0, -1, 3]
    },
    a2: {
        element: "Air",
        damage: [3, 10],
        conversion: 14,
        def: [0, 0, 0, 0, -2, 6]
    },
    a3: {
        element: "Air",
        damage: [4, 11],
        conversion: 17,
        def: [0, 0, 0, 0, -3, 10]
    },
    a4: {
        element: "Air",
        damage: [5, 11],
        conversion: 22,
        def: [0, 0, 0, 0, -5, 16]
    },
    a5: {
        element: "Air",
        damage: [7, 12],
        conversion: 28,
        def: [0, 0, 0, 0, -9, 24]
    },
    a6: {
        element: "Air",
        damage: [8, 14],
        conversion: 35,
        def: [0, 0, 0, 0, -13, 34]
    }
};

const powderSpecialNames = {
    weapon: ["Quake", "Chain Lightning", "Curse", "Courage", "Wind Prison"],
    armour: ["Rage", "Kill Streak", "Concentration", "Endurance", "Dodge"]
};

const powderTypeCount = 5;
const maxPowderTier = 6;
const powderPrefixes = ["e", "t", "w", "f", "a"];

export class Powders {
    powders;
    special;

    constructor(powders = []) {
        this.powders = powders;
        this.special = this.#parseSpecial(powders);
    }

    static fromCluster(cluster, powderSlots = 0, fixCluster = true) {
        const powdersString = cluster.querySelector(".powder_input")?.value;
        if (!powdersString) return new Powders();

        const powderArr = [];
        for (let i = 0; i < powdersString.length / 2; i++) {
            const powderName = powdersString.substring(i * 2, i * 2 + 2);
            const powder = getPowder(powderName);
            if (powder == null) break;
            powderArr.push(powderName);
        }
        Powders.#sortArray(powderArr);

        if (fixCluster) Powders.#setPowderSlots(cluster, powderSlots);

        return new Powders(powderArr);
    }

    static fromBinary(binary) {
        const powderArr = [];

        let morePowders;
        let repeatPowder = false;
        do {
            if (!repeatPowder) morePowders = flag(binary);
            powderArr.push(repeatPowder
                ? powderArr[powderArr.powders.length - 1]
                : Powder.fromBinary(binary));
            repeatPowder = flag(binary);
        } while (morePowders);

        Powders.#sortArray(powderArr);

        return new Powders(powderArr);
    }

    toBinary() {
        if (!this.powders.length) return "0";

        let binary = "";

        let repeatPowder = false;
        for (let i = 0; i < this.powders.length; i++) {
            binary += repeatPowder ? this.powders.length - 1 === i : ("1" + Powder.toBinary(this.powders[i]));
            repeatPowder = this.powders[i] === this.powders[i + 1];
            binary += repeatPowder ? "1" : "0";
        }
        binary += "0";
        return binary;
    }

    #parseSpecial(isWeapon) {
        const tiered = this.powders.filter(powder => powder[1] > 3);
        let first = tiered[0];
        for (let i = 1; i < tiered.length; i++) {
            if (tiered[i][0] === first[0]) {
                const name = getPowderSpecialName(isWeapon ? "weapon" : "armour", first[0]);
                const tier = parseInt(tiered[i][1]) + parseInt(first[1]) - 7;
                return `${name}${tier}`;
            } else first = tiered[i];
        }
        return null;
    }

    static #sortArray(powderArray) {
        const order = [];
        for (const powder of powderArray) if (order.indexOf(powder[0]) === -1) order.push(powder[0]);
        powderArray.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
    }

    static #setPowderSlots(cluster, powderSlots) {
        const powderInput = cluster.querySelector(".powder_input");
        if (!powderInput) return;

        if (!powderSlots) {
            powderInput.placeholder = "No Slots";
            powderInput.maxLength = 0;
            powderInput.value = "";
            powderInput.disabled = true;
            return;
        }

        powderInput.disabled = false;
        powderInput.placeholder = powderSlots + " Slots";
        powderInput.maxLength = powderSlots * 2;
        if (powderInput.value.length > powderInput.maxLength)
            powderInput.value = powderInput.value.substring(0, powderInput.maxLength);
    }
}

class Powder {
    static toBinary(powder) {
        if (Powder.#isMaxTier(powder))
            return decimalToBinary(powderPrefixes.indexOf(powder[PowderIndex.ELEMENT]), powderTypeCount);
        else return (
            decimalToBinary(powderTypeCount) +
            decimalToBinary(powderPrefixes.indexOf(powder[PowderIndex.ELEMENT]), powderTypeCount) +
            decimalToBinary(powder[PowderIndex.TIER], maxPowderTier));
    }

    static fromBinary(binary) {
        const type = spliceOffNumber(binary, powderTypeCount + 1);
        let element;
        let tier;
        if (type < powderTypeCount) {
            element = powderPrefixes[type];
            tier = maxPowderTier;
        } else if (type === powderTypeCount) {
            element = powderPrefixes[spliceOffNumber(binary, powderTypeCount + 1)];
            tier = spliceOffNumber(binary, maxPowderTier - 1) + 1;
        } else throw new Error(`Powder.fromBinary() is broken!`);
        return (`${element}${tier}`);
    }

    static #isMaxTier(powderString) {
        return powderString[PowderIndex.TIER] === String(maxPowderTier);
    }
}

const PowderIndex = Object.freeze({
    ELEMENT: 0,
    TIER: 1
});

export function getPowder(powderShorthand) {
    return powders[powderShorthand];
}

function getPowderSpecialName(section, prefix) {
    return powderSpecialNames[section][powderPrefixes.indexOf(prefix)];
}
