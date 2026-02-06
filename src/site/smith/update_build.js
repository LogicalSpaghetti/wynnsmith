import {resetWarnings} from "./warnings.js";
import {Build} from "../logic/build/build.js";
import Stats from "../logic/stats/stats.js";
import Attacks from "../logic/attack/attacks.js";
import {displayStats} from "../logic/stats/display_stats.js";
import {displayAttacks} from "../logic/attack/attack_display.js";

export default function updateBuild(build) {
    resetWarnings();

    if (!build) build = Build.fromHTML();

    const stats = Stats(build);
    const attacks = Attacks(stats, [/*TODO*/]);

    displayStats(stats);
    displayAttacks(attacks);
}
