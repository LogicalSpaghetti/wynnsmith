class Editor {
    effect;
    element;

    constructor(tree, effect_editor_id = "effect_editor", name_input_class = "name_input", warn_input_class = "warn", parents_show_button_class = "parents_show", parents_toggles_class = "parent_toggles", editor_class = "editor", parent_req_class = "requires_all_parents", effect_type_class = "effect_type", effect_specific_class = "effect-specific") {
        this.tree = tree;
        this.element = document.getElementById(effect_editor_id);
        this.editor = this.element.querySelector("." + editor_class);
        this.name_input = this.element.querySelector("." + name_input_class);
        this.warn = this.element.querySelector("." + warn_input_class);

        this.name_input.value = "";
        this.name_input.addEventListener("input", () => {
            this.setEffectName(this.name_input.value);
        });

        this.parents_show = this.element.querySelector("." + parents_show_button_class);
        this.parent_toggles = this.element.querySelector("." + parents_toggles_class);

        this.parents_show.textContent = "⮜";
        this.parents_show.addEventListener("click", () => {
            const toggle = this.parents_show.dataset.show !== "true";
            this.parents_show.dataset.show = String(toggle);
            this.parents_show.textContent = toggle ? "⮟" : "⮜";
            this.parent_toggles.style.display = toggle ? "block" : "none";
        });

        this.parent_requirement = this.element.querySelector("." + parent_req_class);
        this.parent_requirement.addEventListener("click", () => {
            this.effect.require_all_parents = this.parent_requirement.value === "true";
        });

        this.effect_type = this.element.querySelector("." + effect_type_class);
        this.effect_type.addEventListener("change", () => {
            this.changeEffectType(this.effect_type.value);
        });

        this.effect_specific_holder = this.element.querySelector("." + effect_specific_class);

        this.setEffect(undefined);
    }

    changeEffectType(effect_type) {
        this.effect.effect = new EffectType(effect_type);
        this.readEffectType();
    }

    readEffectType() {
        this.effect_specific_holder.innerHTML = "";
        this.effect_specific_holder.appendChild(this.effect.effect.configHTML);
    }

    setEffect(effect) {
        this.warn.textContent = effect ? "" : "No effect selected!";
        this.effect = effect;
        this.editor.style.display = effect ? "block" : "none";
        if (!effect) return;
        this.name_input.value = effect.name;
        this.parent_requirement.value = effect.require_all_parents;
        this.setupParentSelectors(effect);
        this.effect_type.value = effect.effect.type;
        this.readEffectType();
    }

    setupParentSelectors(effect) {
        const toggles = this.parent_toggles;
        toggles.textContent = "";
        for (let id in this.tree.abilities) {
            const ability = this.tree.abilities[id];

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.dataset.id = ability.id;
            checkbox.checked = effect.hasParent("abilities", ability.id);
            checkbox.addEventListener("change", () => {
                effect.toggleParent("abilities", ability.id);
            });
            toggles.appendChild(checkbox);

            const label = document.createElement("label");
            label.textContent = ability.abilityData._plainname;
            toggles.appendChild(label);
            toggles.appendChild(document.createElement("br"));
        }

        for (let id in this.tree.effects) {
            const parentEffect = this.tree.effects[id];
            if (parentEffect === effect) continue;
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.dataset.id = parentEffect.id;
            checkbox.checked = effect.hasParent("effects", parentEffect.id);
            checkbox.addEventListener("change", () => {
                effect.toggleParent("effects", parentEffect.id);
            });
            toggles.appendChild(checkbox);
            const label = document.createElement("label");
            label.textContent = parentEffect.name;
            toggles.appendChild(label);
            toggles.appendChild(document.createElement("br"));
        }
    }

    setEffectName(name) {
        if (this.effect) this.effect.setName(name);
    }
}

class Tree {
    abilities = {};
    effects = {};

    constructor(wynn_class, editor, ability_holder_id = "ability_holder", effect_holder_id = "effect_holder") {
        this.wynnClass = wynn_class;

        this.ability_holder = document.getElementById(ability_holder_id);
        this.updateAbilities();

        this.effect_holder = document.getElementById(effect_holder_id);
        this.effect_holder.innerHTML = "";

        this.editor = editor;
        editor.tree = this;

    }

