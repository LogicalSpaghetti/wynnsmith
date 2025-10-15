
import {Items} from "../model/item/item.js";


class Inputs {

    constructor(items, tree, level, modifiedSP, comparison) {
    }

    static read() {
        const items = Items.fromHTML();

        const comparison = Comparison.fromHTML();

        // Read the tree (+aspects)
                // Clear tree and clear errors toggle flags on the tree object
        // Read the items
        // Read the level
        // Read the modified SP
        // Read the comparison data (+second build)
        // Read the modified identifications
        // Read the toggles

        return new Inputs(null, null, null, null, comparison);
    }
}

// TODO: make the comparison menu a form with confirm and cancel.
class Comparison {
    target;
    offhand;
    link;
    shared;

    constructor(target, offhand, link, shared) {
        this.target = target;
        this.offhand = offhand;
        this.link = link;
        this.shared = shared;
    }

    static fromHTML() {
        // target
        const offhand = document.querySelector("#offhand_select").value;
        const link = document.querySelector("#second_build_link").value;

        // TODO

        return new Comparison(null /* TODO */, offhand, link, null /* TODO */);
    }
}
