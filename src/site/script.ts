import {addInputListeners, addSettingsListeners} from "./smith/input_listeners";
import {TreeCanvas, type TreeData} from "./logic/ability/tree_canvas.ts";
import trees from "../js_data/trees.ts"
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

const inputs = new ItemInputs();
inputs.addEventListener("change", () => console.log("hello"))
document.getElementById("item_inputs")?.prepend(inputs.container);

const tree: TreeData = trees.shaman
const treeCanvas = new TreeCanvas(tree)
document.getElementById("ability_tree")?.appendChild(treeCanvas.canvas);
