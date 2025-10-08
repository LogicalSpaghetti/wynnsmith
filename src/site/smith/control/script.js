import {resetWarnings} from "../html/warnings.js";
import {getInputByElementClass} from "../html/build.js";
import {getBuildsFromInput} from "../logic/build/permute.js";
import {displayBuilds} from "../html/write.js";
import {preLoadAssets} from "../logic/preloading.js";
import {addInputListeners} from "./listener/input_listeners.js";
import {addSettingsListeners} from "./listener/settings_listeners.js";

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