    updateAbilities() {
        this.generateAbilities(punscake[this.wynnClass].abilities);
    }

    generateAbilities(abilities) {
        this.abilities = {};
        this.ability_holder.innerHTML = "";
        for (let index in abilities) {
            const ability = new Ability(this, index, abilities[index]);
            this.addAbility(index, ability);
        }
    }

    addAbility(index, ability) {
        this.abilities[index] = (ability);
        this.ability_holder.appendChild(ability.html);
    }

    addEffect(id = -1) {

        if (id === -1) {
            for (let i in this.effects) {
                id = Math.max(id, parseInt(i));
            }
            id++;
        }

        const effect = new EffectBuilder(tree, id);

        this.effects[id] = effect;
        this.effect_holder.appendChild(effect.html);

        this.editEffect(-1);

        return effect;
    }

    removeEffect(id) {
        const effect = this.effects[id];
        effect.deleteEffect();
        delete this.effects[id];
        if (this.editedEffectId === id) this.editEffect(-1);
    }

    getChild(section, id) {
        console.log(section, id);
        return this.getHolderBySection(section)[id];
    }

    getHolderBySection(section) {
        console.log(section);
        switch (section) {
            case "abilities":
                return this.abilities;
            case "effects":
                return this.effects;
            default:
                return null;
        }
    }

    editEffect(id) {
        this.editedEffectId = id;
        const effect = this.effects[id];
        this.editor.setEffect(effect);
    }

    changeTree(input) {
        this.wynnClass = input.wynnClass;
        this.updateAbilities();

        this.effect_holder.innerHTML = "";

        for (let id in input.effects) {
            this.addEffect(id); // done first to ensure all effects exist before adding parents
        }

        for (let id in input.effects) {
            const effectData = input.effects[id];
            const effect = this.getChild("effects", id);
            effect.setName(effectData.name);
            const parents = effectData.parents;
            for (let i in parents) {
                const parent = parents[i];
                effect.addParent(parent.section, parent.id);
            }
            effect.effect = new EffectType(effectData.effect.type, effectData.effect.data);
            effect.require_all_parents = effectData.requires_all;
        }
        this.editEffect(-1);
    }

    // noinspection JSUnusedGlobalSymbols
    toJSON() {
        return {wynnClass: this.wynnClass, effects: this.effects};
    }
}

class Ability {
    tree;
    id;
    abilityData;
    html;
    children = [];
    effectsHolder;

    constructor(tree, id, abilityData) {
        this.tree = tree;
        this.id = id;
        this.abilityData = abilityData;
        this.createHTML();
    }

    createHTML() {
        this.html = document.createElement("div");
        this.html.classList.add("minecraftTooltip");

        const top = this.html.appendChild(document.createElement("div"));
        top.style.display = "flex";

        const nameplate = top.appendChild(document.createElement("div"));
        nameplate.classList.add("nameplate");
        nameplate.innerHTML = minecraftToHTML(this.abilityData.name);
        nameplate.style.flex = "1 1 auto";

        nameplate.addEventListener("mouseover", () => {
            renderHoverTooltip(getHoverTextForAbility(this.id, this.tree.wynnClass));
        });
        nameplate.addEventListener("mouseout", () => {
            hideHoverAbilityTooltip();
        });

        const add = top.appendChild(document.createElement("button"));
        add.textContent = "+";
        add.addEventListener("click", () => {
            this.addEffect(this.tree.addEffect());
        });

        this.effectsHolder = this.html.appendChild(document.createElement("div"));
        this.effectsHolder.style.paddingLeft = "2ch";
    }

    addEffect(effect) {
        effect.addParent("abilities", this.id);
    }

    addChild(child) {
        this.children.push(child);
        this.effectsHolder.appendChild(child.childName);
        child.parentName.innerHTML = minecraftToHTML(this.abilityData.name);
    }

    removeChild(id) {
        this.children = this.children.filter(effect => effect.id !== id);
    }

    // noinspection JSUnusedGlobalSymbols
    toJSON() {
        return this.children.map(child => child.id);
    }
}

class EffectBuilder {
    tree;

    parents = [];
    children = []; // {id: Integer, html: Element}

    id;

    html;
    nameDisplay;
    effect = new EffectType("");
    effectTypeDisplay;

    require_all_parents = true;

    name = "";

