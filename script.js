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
        base: JSON.parse(emptyBaseString),
        ids: JSON.parse(emptyIdsString),
        mIds: [],
        nodes: [],
        adds: {},
        toggles: [],
        powders: {
            armor: [],
            weapon: [],
        },
        attacks: {},
    };
    console.log(build.ids);
    refreshAbilities(build);
    refreshItemData(build);
    addToggles(build);
    computeOutputs(build);
    output.textContent = JSON.stringify(build).replaceAll(",", ",\n").replaceAll("{", "{\n").replaceAll("}", "\n}");
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
    const ret = Math.round((number + Number.EPSILON) * 100) / 100;
    if (ret.toString().split(".").length === 1 || ret.toString().split(".")[1].length >= 2) return ret;
    return ret + "0";
}

base64ToDecimal(intToBase64(10))
base64ToDecimal(intToBase64(64))
base64ToDecimal(intToBase64(4095))
base64ToDecimal(intToBase64(4096))

function intToBase64(decimal) {
    var sfStr = "";
    do {
        sfStr = base64Values[decimal % 64] + sfStr;
        decimal -= decimal % 64;
        decimal /= 64;
    } while (decimal > 0);

    console.log(sfStr);
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

    console.log(parseInt(binary, 2))
    return parseInt(binary, 2);
}
