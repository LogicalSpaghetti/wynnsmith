import {resetWarnings} from "../read_write/warnings.js";
import {getInputByElementClass} from "../read_write/build.js";
import {getBuildsFromInput} from "../permute/permute.js";
import {displayBuilds} from "../read_write/write.js";

export function refreshBuild() {
    resetWarnings();
    const input = getInputByElementClass("primary-input");

    const builds = getBuildsFromInput(input);

    displayBuilds(input, builds);
}
