const base64Values = [
    "0", "1", "2", "3", "4", "5", "6", "7",
    "8", "9", "a", "b", "c", "d", "e", "f",
    "g", "h", "i", "j", "k", "l", "m", "n",
    "o", "p", "q", "r", "s", "t", "u", "v",
    "w", "x", "y", "z", "A", "B", "C", "D",
    "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z", "_", "'"
];

export function roundForDisplay(number, addPeriod) {
    if (typeof number !== "number") return number;
    const ret = Math.round((number + Number.EPSILON) * 100) / 100;

    // add trailing zeros
    return ret.toString().split(".").length === 1
        ? ret + (addPeriod ? ".00" : "")
        : ret.toString().split(".")[1].length < 2 ? ret + "0" : ret;
}

export function decimalToBase64(decimal) {
    let sfStr = "";
    do {
        sfStr = base64Values[decimal % 64] + sfStr;
        decimal -= decimal % 64;
        decimal /= 64;
    } while (decimal > 0);
    return sfStr;
}

export function base64ToDecimal(sixtyFour) {
    let binary = "";
    for (let i = 0; i < sixtyFour.length; i++) {
        const character = sixtyFour[i];
        let subBinary = "" + base64Values.indexOf(character).toString(2);
        while (subBinary.length % 6 !== 0) subBinary = "0" + subBinary;
        binary += subBinary;
    }
    return parseInt(binary, 2);
}

export function binaryToDecimal(binary) {
    return parseInt(binary, 2);
}

export function decimalToBinary(decimal, maxDecimal = 1) {
    return decimalToPaddedBinary(decimal, decimalToPaddedBinary(maxDecimal).length);
}

function decimalToPaddedBinary(decimal, paddingLength = 1) {
    return (decimal >>> 0).toString(2).padStart(paddingLength, "0");
}

export function decimalToRoman(num) {
    if (!+num) return false;
    const digits = String(+num).split("");
    const key = [
        "", "C", "CC", "CCC", "CD",
        "D", "DC", "DCC", "DCCC", "CM",
        "", "X", "XX", "XXX", "XL",
        "L", "LX", "LXX", "LXXX", "XC",
        "", "I", "II", "III", "IV",
        "V", "VI", "VII", "VIII", "IX"];
    let roman = "", i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

export function romanToDecimal(str) {
    str = str.toUpperCase();
    const validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/;
    const token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g;
    const key = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1};
    let num = 0, m;
    if (!(str && validator.test(str))) return false;
    while ((m = token.exec(str))) num += key[m[0]];
    return num;
}

export function getBinaryLength(number) {
    return decimalToBinary(number).length;
}

// returns a boolean if length is 1, otherwise it returns an integer.
export function flag(binary, length = 1) {
    if (length === 1) return binary.splice(0, 1) === "1";
    return decimalToBinary(binary.splice(0, length));
}

export function spliceOffNumber(binary, maxValue) {
    return binaryToDecimal(binary.splice(0, getBinaryLength(maxValue)));
}
