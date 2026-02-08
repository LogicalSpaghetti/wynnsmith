const base64Values = [
    "0", "1", "2", "3", "4", "5", "6", "7",
    "8", "9", "a", "b", "c", "d", "e", "f",
    "g", "h", "i", "j", "k", "l", "m", "n",
    "o", "p", "q", "r", "s", "t", "u", "v",
    "w", "x", "y", "z", "A", "B", "C", "D",
    "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z", "_", "'",
];

// TODO: .toFixed()
export function roundForDisplay(number: number, addPeriod: boolean = false) {
    const ret = Math.round((number + Number.EPSILON) * 100) / 100;
    if (!addPeriod) return ret.toString();

    if (Number.isInteger(ret)) return ret + ".00";

    const split = ret.toString().split(".");
    return split[0] + "." + split[1].padEnd(2 - split[1].length, "0");
}

export function decimalToBase64(decimal: number): string {
    let sfStr = "";
    do {
        sfStr = base64Values[decimal % 64] + sfStr;
        decimal -= decimal % 64;
        decimal /= 64;
    } while (decimal > 0);
    return sfStr;
}

export function base64ToDecimal(sixtyFour: string): number {
    let binary = "";
    for (let i = 0; i < sixtyFour.length; i++) {
        const character = sixtyFour[i];
        let subBinary = "" + base64Values.indexOf(character).toString(2);
        while (subBinary.length % 6 !== 0) subBinary = "0" + subBinary;
        binary += subBinary;
    }
    return parseInt(binary, 2);
}

export function binaryToDecimal(binary: string) {
    return parseInt(binary, 2);
}

export function decimalToBinaryByMaximum(decimal: number, maxDecimal = 1) {
    return decimalToBinary(decimal, decimalToBinary(maxDecimal).length);
}

export function decimalToBinary(decimal: number, length = 1) {
    return (decimal >>> 0).toString(2).padStart(length, "0");
}

const decimalToRomanKey = [
    "", "C", "CC", "CCC", "CD",
    "D", "DC", "DCC", "DCCC", "CM",
    "", "X", "XX", "XXX", "XL",
    "L", "LX", "LXX", "LXXX", "XC",
    "", "I", "II", "III", "IV",
    "V", "VI", "VII", "VIII", "IX"];

export function decimalToRoman(num: number) {
    const digits = String(num).split("");
    let roman = "", i = 3;
    while (i--) roman = (decimalToRomanKey[+(digits.pop() || 0) + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

const validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/;
const token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g;
const romanToDecimalKey: {[key: string]: number}
    = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1};

export function romanToDecimal(str: string) {
    str = str.toUpperCase();
    let num = 0, m;
    if (!(str && validator.test(str))) return false;
    while ((m = token.exec(str))) num += romanToDecimalKey[m[0]];
    return num;
}

export function binaryToBase64(binary: string): string {
    return decimalToBase64(binaryToDecimal(binary));
}

export function base64ToBinary(sixtyFour: string): string {
    return decimalToBinary(base64ToDecimal(sixtyFour));
}

export function getBinaryLength(number: number): number {
    return decimalToBinary(number).length;
}

export class BitReader {
    index = 0;
    bitString;

    constructor(data: string, isBase64: boolean) {
        this.bitString = isBase64 ? base64ToBinary(data) : data;
    }

    previewFlag() {
        return this.bitString[this.index] === "1";
    }

    readFlag() {
        return this.bitString[this.index++] === "1";
    }

    readNumberByMaximum(maximumValue: number): number {
        return this.readNumber(decimalToBinary(maximumValue).length);
    }

    readNumber(bitCount: number): number {
        return binaryToDecimal(this.readBits(bitCount));
    }

    readBits(bitCount: number): string {
        if (bitCount <= 0 || bitCount > 32) throw new RangeError("bitCount must be between 1 and 32");
        const binary = this.previewBits(bitCount);
        this.index += bitCount;
        return binary;
    }

    previewBits(count: number): string {
        if (count > this.bitsRemaining()) throw new RangeError(`count ${count} is out of bounds for BitReader of length ${this.bitString.length} at index ${this.index}`);
        return this.bitString.substring(this.index, this.index + count);
    }

    previewRemainingBits(): string {
        return this.previewBits(this.bitsRemaining());
    }

    bitsRemaining() {
        return this.bitString.length - this.index;
    }

    reset() {
        this.index = 0;
    }

    toString() {
        return this.bitString;
    }
}
