`use strict`;

const inputs = [
    document.getElementById(`input_helmet`),
    document.getElementById(`input_chestplate`),
    document.getElementById(`input_leggings`),
    document.getElementById(`input_boots`),
    document.getElementById(`input_ring0`),
    document.getElementById(`input_ring1`),
    document.getElementById(`input_bracelet`),
    document.getElementById(`input_necklace`),
    document.getElementById(`input_weapon`),
];

const tomeInputs = document.querySelectorAll('.tome_input')

const spInputs = document.querySelectorAll(".sp");

const outputAll = document.getElementById(`dev_output`);

function refreshBuild() {
    console.log("begin new refresh:");
    resetLinkText();
    const build = new Build();

    fixSPInputs();

    refreshClass(build);
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

    displayForDevelopment(build);
}

function getMultiplierForSkillPoints(sp) {
    return ((1 - Math.pow(0.9908, sp + 1)) / 0.0092 - 1) / 100;
}

function roundForDisplay(number, addPeriod) {
    if (typeof number !== "number") return number;
    const ret = Math.round((number + Number.EPSILON) * 100) / 100;
    // return ret;
    // add trailing zeros

    if (ret.toString().split(".").length === 1) {
        if (addPeriod) {
            return ret + ".00";
        } else {
            return ret;
        }
    } else {
        return ret.toString().split(".")[1].length < 2 ? ret + "0" : ret;
    }
}

function intToBase64(decimal) {
    var sfStr = "";
    do {
        sfStr = base64Values[decimal % 64] + sfStr;
        decimal -= decimal % 64;
        decimal /= 64;
    } while (decimal > 0);
    return sfStr;
}

function base64ToDecimal(sixtyFour) {
    var binary = "";
    for (let i = 0; i < sixtyFour.length; i++) {
        const character = sixtyFour[i];
        var subBinary = "" + base64Values.indexOf(character).toString(2);
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
    var digits = String(+num).split("");
    var key = [
        "", "C", "CC", "CCC", "CD",
        "D", "DC", "DCC", "DCCC", "CM",
        "", "X", "XX", "XXX", "XL",
        "L", "LX", "LXX", "LXXX", "XC",
        "", "I", "II", "III", "IV",
        "V", "VI", "VII", "VIII", "IX",
    ];
    var roman = "",
        i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

function deromanize(str) {
    var str = str.toUpperCase();
    var validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/;
    var token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g;
    var key = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    var num = 0,
        m;
    if (!(str && validator.test(str))) return false;
    while ((m = token.exec(str))) num += key[m[0]];
    return num;
}

function getSPMult(sp) {
    return spMultipliers[sp < 0 ? 0 : sp > 150 ? 150 : sp];
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
}

const colorHeaders = {
    "earth": getHeaderForColor("earth"),
    "thunder": getHeaderForColor("thunder"),
    "water": getHeaderForColor("water"),
    "fire": getHeaderForColor("fire"),
    "air": getHeaderForColor("air"),
    "health": getHeaderForColor("health"),
}

function getHeaderForIcon(color, elementEmoji) {
    return '<span class="'+ color + '"><b class="font-minecraft" style="display: inline-block; width: 1ch">' + elementEmoji + '</b> ';
}

function getHeaderForColor(color) {
    return '<span class="'+ color + '">';
}