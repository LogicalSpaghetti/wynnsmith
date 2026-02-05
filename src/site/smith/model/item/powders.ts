import {BitReader, decimalToBinary} from "../../../common/numbers.ts";
import type {CapitalizedElement, ElementalArray} from "../../../../data/small_stuff.ts";


type PowderPrefix = "e" | "t" | "w" | "f" | "a"
type PowderTier = 0 | 1 | 2 | 3 | 4 | 5
type PowderData = {
    [key in PowderPrefix]: [PowderEntry, PowderEntry, PowderEntry, PowderEntry, PowderEntry, PowderEntry];
};

type PowderEntry = {
    element: CapitalizedElement
    damage: [number, number]
    conversion: number
    def: ElementalArray
}

type PowderSpecialType = "weapon" | "armour"
// 0-indexed because I hate myself
type PowderSpecialTier = 0 | 1 | 2 | 3 | 4

const PowderSpecialTypes = {
    WEAPON: "weapon",
    ARMOUR: "armour",
} as const;

const powderSpecialNames = {
    weapon: ["Quake", "Chain Lightning", "Curse", "Courage", "Wind Prison"],
    armour: ["Rage", "Kill Streak", "Concentration", "Endurance", "Dodge"],
} as const;

const powders: PowderData = {
    e: [{
        element: "Earth",
        damage: [3, 6],
        conversion: 17,
        def: [0, 2, 0, 0, 0, -1],
    }, {
        element: "Earth",
        damage: [5, 8],
        conversion: 21,
        def: [0, 4, 0, 0, 0, -2],
    }, {
        element: "Earth",
        damage: [6, 10],
        conversion: 25,
        def: [0, 8, 0, 0, 0, -3],
    }, {
        element: "Earth",
        damage: [7, 10],
        conversion: 31,
        def: [0, 14, 0, 0, 0, -5],
    }, {
        element: "Earth",
        damage: [9, 11],
        conversion: 38,
        def: [0, 22, 0, 0, 0, -9],
    }, {
        element: "Earth",
        damage: [11, 13],
        conversion: 46,
        def: [0, 30, 0, 0, 0, -13],
    }],
    t: [{
        element: "Thunder",
        damage: [1, 8],
        conversion: 9,
        def: [0, -1, 3, 0, 0, 0],
    }, {
        element: "Thunder",
        damage: [1, 12],
        conversion: 11,
        def: [0, -1, 5, 0, 0, 0],
    }, {
        element: "Thunder",
        damage: [2, 15],
        conversion: 13,
        def: [0, -2, 9, 0, 0, 0],
    }, {
        element: "Thunder",
        damage: [3, 15],
        conversion: 17,
        def: [0, -4, 14, 0, 0, 0],
    }, {
        element: "Thunder",
        damage: [4, 17],
        conversion: 22,
        def: [0, -7, 20, 0, 0, 0],
    }, {
        element: "Thunder",
        damage: [5, 20],
        conversion: 28,
        def: [0, -10, 28, 0, 0, 0],
    }],
    w: [{
        element: "Water",
        damage: [3, 4],
        conversion: 9,
        def: [0, 0, -1, 3, 0, 0],
    }, {
        element: "Water",
        damage: [4, 6],
        conversion: 13,
        def: [0, 0, -1, 6, 0, 0],
    }, {
        element: "Water",
        damage: [5, 8],
        conversion: 15,
        def: [0, 0, -2, 11, 0, 0],
    }, {
        element: "Water",
        damage: [6, 8],
        conversion: 21,
        def: [0, 0, -4, 18, 0, 0],
    }, {
        element: "Water",
        damage: [7, 10],
        conversion: 26,
        def: [0, 0, -7, 28, 0, 0],
    }, {
        element: "Water",
        damage: [9, 11],
        conversion: 32,
        def: [0, 0, -10, 40, 0, 0],
    }],
    f: [{
        element: "Fire",
        damage: [2, 5],
        conversion: 14,
        def: [0, 0, 0, -1, 3, 0],
    }, {
        element: "Fire",
        damage: [4, 8],
        conversion: 16,
        def: [0, 0, 0, -2, 5, 0],
    }, {
        element: "Fire",
        damage: [5, 9],
        conversion: 19,
        def: [0, 0, 0, -3, 9, 0],
    }, {
        element: "Fire",
        damage: [6, 9],
        conversion: 24,
        def: [0, 0, 0, -5, 16, 0],
    }, {
        element: "Fire",
        damage: [8, 10],
        conversion: 30,
        def: [0, 0, 0, -9, 25, 0],
    }, {
        element: "Fire",
        damage: [10, 12],
        conversion: 37,
        def: [0, 0, 0, -13, 36, 0],
    }],
    a: [{
        element: "Air",
        damage: [2, 6],
        conversion: 11,
        def: [0, 0, 0, 0, -1, 3],
    }, {
        element: "Air",
        damage: [3, 10],
        conversion: 14,
        def: [0, 0, 0, 0, -2, 6],
    }, {
        element: "Air",
        damage: [4, 11],
        conversion: 17,
        def: [0, 0, 0, 0, -3, 10],
    }, {
        element: "Air",
        damage: [5, 11],
        conversion: 22,
        def: [0, 0, 0, 0, -5, 16],
    }, {
        element: "Air",
        damage: [7, 12],
        conversion: 28,
        def: [0, 0, 0, 0, -9, 24],
    }, {
        element: "Air",
        damage: [8, 14],
        conversion: 35,
        def: [0, 0, 0, 0, -13, 34],
    }],
} as const;

