`use strict`;

const inputs = [
    document.querySelector(`.input--helmet`),
    document.querySelector(`.input--chestplate`),
    document.querySelector(`.input--leggings`),
    document.querySelector(`.input--boots`),
    document.querySelector(`.input--ring0`),
    document.querySelector(`.input--ring1`),
    document.querySelector(`.input--bracelet`),
    document.querySelector(`.input--necklace`),
    document.querySelector(`.input--weapon`),
];

const output = document.querySelector(`.output--A`);

function refreshBuild() {
    console.log("begin new refresh:");
    resetLinkText();
    const build = {
        class: "",
        attackSpeed: "",
        mIds: [],
        nodes: [],
        aspects: {},
        adds: {},
        toggles: [],
        powders: {
            armor: [],
            weapon: [],
        },
        final: {},
        convs: {},
        attacks: {},
        base: JSON.parse(emptyBaseString),
        ids: JSON.parse(emptyIdsString),
    };
    refreshClass(build);
    refreshItemData(build);
    refreshAbilities(build);
    addToggles(build);
    computeOutputs(build);

    addDamageDisplays(build);

    displayFinalValues(build);
}

function resetLinkText() {
    // resets the buttons if they were clicked
    document.querySelectorAll(".copy_link").forEach((button) => {
        button.textContent = button.dataset["default"];
    });
}

function getMultiplierForSkillPoints(sp) {
    return ((1 - Math.pow(0.9908, sp + 1)) / 0.0092 - 1) / 100;
}

function roundForDisplay(number) {
    if (typeof(number) !== "number") return number;
    const ret = Math.round((number + Number.EPSILON) * 100) / 100;
    return ret;
    // adds a trailing zero:
    // if (ret.toString().split(".").length === 1 || ret.toString().split(".")[1].length >= 2) return ret;
    // return ret + "0";
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
    var key = ['','C','CC','CCC','CD','D','DC','DCC','DCCC','CM',
        '','X','XX','XXX','XL','L','LX','LXX','LXXX','XC',
        '','I','II','III','IV','V','VI','VII','VIII','IX'];
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