    constructor(tree, id) {
        this.tree = tree;
        this.id = id;

        this.createHTML();
        this.setName("");
    }

    createHTML() {
        this.html = document.createElement("div");
        this.html.classList.add("minecraftTooltip");

        this.top = this.html.appendChild(document.createElement("div"));
        this.top.style.display = "flex";


        this.nameDisplay = this.top.appendChild(document.createElement("div"));
        this.nameDisplay.style.flex = "1 1 auto";


        this.effectTypeDisplay = this.html.appendChild(document.createElement("span"));

        const edit = this.top.appendChild(document.createElement("button"));
        edit.textContent = "✒";
        edit.addEventListener("click", () => {
            this.tree.editEffect(this.id);
        });

        const remove = this.top.appendChild(document.createElement("button"));
        remove.textContent = "x";
        remove.addEventListener("click", () => {
            this.tree.removeEffect(this.id);
        });

        this.parentsLabel = this.html.appendChild(document.createElement("span"));
        this.parentsLabel.textContent = "No Parents!";

        this.parentNames = this.html.appendChild(document.createElement("div"));
        this.parentNames.style.paddingLeft = "2ch";


        this.childrenLabel = this.html.appendChild(document.createElement("span"));
        this.childrenLabel.textContent = "Children: ";
        this.childrenLabel.style.display = "none";

        this.effectsHolder = this.html.appendChild(document.createElement("div"));
        this.effectsHolder.style.paddingLeft = "2ch";
    }

    addParent(section, id) {
        const childName = document.createElement("div");
        const parentName = this.parentNames.appendChild(document.createElement("div"));

        const child = new ChildData(this.id, childName, parentName);
        this.parents.push(new ParentData(section, id, childName, parentName));

        this.tree.getChild(section, id).addChild(child);
        this.setName(this.name);

        this.fixLabels();
    }

    removeParent(section, id) {
        const parent = this.parents.find(parent => (parent.section === section) && (parent.id === id));
        if (!parent) return;

        parent.childName.remove();
        parent.parentName.remove();

        this.tree.getChild(parent.section, parent.id).removeChild(this.id);

        this.parents.splice(this.parents.indexOf(parent), 1);

        this.fixLabels();
    }

    toggleParent(section, id) {
        if (this.hasParent(section, id)) {
            this.removeParent(section, id);
        } else {
            this.addParent(section, id);
        }
    }

    hasParent(section, id) {
        for (let i in this.parents) {
            const parent = this.parents[i];
            if (parent.section === section && parent.id === id) return true;
        }
        return false;
    }

    deleteEffect() {
        this.html.remove();
        for (let i in this.parents) {
            const parent = this.parents[i];
            this.removeParent(parent.section, parent.id);
        }
    }

    addChild(child) {
        this.children.push(child);
        this.effectsHolder.appendChild(child.childName);
        child.parentName.textContent = this.name;
        this.fixLabels();
    }

    removeChild(id) {
        this.children = this.children.filter(effect => effect.id !== id);
        this.fixLabels();
    }

    fixLabels() {
        this.parentsLabel.textContent = this.parents.length === 0 ? "No Parents!" : "Parents:";
        this.childrenLabel.style.display = this.children.length === 0 ? "none" : "block";
    }

