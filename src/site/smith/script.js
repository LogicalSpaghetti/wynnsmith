import {resetWarnings} from "./control/warnings.js";
import {getBuildsFromInput} from "./model/build/permute.js";
import {displayBuilds} from "./control/write.js";
import {preLoadAssets} from "./control/preloading.js";
import {addInputListeners} from "./control/listener/input_listeners.js";
import {addSettingsListeners} from "./control/listener/settings_listeners.js";

// code entry point:
document.addEventListener("load", loadSite);

function loadSite() {
    // noinspection JSIgnoredPromiseFromCall
    preLoadAssets();
    // TODO:
    //  read Link
    //  parse Build from Link
    //  Initialize Input HTML values from Link
    addInputListeners();
    addSettingsListeners();
}

// TODO: move to a different file
export function refreshBuild() {
    resetWarnings();
    const input = getInputByElementClass("primary-input");

    const builds = getBuildsFromInput(input);

    displayBuilds(input, builds);
}
