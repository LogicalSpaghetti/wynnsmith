import {addInputListeners, addSettingsListeners} from "./smith/input_listeners";
import {TreeCanvas} from "./logic/ability/tree_canvas.ts";
import {ItemInputs, TomeInputs} from "./logic/item/item_inputs.ts";

// code entry point:
if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", loadSite);
} else {
    loadSite();
}
window.addEventListener("DOMContentLoaded", loadSite);

function loadSite() {
    console.log("loading project");
    // TODO:
    //  read Link
    //  parse Build from Link
    //  Initialize Input HTML values from Link
    addInputListeners();
    addSettingsListeners();
}

const inputs = new ItemInputs();
inputs.addEventListener("change", () => console.log("hello"))
document.getElementById("item_inputs")?.prepend(inputs.container);

const tomeInputs = new TomeInputs();
tomeInputs.addEventListener("change", () => console.log("hello"))
document.getElementById("tome_inputs")?.prepend(tomeInputs.container);

const treeCanvas = new TreeCanvas("shaman", true)
document.getElementById("ability_tree")?.appendChild(treeCanvas.container);
