`use strict`;

class OldBuild {
    wynnClass = "";
    previousClass = "";

    equipment = [];
    weapons = [];

    maIds = [];
    nodes = [];
    effects = [];
    aspects = [];
    powders = {
        armour: [],
        weapon: []
    };
    specials = {
        weapon: "",
        armour: []
    };
    attacks = [];
    masteries = [];
    heals = [];
    resistances = [];
    personal_multipliers = [];
    team_multipliers = [];
    spell_costs = [0, 0, 0, 0];
    spell_cost_modifiers = [0, 0, 0, 0];
    spell_cost_multipliers = [];
    statArrays = {};
    stats = {};
    sp_totals = [0, 0, 0, 0, 0];
    sp_multipliers = [0, 0, 0, 0, 0];
    toggles = [];
    variants = [];
    displays = [];

    base = JSON.parse(emptyBaseString);
    identifications = JSON.parse(emptyIdsString);
}
