import {preLoadAssets} from "./control/preloading";
// import {addInputListeners} from "./control/listener/input_listeners.js";
// import {addSettingsListeners} from "./control/listener/settings_listeners.js";
// import {testSP} from "./model/skill_point/skill_points.test.js";

// code entry point:
window.addEventListener("load", loadSite);

function loadSite() {
    console.log("loading project");
    preLoadAssets();
    // TODO:
    //  read Link
    //  parse Build from Link
    //  Initialize Input HTML values from Link
    // addInputListeners();
    // addSettingsListeners();
}

// testSP()