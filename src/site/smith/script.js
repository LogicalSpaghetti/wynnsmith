import {preLoadAssets} from "./control/preloading.js";
import {addInputListeners} from "./control/listener/input_listeners.js";
import {addSettingsListeners} from "./control/listener/settings_listeners.js";
import {properValidate} from "./model/skill_point/verifier.js";

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
    {cost:[10,0,0,0,0],given:[2,0,0,0,0]},
    {cost:[15,0,0,0,0],given:[3,0,0,0,0]},
    {cost:[10,0,0,0,0],given:[-10,0,0,0,0]},
    {cost:[7,0,0,0,0],given:[6,0,0,0,0]},
]));