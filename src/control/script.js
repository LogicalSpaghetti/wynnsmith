`use strict`;

function refreshBuild() {
    console.log("begin new refresh:");
    resetLinkText();
    const build = new Build();

    fixSPInputs();

    refreshClass(build);
    if (currentClass === "") return;
    refreshItemData(build);
    refreshTomes(build);
    refreshAbilities(build);

    setUpOptionals(build);
    addToggles(build);

    removeOverridenEffects(build);
    calculateStats(build);
    computeOutputs(build);

    addDamageDisplays(build);
    displayFinalValues(build);
    updateTreeRender(build);

    displayForDevelopment(build);
}

function roundForDisplay(number, addPeriod) {
    if (typeof number !== "number") return number;
    const ret = Math.round((number + Number.EPSILON) * 100) / 100;

    // add trailing zeros
    if (ret.toString().split(".").length === 1) {
        return ret + (addPeriod ? ".00" : "");
    } else {
        return ret.toString().split(".")[1].length < 2 ? ret + "0" : ret;
    }
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
    return decimal.toString(2);
}

function romanize(num) {
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

function deromanize(str) {
    str = str.toUpperCase();
    const validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/;
    const token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g;
    const key = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1};
    let num = 0, m;
    if (!(str && validator.test(str))) return false;
    while ((m = token.exec(str))) num += key[m[0]];
    return num;
}

const iconHeaders = {
    "neutral": getHeaderForIcon("neutral", "✣"),
    "earth": getHeaderForIcon("earth", "✤"),
    "thunder": getHeaderForIcon("thunder", "✦"),
    "water": getHeaderForIcon("water", "❉"),
    "fire": getHeaderForIcon("fire", "✹"),
    "air": getHeaderForIcon("air", "❋"),
    "health": getHeaderForIcon("health", "⚔"),
    "mana": getHeaderForIcon("water", "✺"),
};

const colorHeaders = {
    "earth": getHeaderForColor("earth"),
    "thunder": getHeaderForColor("thunder"),
    "water": getHeaderForColor("water"),
    "fire": getHeaderForColor("fire"),
    "air": getHeaderForColor("air"),
    "health": getHeaderForColor("health"),
};

function getHeaderForIcon(color, elementEmoji) {
    return `<span class=\"${color}\"><b class=\"font-minecraft\" style=\"display: inline-block; width: 1ch\">${elementEmoji}</b> `;
}

function getHeaderForColor(color) {
    return `<span class=\"${color}\">`;
}
