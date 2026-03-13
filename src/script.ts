import {addInputListeners, addSettingsListeners} from "./smith/input_listeners";
import {initDocumentHistory} from "./change_handling/history.ts";
import {AbilityTree} from "./ability/tree/ability_tree.ts";
import {maxPlayerLevel} from "./to_sort/small_stuff.ts";
import {ItemParser} from "./item/item_parser.ts";

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

const parser = new ItemParser();

document.getElementById("item_inputs")?.prepend(parser.itemHolder());
document.getElementById("tome_inputs")?.prepend(parser.tomeHolder());
document.getElementById("sp_section")?.appendChild(parser.spHolder());

const tree = new AbilityTree("archer", maxPlayerLevel);
document.getElementById("ability_tree")?.appendChild(tree.holder());

const ledger = initDocumentHistory();
ledger.register(parser, tree);
