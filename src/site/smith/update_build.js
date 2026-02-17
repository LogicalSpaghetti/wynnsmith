import {resetWarnings} from "./warnings.js";
import {Build} from "../build/build.js";
import Stats from "../stats/stats.js";
import Attacks from "../attack/attacks.js";
import {displayStats} from "../stats/display_stats.js";
import {displayAttacks} from "../attack/attack_display.js";

export default function updateBuild(build) {
    resetWarnings();

    if (!build) build = Build.fromHTML();

    const stats = Stats(build);
    const attacks = Attacks(stats, [/*TODO*/]);

    displayStats(stats);
    displayAttacks(attacks);
}
