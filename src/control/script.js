`use strict`;

function refreshBuild() {
    const input = new Input();
    input.init();

    const builds = permute(input);

    display(input, builds);
}

function roundForDisplay(number, addPeriod) {
    if (typeof number !== "number") return number;
    const ret = Math.round((number + Number.EPSILON) * 100) / 100;

    // add trailing zeros
    return ret.toString().split(".").length === 1
        ? ret + (addPeriod ? ".00" : "")
        : ret.toString().split(".")[1].length < 2 ? ret + "0" : ret;
}

function intToBase64(decimal) {
    let sfStr = "";
    do {
        sfStr = base64Values[decimal % 64] + sfStr;
        decimal -= decimal % 64;
        decimal /= 64;
    } while (decimal > 0);
    return sfStr;
}

function base64ToDecimal(sixtyFour) {
    let binary = "";
    for (let i = 0; i < sixtyFour.length; i++) {
        const character = sixtyFour[i];
        let subBinary = "" + base64Values.indexOf(character).toString(2);
        while (subBinary.length % 6 !== 0) subBinary = "0" + subBinary;
        binary += subBinary;
    }
    return parseInt(binary, 2);
}

function binaryToDecimal(binary) {
    return parseInt(binary, 2);
}

function decimalToBinary(decimal) {
    return (decimal >>> 0).toString(2);
}

function decimalToRoman(num) {
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

function romanToDecimal(str) {
    str = str.toUpperCase();
    const validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/;
    const token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g;
    const key = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1};
    let num = 0, m;
    if (!(str && validator.test(str))) return false;
    while ((m = token.exec(str))) num += key[m[0]];
    return num;
}

function getHeaderForColor(color) {
    return `<span class=\"${color}\">`;
}
