import {preLoadAssets} from "./smith/preloading.ts";
import {addInputListeners, addSettingsListeners} from "./smith/input_listeners";

// code entry point:
window.addEventListener("load", loadSite);

function loadSite() {
    console.log("loading project");
    preLoadAssets();
    // TODO:
    //  read Link
    //  parse Build from Link
    //  Initialize Input HTML values from Link
    addInputListeners();
    addSettingsListeners();
}