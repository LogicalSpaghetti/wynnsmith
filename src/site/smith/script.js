import {preLoadAssets} from "./control/preloading.js";
import {addInputListeners} from "./control/listener/input_listeners.js";
import {addSettingsListeners} from "./control/listener/settings_listeners.js";
import {properValidate, testOptimizer} from "./model/skill_point/verifier.js";
import {minimizeRequiredSP} from "./model/skill_point/minimizer.js";

// code entry point:
window.addEventListener("load", loadSite);

function loadSite() {
    console.log("loadSite");
    // noinspection JSIgnoredPromiseFromCall
    preLoadAssets();
    // TODO:
    //  read Link
    //  parse Build from Link
    //  Initialize Input HTML values from Link
    addInputListeners();
    addSettingsListeners();
}

console.log(properValidate([15, 0, 0, 0, 0], [
    {cost: [10, 0, 0, 0, 0], given: [2, 0, 0, 0, 0]},
    {cost: [15, 0, 0, 0, 0], given: [3, 0, 0, 0, 0]},
    {cost: [10, 0, 0, 0, 0], given: [-10, 0, 0, 0, 0]},
    {cost: [7, 0, 0, 0, 0], given: [6, 0, 0, 0, 0]}
]));

const testCases = [[
    {cost: [8, 0, 0, 0, 0], given: [1, 1, 1, 1, 1]},
    {cost: [7, 7, 0, 0, 0], given: [1, 1, 1, 1, 1]},
    {cost: [6, 6, 6, 0, 0], given: [1, 1, 1, 1, 1]},
    {cost: [5, 5, 5, 5, 0], given: [1, 1, 1, 1, 1]},
    {cost: [4, 4, 4, 4, 4], given: [1, 1, 1, 1, 1]},
    {cost: [3, 3, 3, 3, 3], given: [1, 1, 1, 1, 1]},
    {cost: [2, 2, 2, 2, 2], given: [1, 1, 1, 1, 1]},
    {cost: [1, 1, 1, 1, 1], given: [1, 1, 1, 1, 1]},
    {cost: [0, 0, 0, 0, 0], given: [1, 1, 1, 1, 1]}
], [
    {cost: [18, 0, 0, 0, 0], given: [0, 0, 0, 1, 0]},
    {cost: [7, 7, 0, 0, 0], given: [1, 1, 1, 1, 1]},
    {cost: [6, 6, 1, 6, 0], given: [1, 1, 1, 0, 1]},
    {cost: [5, 1, 5, 5, 0], given: [1, 3, 1, 3, 1]},
    {cost: [4, 7, 0, 4, 4], given: [0, 1, 0, 0, 0]},
    {cost: [3, 3, 7, 3, 3], given: [3, 0, 0, 1, 1]},
    {cost: [2, 2, 2, 20, 2], given: [1, 1, 1, 1, 1]},
    {cost: [1, 1, 1, 1, 8], given: [1, 1, 1, 1, 1]},
    {cost: [0, 0, 0, 0, 0], given: [1, 1, 1, 1, 1]}
], [
    {cost: [1, 4, 0, 0, 0], given: [2, 1, 0, 0, 0]},
    {cost: [0, 0, 3, 1, 0], given: [0, 0, 0, 3, 0]},
    {cost: [0, 0, 0, 0, 1], given: [0, 1, 0, 0, 0]},
    {cost: [0, 0, 0, 6, 1], given: [0, 0, 0, 1, 5]},
    {cost: [4, 0, 0, 0, 0], given: [1, 0, 0, 0, 0]},
    {cost: [0, 0, 1, 0, 0], given: [0, 0, 1, 0, 0]},
    {cost: [0, 0, 0, 1, 0], given: [0, 0, 0, 1, 0]},
    {cost: [0, 1, 0, 0, 7], given: [0, 1, 0, 0, 0]},
    {cost: [5, 8, 0, 0, 0], given: [0, 0, 3, 0, 1]}
]
];

testOptimizer(minimizeRequiredSP, testCases);
