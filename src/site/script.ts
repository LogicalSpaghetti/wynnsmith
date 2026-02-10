import {addInputListeners, addSettingsListeners} from "./smith/input_listeners";
import {ItemInput} from "./logic/item/item_input.ts";
import {type CellMap, TreeCanvas} from "./render/canvas.ts";
import trees from "../js_data/trees.js"
import {ItemInputs} from "./logic/item/item_inputs.ts";

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

const inputs = new ItemInputs(() => console.log("hello!"));
document.getElementById("skib")?.appendChild(inputs.container);

const state: CellMap = trees.archer.cellMap
const treeCanvas = new TreeCanvas(state)
document.getElementById("ability_tree")?.appendChild(treeCanvas.canvas);
