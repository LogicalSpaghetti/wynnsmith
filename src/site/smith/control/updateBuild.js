import {resetWarnings} from "./warnings.js";
import {Build} from "../model/build/build.js";
import Stats from "../model/stats/stats";
import Attacks from "../model/attack/attacks";
import {displayStats} from "../model/stats/display_stats";

export function updateBuild(build) {
    resetWarnings();

    if (!build) build = Build.fromHTML();
    const buildData = permuteBuild(build);
    displayBuildData(buildData);
}

function permuteBuild(build) {
    const stats = Stats(build);
    const attacks = Attacks(stats, [/*TODO*/]);
    return {stats, attacks};
}

function displayBuildData(buildData) {
    displayStats(buildData.stats);
    // TODO
    //  display attacks
}
