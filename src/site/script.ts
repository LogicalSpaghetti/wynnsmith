import {preLoadAssets} from "./smith/preloading.ts";
import {addInputListeners, addSettingsListeners} from "./smith/input_listeners";
import {ItemInput} from "./logic/item/item_input.ts";
import {type TravelNode, TreeCanvas} from "./render/canvas.ts";

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
    () => {})
document.getElementById("skib")?.appendChild(itemInput.container);

const state: TravelNode[] = [
    {up: 1, down: 1, left: 1, right: 1},
    {up: 1, down: 1, left: 1, right: 1},
    {up: 1, down: 1, left: 1, right: 1},
    {up: 1, down: 1, left: 1, right: 1},
    {up: 1, down: 1, left: 1, right: 1},
    {up: 1, down: 1, left: 1, right: 1},
    {up: 1, down: 1, left: 1, right: 1},
    {up: 1, down: 1, left: 1, right: 1},
    {up: 1, down: 1, left: 1, right: 1},
    {up: 1, down: 1, left: 1, right: 1},
    {up: 1, down: 1, left: 1, right: 1},
]
const treeCanvas = new TreeCanvas(state)
document.getElementById("skib")?.appendChild(treeCanvas.canvas);
