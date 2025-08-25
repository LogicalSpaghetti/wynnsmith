`use strict`;

class Build {
    wynnClass = "";
    previousClass = "";
    attackSpeed;
    maIds = [];
    nodes = [];
    effects = [];
    aspects = [];
    powders = {
        armour: [],
        weapon: [],
    };
    specials = {
        weapon: "",
        armour: []
    }
    attacks = [];
    masteries = [];
    heals = [];
    resistances = [];
    personal_multipliers = [];
    team_multipliers = [];
    spell_costs = [0, 0, 0, 0];
    spell_cost_modifiers = [0, 0, 0, 0];
    spell_cost_multipliers = [];
    statArrays= {};
    stats = {};
    sp_multipliers = [];
    toggles = [];
    variants = [];
    displays = [];

    base = JSON.parse(emptyBaseString);
    ids = JSON.parse(emptyIdsString);
}
