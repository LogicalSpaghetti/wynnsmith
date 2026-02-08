import {preLoadAssets} from "./smith/preloading.ts";
import {addInputListeners, addSettingsListeners} from "./smith/input_listeners";
import {ItemInput} from "./logic/item/item_input.ts";

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


const itemInput = new ItemInput("weapon", true, true,
    () => {console.log("hello!")})
document.getElementById("skib")?.appendChild(itemInput.container);
