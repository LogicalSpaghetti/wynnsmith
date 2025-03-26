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
        majorIds: [],
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
    output.textContent = JSON.stringify(build);
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
