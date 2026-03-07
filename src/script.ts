import {addInputListeners, addSettingsListeners} from "./smith/input_listeners";
import {GearInputs, TomeInputs} from "./item/input/item_inputs.ts";
import {HistoryLedger} from "./change_handling/history.ts";
import {AbilityTree} from "./ability/tree/ability_tree.ts";
import {maxPlayerLevel} from "./to_sort/small_stuff.ts";

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

const inputs = new GearInputs();
document.getElementById("item_inputs")?.prepend(inputs.holder());
inputs.addEventListener("change", () => console.log(inputs.getData()));

const tomeInputs = new TomeInputs();
document.getElementById("tome_inputs")?.prepend(tomeInputs.holder());

const tree = new AbilityTree("archer", maxPlayerLevel);
document.getElementById("ability_tree")?.appendChild(tree.holder());

const ledger = new HistoryLedger(100);
ledger.register(inputs, tomeInputs, tree);

function handler(e: KeyboardEvent) {
    if ((e.target as HTMLElement).classList.contains("allow-undo")) return;
    const ctrl = e.metaKey || e.ctrlKey;

    if (!ctrl) return;

    if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        if (e.shiftKey) ledger.redo();
        else ledger.undo();
    } else if (e.key === "y" || e.key === "Y") {
        e.preventDefault();
        ledger.redo();
    }
}

document.addEventListener("keydown", handler, {capture: true});
