import damageTicks from "../attack/attacks";

export default class Stats {
    other; // other.ehp
    base; // base.rawHealth
    identifications; // identifications.health
    effects; // effects.effectType[i]
    damageTicks;

    constructor(build) {
        // TODO
        this.damageTicks = damageTicks(this);
    }
}
