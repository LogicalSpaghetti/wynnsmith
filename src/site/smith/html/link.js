// has all the data of a link
import {base64ToBinary, base64ToDecimal, decimalToBinary} from "../../../common/numbers.js";

// TODO: should be part of the database
const latestVersion = 0;
const versionLength = 12;

// all the data of a link.
class BuildLink {
    version;
    level;
    items;
    modifiedSP;


    constructor(binary) {
        // TODO: parse the binary into its parts.
    }

    static fromURL() {
        const urlParams = new URL(window.location.toLocaleString()).searchParams;
        const b = urlParams.get('b');
        if (!b) return;
        return new BuildLink(base64ToBinary(b));
    }

    static fromHTML() {
        // TODO
    }

    toHTML() {
        // TODO
    }
}