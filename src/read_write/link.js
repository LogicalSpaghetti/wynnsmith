
// has all the data of a link
import {base64ToDecimal, decimalToBinary} from "../util/numbers.js";

class Link {
    version;


    constructor(linkString) {
        // TODO
    }

    toString() {
        // TODO
    }
}

class BuildLink {
    constructor(linkString, isBinary = true) {
        if (!isBinary) linkString = decimalToBinary(base64ToDecimal(linkString));
        // TODO
    }
}