`use strict`;

class Build {
    wynnClass = "";
    previousClass = "";
    attackSpeed;
    maIds = [];
    nodes = [];
    effects = [];
    aspects = [];
    aspectTiers = [];
    toggles = [];
    sliders = {};
    powders = {
        armour: [],
        weapon: [],
    };
    specials = {
        weapon: "",
        armour: []
    }
    final = {};
    conversions = {};
    attacks = [];
    masteries = [];
    heals = [];
    resistances = [];
    personal_multipliers = [];
    team_multipliers = [];
    spell_costs = [0, 0, 0, 0];
    spell_cost_modifiers = [0, 0, 0, 0];
    spell_cost_multipliers = [];
    old_attacks = {};
    old_heals = {};
    sp = {
        mults: [],
    };
    spells = {
        "1st": { name: "", mod: 0 },
        "2nd": { name: "", mod: 0 },
        "3rd": { name: "", mod: 0 },
        "4th": { name: "", mod: 0 },
    };
    base = JSON.parse(emptyBaseString);
    ids = JSON.parse(emptyIdsString);
    mults = {
        vuln: 1,
        dmg: 1,
    };

    has(section, name) {
        const sect = this[section];
        return sect.constructor === Array ? sect.includes(name) : sect[name] !== undefined;
    }
}
