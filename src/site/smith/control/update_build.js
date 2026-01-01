import {resetWarnings} from "./warnings.js";
import {Build} from "../model/build/build.js";
import Stats from "../model/stats/stats.js";
import Attacks from "../model/attack/attacks.js";
import {displayStats} from "../model/stats/display_stats.js";
import {displayAttacks} from "../model/attack/attack_display.js";

export default function updateBuild(build) {
    resetWarnings();

    if (!build) build = Build.fromHTML();

    const stats = Stats(build);
    const attacks = Attacks(stats, [/*TODO*/]);

    displayStats(stats);
    displayAttacks(attacks);
}
