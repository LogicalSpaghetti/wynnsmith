class Build {
    constructor() {
        this.wynnClass = "";
        this.attackSpeed = undefined;
        this.mIds = [];
        this.nodes = [];
        this.aspects = {};
        this.tomes = [];
        this.adds = {};
        this.toggles = [];
        this.sliders = {};
        this.powders = {
            armour: [],
            weapon: [],
        };
        this.final = {};
        this.convs = {};
        this.attacks = {};
        this.heals = {};
        this.sp = {
            mults: [],
        };
        this.base = JSON.parse(emptyBaseString);
        this.ids = JSON.parse(emptyIdsString);
        this.mults = {};
    }

    evaluate(str) {
        const build = this;
        return eval(str)
    }

    
    sectionContains(section, name) {
        const sect = this[section];
        if (sect.constructor === Array) {
            return sect.includes(name);
        } else {
            return sect[name] === undefined;
        }
    }
}
