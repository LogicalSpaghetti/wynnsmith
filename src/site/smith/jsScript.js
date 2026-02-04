// import {preLoadAssets} from "./control/preloading.ts";
import {addInputListeners} from "./control/listener/input_listeners.js";
import {addSettingsListeners} from "./control/listener/settings_listeners.js";

// old code entry point:
window.addEventListener("load", loadSite);

function loadSite() {
    console.log("loadJS");
    // TODO:
    //  read Link
    //  parse Build from Link
    //  Initialize Input HTML values from Link
    addInputListeners();
    addSettingsListeners();
}