    setName(name) {
        this.name = name;
        const displayName = this.name || "Unnamed Effect";
        this.nameDisplay.textContent = displayName;
        for (let parent of this.parents) {
            parent.childName.textContent = displayName;
        }
        for (let child of this.children) {
            child.parentName.textContent = displayName;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    toJSON() {
        return {name: this.name, parents: this.parents, requires_all: this.require_all_parents, effect: this.effect};
    }
}

class ParentData {
    section;
    id;
    childName;
    parentName;

    constructor(section, id, childName, parentName) {
        this.section = section;
        this.id = id;
        this.childName = childName;
        this.parentName = parentName;
    }

    // noinspection JSUnusedGlobalSymbols
    toJSON() {
        return {section: this.section, id: this.id};
    }
}

class ChildData {
    id;
    childName;
    parentName;

    constructor(id, childName, parentName) {
        this.id = id;
        this.childName = childName;
        this.parentName = parentName;
    }
}

class EffectType {
    type;
    configHTML;
    data = {};

    constructor(type, data = {}) {
        this.type = type;
        this.data = data;
        this.configHTML = this.setupConfig(type);
    }

    setupConfig() {
        switch (this.type) {
            case "script":
                return this.setupScriptConfig();
            case "conv":
                return this.setupConversionConfig();
            default:
                return this.emptyConfig();
        }
    }

    emptyConfig() {
        return document.createTextNode("No configuration options for this effect type.");
    }

    setupScriptConfig() {
        const holder = document.createElement("div");

        holder.appendChild(document.createTextNode("Run Step:"));
        const locationInput = holder.appendChild(document.createElement("input"));

        holder.appendChild(document.createTextNode("Script:"));
        const scriptInput = holder.appendChild(document.createElement("input"));

        locationInput.value = this.data.location ?? "";
        scriptInput.value = this.data.script ?? "";


        locationInput.addEventListener("change", () => setData(this));
        scriptInput.addEventListener("change", () => setData(this));


        function setData(self) {
            self.data = {location: locationInput.value, script: scriptInput.value};
        }

        return holder;
    }

    setupConversionConfig() {
        const holder = document.createElement("div");

        holder.appendChild(document.createTextNode("Conversion Type: "));
        const convType = holder.appendChild(document.createElement("select"));
        convType.innerHTML = "<option value='spell'>Spell</option><option value='melee'>Melee</option>";
        holder.appendChild(document.createElement("br"));
        holder.appendChild(document.createElement("br"));
        convType.value = this.data.type ?? "spell";
        convType.addEventListener("change", () => setData(this));

        const conversionHolder = holder.appendChild(document.createElement("div"));
        conversionHolder.appendChild(document.createTextNode("Conversion: "));
        conversionHolder.appendChild(document.createElement("br"));

        const conv = (this.data.conversion ?? [0, 0, 0, 0, 0, 0]);

        conversionHolder.appendChild(minecraftAsHTML(codeDictionaryGenericSymbols["neutral"]));
        const n = conversionHolder.appendChild(document.createElement("input"));
        n.value = String(conv[0]);
        n.style.width = "5ch";
        n.addEventListener("change", () => setData(this));

        conversionHolder.appendChild(minecraftAsHTML(codeDictionaryGenericSymbols["earth"]));
        const e = conversionHolder.appendChild(document.createElement("input"));
        e.value = String(conv[1]);
        e.style.width = "5ch";
        e.addEventListener("change", () => setData(this));

        conversionHolder.appendChild(minecraftAsHTML(codeDictionaryGenericSymbols["thunder"]));
        const t = conversionHolder.appendChild(document.createElement("input"));
        t.value = String(conv[2]);
        t.style.width = "5ch";
        t.addEventListener("change", () => setData(this));

        conversionHolder.appendChild(document.createElement("br"));

        conversionHolder.appendChild(minecraftAsHTML(codeDictionaryGenericSymbols["water"]));
        const w = conversionHolder.appendChild(document.createElement("input"));
        w.value = String(conv[3]);
        w.style.width = "5ch";
        w.addEventListener("change", () => setData(this));

        conversionHolder.appendChild(minecraftAsHTML(codeDictionaryGenericSymbols["fire"]));
        const f = conversionHolder.appendChild(document.createElement("input"));
        f.value = String(conv[4]);
        f.style.width = "5ch";
        f.addEventListener("change", () => setData(this));

        conversionHolder.appendChild(minecraftAsHTML(codeDictionaryGenericSymbols["air"]));
        const a = conversionHolder.appendChild(document.createElement("input"));
        a.value = String(conv[5]);
        a.style.width = "5ch";
        a.addEventListener("change", () => setData(this));

        // holder.appendChild(document.createTextNode("Hit count: "));
        // const hits = holder.appendChild(document.createElement("input"));
        // hits.type = "number";
        // hits.value = this.data.hitCount || "1";
        // hits.addEventListener("change", () => setData(this));

        function setData(self) {
            self.data = {
                type: convType.value,
                conversion: [n.value || 0, e.value || 0, t.value || 0, w.value || 0, f.value || 0, a.value || 0],
                // hitCount: (hits.value || 1),
            };
        }

        return holder;
    }

    // noinspection JSUnusedGlobalSymbols
    toJSON() {
        return {type: this.type, data: this.data};
    }
}