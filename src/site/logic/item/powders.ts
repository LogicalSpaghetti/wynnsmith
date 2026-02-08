import {BitReader, decimalToBinary} from "../../common/numbers.ts";
import {type CapitalizedElement, type ElementalArray, elementTypeCount} from "../../common/small_stuff.ts";


type PowderData = {
    [key in PowderPrefix]: [PowderEntry, PowderEntry, PowderEntry, PowderEntry, PowderEntry, PowderEntry];
};
type PowderEntry = {
    element: CapitalizedElement
    damage: [number, number]
    conversion: number
    def: ElementalArray
}

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

export function getPowderData(powder: Powder): PowderEntry {
    return powders[powder.element][powder.tier];
}

type PowderTier = 0 | 1 | 2 | 3 | 4 | 5
export type PowderPrefix = typeof powderPrefixes[number]
const powderPrefixes = ["e", "t", "w", "f", "a"] as const;

export class Powder {
    // 0-indexed to increase confusion
    static readonly maxTier = 5;
    // 0-indexed to increase confusion
    static readonly lowestSpecialTier = 3;
    static readonly bitsPerEncoding = 3;

    element;
    tier;

    constructor(element: PowderPrefix, tier: PowderTier) {
        if (tier > Powder.maxTier) throw new RangeError(`Tier ${tier} is greater than the maximum of ${Powder.maxTier}`);
        this.element = element;
        this.tier = tier;
    }

    toBinary() {
        return (this.isMaxTier()) ?
            decimalToBinary(powderPrefixes.indexOf(this.element), Powder.bitsPerEncoding)
            : (
                decimalToBinary(elementTypeCount, Powder.bitsPerEncoding) +
                decimalToBinary(powderPrefixes.indexOf(this.element), Powder.bitsPerEncoding) +
                decimalToBinary(this.tier, Powder.bitsPerEncoding)
            );
    }

    static fromBinary(binary: BitReader): Powder {
        const type = binary.readNumber(Powder.bitsPerEncoding);
        let element;
        let tier: PowderTier;
        if (type < elementTypeCount) {
            element = powderPrefixes[type];
            tier = Powder.maxTier;
        } else if (type === elementTypeCount) {
            element = powderPrefixes[binary.readNumber(Powder.bitsPerEncoding)];
            tier = binary.readNumber(Powder.bitsPerEncoding) as PowderTier;
        } else throw new Error(`${type} is outside of allowed range!`);
        return new Powder(element, tier);
    }

    isMaxTier() {
        return this.tier === Powder.maxTier;
    }


    equals(powder: Powder) {
        return this.tier === powder.tier && this.element === powder.element;
    }

    toString() {
        return this.element + (this.tier + 1);
    }
}

export class Powders {
    powders;

    constructor(powders: Powder[] | string = []) {
        if (typeof powders === "string") powders = Powders.stringToArr(powders)
        this.powders = Powders.sortPowderArray(powders);
    }

    static fromCluster(cluster: HTMLElement, powderSlots = 0, fixCluster = true) {
        const powdersString = (cluster.querySelector(".powder_input") as HTMLInputElement)?.value;
        if (!powdersString) return new Powders();

        if (fixCluster) Powders.setPowderSlots(cluster, powderSlots);

        return Powders.fromString(powdersString);
    }

    static fromBinary(binary: BitReader) {
        const powderArr: Powder[] = [];

        const hasPowders = binary.readFlag();
        if (!hasPowders) return new Powders();

        let morePowders = true;
        let repeatPowder = false;
        while (morePowders) {
            powderArr.push(repeatPowder
                ? powderArr[powderArr.length - 1]
                : Powder.fromBinary(binary));
            repeatPowder = binary.readFlag();
            if (!repeatPowder) morePowders = binary.readFlag();
        }

        return new Powders(powderArr);
    }

    toBinary() {
        if (!this.powders.length) return "0";

        let binary = "1";

        let repeatPowder = false;
        for (let i = 0; i < this.powders.length; i++) {
            binary += repeatPowder ? "" : (this.powders[i].toBinary());

            repeatPowder = i !== this.powders.length - 1 && this.powders[i].equals(this.powders[i + 1]);
            binary += repeatPowder ? "1" : "0";
            if (!repeatPowder)
                binary += i < this.powders.length - 1 ? "1" : "0"; // morePowders
        }
        return binary;
    }

    getSpecial(isWeapon: boolean): PowderSpecial | null {
        const tiered = this.powders.filter(powder =>
            powder.tier >= Powder.lowestSpecialTier);
        let first = tiered[0];
        for (let i = 1; i < tiered.length; i++) {
            if (tiered[i].element === first.element) {
                const name =
                    PowderSpecial.nameFromPrefix(isWeapon ? PowderSpecialTypes.WEAPON : PowderSpecialTypes.ARMOUR, first.element);
                const tier = tiered[i].tier + first.tier - Powder.lowestSpecialTier * 2 as PowderSpecialTier;
                return new PowderSpecial(name, tier);
            } else first = tiered[i];
        }
        return null;
    }

    // Sorts powders the same way Wynncraft does, by element but not tier.
    static sortPowderArray(powderArray: Powder[]) {
        const order: PowderPrefix[] = [];
        for (const powder of powderArray) if (order.indexOf(powder.element) === -1) order.push(powder.element);
        powderArray.sort((a: Powder, b: Powder) => order.indexOf(a.element) - order.indexOf(b.element));
        return powderArray;
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

    static fromString(powdersString: string): Powders {
        return new Powders(this.stringToArr(powdersString));
    }

    static stringToArr(powdersString: string): Powder[] {
        const powderArr: Powder[] = [];
        for (let i = 0; i < powdersString.length / 2; i++) {
            const element = powdersString[i * 2];
            if (!(powderPrefixes).find(x => x === element)) break;
            const tier = parseInt(powdersString[i * 2 + 1]) - 1;
            if (isNaN(tier) || tier > Powder.maxTier) break;
            powderArr.push(new Powder(element as PowderPrefix, tier as PowderTier));
        }
        return powderArr;
    }

    toString() {
        return this.powders.map(powder => powder.toString()).join("");
    }

    equals(powders: Powders) {
        if (this.powders.length !== powders.powders.length) return false;
        for (let i = 0; i < this.powders.length; i++)
            if (!this.powders[i].equals(powders.powders[i])) return false;
        return true;
    }
}

type PowderSpecialType = "weapon" | "armour"
// 0-indexed because I hate myself
type PowderSpecialTier = 0 | 1 | 2 | 3 | 4
type WeaponSpecialName = typeof PowderSpecial.names.weapon[number];
type ArmourSpecialName = typeof PowderSpecial.names.armour[number];

const PowderSpecialTypes = {
    WEAPON: "weapon",
    ARMOUR: "armour",
} as const;

export class PowderSpecial {

    static readonly names = {
        weapon: ["Quake", "Chain Lightning", "Curse", "Courage", "Wind Prison"],
        armour: ["Rage", "Kill Streak", "Concentration", "Endurance", "Dodge"],
    } as const;

    name: WeaponSpecialName | ArmourSpecialName;
    tier: PowderSpecialTier;

    constructor(name: WeaponSpecialName | ArmourSpecialName, tier: PowderSpecialTier) {
        this.name = name;
        this.tier = tier;
    }

    static nameFromPrefix(section: PowderSpecialType, prefix: PowderPrefix) {
        return PowderSpecial.names[section][powderPrefixes.indexOf(prefix)];
    }
}
