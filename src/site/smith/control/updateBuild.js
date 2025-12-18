import {resetWarnings} from "./warnings.js";
import {Build} from "../model/build/build.js";
import Stats from "../model/stats/stats";
import Attacks from "../model/attack/attacks";
import {displayStats} from "../model/stats/display_stats";
import {displayAttacks} from "../model/attack/attack_display";

export function updateBuild(build) {
    resetWarnings();

    if (!build) build = Build.fromHTML();

    const stats = Stats(build);
    const attacks = Attacks(stats, [/*TODO*/]);

    displayStats(stats);
    displayAttacks(attacks);
}