export class Powder {
    static readonly powderPrefixes: PowderPrefix[] = ["e", "t", "w", "f", "a"] as const;
    static readonly prefixCount = Powder.powderPrefixes.length;
    static readonly shorthandToElement: { [key in PowderPrefix]: CapitalizedElement } = {
        e: "Earth",
        t: "Thunder",
        w: "Water",
        f: "Fire",
        a: "Air",
    } as const;

    static readonly maxTier = 5;
    // 0-indexed to increase confusion
    static readonly maxPowderTier = 5;
    // 0-indexed to increase confusion
    static readonly lowestSpecialTier = 3;

    element;
    tier;

    constructor(element: CapitalizedElement, tier: PowderTier) {
        this.element = element;
        this.tier = tier;
    }

    static toBinary(powder: PowderKeyPair) {
        if (Powder.isMaxTier(powder))
            return decimalToBinary(powderPrefixes.indexOf(powder[PowderIndex.ELEMENT]), powderTypeCount);
        else return (
            decimalToBinary(powderTypeCount) +
            decimalToBinary(powderPrefixes.indexOf(powder[PowderIndex.ELEMENT]), powderTypeCount) +
            decimalToBinary(powder[PowderIndex.TIER], maxPowderTier));
    }

    static fromBinary(binary: BitReader): Powder {
        const type = binary.readNumber(powderTypeCount + 1);
        let element;
        let tier: PowderTier;
        if (type < powderTypeCount) {
            element = powderPrefixes[type];
            tier = maxPowderTier;
        } else if (type === powderTypeCount) {
            element = powderPrefixes[binary.readNumber(powderTypeCount + 1)];
            tier = binary.readNumber(maxPowderTier) as PowderTier;
        } else throw new Error(`Powder.fromBinary() is broken!`);
        return [element, tier];
    }

    private static isMaxTier(powder: PowderKeyPair) {
        return powder[PowderIndex.TIER] = maxPowderTier;
    }

    static getElementByShorthand(char: string) {
        if (char.length !== 1) throw new Error("char length should be 1");
        return shorthandElements[char] || null;
    }
}


export class Powders {
    powders;

    constructor(powders: PowderKeyPair[] = []) {
        this.powders = powders;
    }

    static fromCluster(cluster: HTMLElement, powderSlots = 0, fixCluster = true) {
        const powdersString = (cluster.querySelector(".powder_input") as HTMLInputElement)?.value;
        if (!powdersString) return new Powders();

        const powderArr: PowderKeyPair[] = [];
        for (let i = 0; i < powdersString.length / 2; i++) {
            const powderName = [powdersString[i * 2], powdersString[i * 2 + 1]];
            if (!(powderPrefixes as string[]).includes(powderName[PowderIndex.ELEMENT])) break;
            if (!(powderTiers as number[]).includes(parseInt(powderName[PowderIndex.TIER]))) break;
            powderArr.push(powderName as PowderKeyPair);
        }
        Powders.sortPowderArray(powderArr);

        if (fixCluster) Powders.setPowderSlots(cluster, powderSlots);

        return new Powders(powderArr);
    }

    // hasPowders must already be evaluated to true
    static fromBinary(binary: BitReader) {
        const powderArr: PowderKeyPair[] = [];

        let morePowders;
        let repeatPowder = false;
        do {
            powderArr.push(repeatPowder
                ? powderArr[powderArr.length - 1]
                : Powder.fromBinary(binary));
            repeatPowder = binary.readFlag();
            if (!repeatPowder) morePowders = binary.readFlag();
        } while (morePowders);

        Powders.sortPowderArray(powderArr);

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

    getSpecial(isWeapon: boolean): PowderSpecialKeyPair | null {
        const tiered = this.powders.filter(powder =>
            powder[PowderIndex.TIER] >= lowestSpecialTier);
        let first = tiered[0];
        for (let i = 1; i < tiered.length; i++) {
            if (tiered[i][PowderIndex.ELEMENT] === first[PowderIndex.ELEMENT]) {
                const name =
                    getPowderSpecialName(isWeapon ? PowderSpecialTypes.WEAPON : PowderSpecialTypes.ARMOUR, first[0]);
                const tier = tiered[i][PowderIndex.TIER] + first[PowderIndex.TIER] - lowestSpecialTier * 2 as PowderSpecialTier;
                return {name, tier};
            } else first = tiered[i];
        }
        return null;
    }

    // Sorts powders the same way Wynncraft does, by type but not tier.
    static sortPowderArray(powderArray: PowderKeyPair[]) {
        const order: PowderPrefix[] = [];
        for (const powder of powderArray) if (order.indexOf(powder[0]) === -1) order.push(powder[0]);
        powderArray.sort((a: PowderKeyPair, b: PowderKeyPair) => order.indexOf(a[0]) - order.indexOf(b[0]));
    }

    private static setPowderSlots(cluster: HTMLElement, powderSlots: number) {
        const powderInput = cluster.querySelector(".powder_input") as HTMLInputElement | null;
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

export class PowderSpecial {
    name;
    tier;

}

export function getPowder(powderShorthand: PowderKeyPair): PowderEntry {
    return powders[powderShorthand[PowderIndex.ELEMENT]][powderShorthand[PowderIndex.TIER]];
}

function getPowderSpecialName(section: PowderSpecialType, prefix: PowderPrefix) {
    return powderSpecialNames[section][powderPrefixes.indexOf(prefix)];
}