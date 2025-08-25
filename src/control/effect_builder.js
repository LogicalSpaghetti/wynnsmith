// noinspection DuplicatedCode

class Editor {
    effect;
    element;

    constructor(tree, effect_editor_id = "effect_editor", name_input_class = "name_input", warn_input_class = "warn", parents_show_button_class = "parents_show", parent_toggles_class = "parent_toggles", blocks_show_button_class = "blocks_show", block_toggles_class = "block_toggles", editor_class = "editor", parent_req_class = "requires_all_parents", effect_type_class = "effect_type", effect_specific_class = "effect-specific") {
        this.tree = tree;
        this.element = document.getElementById(effect_editor_id);
        this.editor = this.element.querySelector("." + editor_class);
        this.name_input = this.element.querySelector("." + name_input_class);
        this.warn = this.element.querySelector("." + warn_input_class);
        this.toggle_name = this.element.querySelector(".toggle_name");

        this.name_input.value = "";
        this.name_input.addEventListener("input", () => {
            this.setEffectName(this.name_input.value);
        });

        this.toggle_name.value = "";
        this.toggle_name.addEventListener("input", () => {
            this.setToggleName(this.toggle_name.value);
        });

        this.parents_show = this.element.querySelector("." + parents_show_button_class);
        this.parent_toggles = this.element.querySelector("." + parent_toggles_class);
        this.blocks_show = this.element.querySelector("." + blocks_show_button_class);
        this.block_toggles = this.element.querySelector("." + block_toggles_class);

        this.parents_show.textContent = "⮜";
        this.parents_show.addEventListener("click", () => {
            const toggle = this.parents_show.dataset.show !== "true";
            this.parents_show.dataset.show = String(toggle);
            this.parents_show.textContent = toggle ? "⮟" : "⮜";
            this.parent_toggles.style.display = toggle ? "block" : "none";
        });

        this.blocks_show.textContent = "⮜";
        this.blocks_show.addEventListener("click", () => {
            const toggle = this.blocks_show.dataset.show !== "true";
            this.blocks_show.dataset.show = String(toggle);
            this.blocks_show.textContent = toggle ? "⮟" : "⮜";
            this.block_toggles.style.display = toggle ? "block" : "none";
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
        this.effect.data = new EffectType(effect_type);
        this.readEffectType();
    }

    readEffectType() {
        this.effect_specific_holder.innerHTML = "";
        this.effect_specific_holder.appendChild(this.effect.data.configHTML);
    }

    setEffect(effect) {
        this.warn.textContent = effect ? "" : "No effect selected!";
        this.effect = effect;
        this.editor.style.display = effect ? "block" : "none";
        if (!effect) return;
        this.name_input.value = effect.name;
        this.toggle_name.value = effect.toggle_name;
        this.parent_requirement.value = effect.require_all_parents;
        this.setupParentSelectors(effect);
        this.setupBlockSelectors(effect);
        this.effect_type.value = effect.data.type;
        this.readEffectType();
    }

    setupParentSelectors(effect) {
        const toggles = this.parent_toggles;
        toggles.textContent = "";
        for (let id in this.tree.nodes) {
            const ability = this.tree.nodes[id];

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.dataset.id = ability.id;
            checkbox.checked = effect.hasParent("nodes", ability.id);
            checkbox.addEventListener("change", () => {
                effect.toggleParent("nodes", ability.id);
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

    setupBlockSelectors(effect) {
        const toggles = this.block_toggles;
        toggles.textContent = "";

        for (let id in this.tree.effects) {
            const blockableEffect = this.tree.effects[id];
            if (blockableEffect === effect) continue;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.dataset.id = blockableEffect.id;
            checkbox.checked = effect.blocksEffectId(blockableEffect.id);
            checkbox.addEventListener("change", () => {
                effect.toggleBlock(blockableEffect.id);
            });
            toggles.appendChild(checkbox);
            toggles.appendChild(document.createTextNode(blockableEffect.name));
            toggles.appendChild(document.createElement("br"));
        }
    }

    setEffectName(name) {
        if (this.effect) this.effect.setName(name);
    }

    setToggleName(name) {
        if (this.effect) this.effect.setToggle(name);
    }
}

class Tree {
    nodes = {};
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
        this.generateNodes(punscake[this.wynnClass].abilities);
    }

    generateNodes(nodes) {
        this.nodes = {};
        this.ability_holder.innerHTML = "";
        for (let index in nodes) {
            const ability = new Ability(this, index, nodes[index]);
            this.addAbility(index, ability);
        }
    }

    addAbility(index, ability) {
        this.nodes[index] = (ability);
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
        return this.getHolderBySection(section)[id];
    }

    getHolderBySection(section) {
        switch (section) {
            case "nodes":
                return this.nodes;
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
            effect.data = new EffectType(effectData.type, effectData.data);
            effect.require_all_parents = effectData.requires_all;
            effect.setToggle(effectData.toggle_name);
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
        effect.addParent("nodes", this.id);
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
    children = [];
    blockIds = [];

    id;

    html;
    nameDisplay;
    data = new EffectType("");
    effectTypeDisplay;

    require_all_parents = true;

    name = "";
    toggle_name = "";

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
        return undefined !== this.parents.find(parent => parent.section === section && parent.id === id);
    }

    toggleBlock(id) {
        if (this.blockIds.includes(id))
            this.blockIds.splice(this.blockIds.indexOf(id), 1);
        else
            this.blockIds.push(id);
    }

    blocksEffectId(id) {
        return undefined !== this.blockIds.find(effectId => effectId === id);
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

    setToggle(name) {
        this.toggle_name = name ?? "";
    }

    // noinspection JSUnusedGlobalSymbols
    toJSON() {
        return {
            name: this.name,
            toggle_name: this.toggle_name,
            parents: this.parents,
            blocks: this.blockIds,
            requires_all: this.require_all_parents,
            type: this.data.type,
            data: this.data.data
        };
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
            case "variant":
                return this.setupVariantConfig();
            case "display":
                return this.setupDisplayConfig();
            case "mastery":
                return this.setupMasteryConfig();
            case "heal":
                return this.setupHealConfig();
            case "resistance":
                return this.setupResistanceConfig();
            case "team-multiplier":
                return this.setupTeamDamageMultiplierConfig();
            case "personal-multiplier":
                return this.setupPersonalDamageMultiplierConfig();
            case "cost":
                return this.setupSpellCostConfig();
            case "cost-multiplier":
                return this.setupSpellCostMultiplierConfig();
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

        setData(this);
        return holder;
    }

    setupConversionConfig() {
        const holder = document.createElement("div");

        holder.appendChild(document.createTextNode("Internal Name: "));
        const nameInput = holder.appendChild(document.createElement("input"));
        nameInput.value = this.data.internal_name ?? "";
        nameInput.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Conversion Type: "));
        const convType = holder.appendChild(document.createElement("select"));
        convType.innerHTML = "<option value=''>Inherited</option><option value='Spell'>Spell</option><option value='MainAttack'>Main Attack</option>";
        convType.value = this.data.type ?? "";
        convType.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Is Left Click: "));
        const isMelee = holder.appendChild(document.createElement("select"));
        isMelee.innerHTML = "<option value=''>Inherited/False</option><option value='true'>True</option>";
        isMelee.value = this.data.is_melee ?? "";
        isMelee.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Is Indirect Damage: "));
        const isIndirect = holder.appendChild(document.createElement("select"));
        isIndirect.innerHTML = "<option value=''>Inherited/False</option><option value='true'>True</option>";
        isIndirect.value = this.data.is_indirect ?? "";
        isIndirect.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Extra Hits: "));
        const extraHits = holder.appendChild(document.createElement("input"));
        extraHits.placeholder = "0";
        extraHits.value = this.data.extra_hits ?? "";
        extraHits.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Frequency: "));
        const frequency = holder.appendChild(document.createElement("input"));
        frequency.placeholder = "N/A";
        frequency.value = this.data.frequency ?? "";
        frequency.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Duration: "));
        const duration = holder.appendChild(document.createElement("input"));
        duration.placeholder = "N/A";
        duration.value = this.data.duration ?? "";
        duration.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        const conversionHolder = holder.appendChild(document.createElement("div"));
        conversionHolder.appendChild(document.createTextNode("Conversion: "));
        const conv = (this.data.conversion ?? [0, 0, 0, 0, 0, 0]);

        conversionHolder.appendChild(document.createElement("br"));

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

        const conversionInputs = [n, e, t, w, f, a];


        function setData(self) {
            const result = {};

            result.internal_name = nameInput.value;
            if (convType.value) result.type = convType.value;
            if (isMelee.value) result.is_melee = isMelee.value === "true";
            if (isIndirect.value) result.is_indirect = isIndirect.value === "true";
            if (extraHits.value) result.extra_hits = parseInt(extraHits.value);
            if (duration.value) result.duration = parseFloat(duration.value);
            if (frequency.value) result.frequency = parseFloat(frequency.value);
            if (conversionInputs.find(input => input.value !== "" && input.value !== "0"))
                result.conversion = conversionInputs.map(input => parseInt(input.value) || 0);

            self.data = result;
        }

        setData(this);
        return holder;
    }

    setupVariantConfig() {
        const holder = document.createElement("div");

        holder.appendChild(document.createTextNode("Internal Name: "));
        const variantName = holder.appendChild(document.createElement("input"));
        variantName.value = this.data.internal_name ?? "";
        variantName.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Variant Type: "));
        const variantSelect = holder.appendChild(document.createElement("select"));
        variantSelect.innerHTML =
            "<option value='hit'>Single</option>" +
            "<option value='multi'>Multi-hit Total</option>" +
            "<option value='dps'>DPS</option>" +
            "<option value='scaling-multi'>Scaling Multi-hit</option>" +
            "<option value='hit-modifier'>Per-hit Modifier</option>";
        variantSelect.value = this.data.variant ?? "hit";
        variantSelect.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Attack Name: "));
        const attack = holder.appendChild(document.createElement("input"));
        attack.placeholder = "internal name";
        attack.value = this.data.attack ?? "";
        attack.addEventListener("change", () => setData(this));

        const secondAttackContainer = holder.appendChild(document.createElement("div"));

        secondAttackContainer.appendChild(document.createTextNode("Second Attack: "));
        const secondAttack = secondAttackContainer.appendChild(document.createElement("input"));
        secondAttack.placeholder = "internal name";
        secondAttack.value = this.data.second_attack ?? "";
        secondAttack.addEventListener("change", () => setData(this));


        function setData(self) {
            self.data = {
                type: variantSelect.value,
                internal_name: variantName.value,
                attack: attack.value
            };

            if (variantSelect.value === "scaling-multi" || variantSelect.value === "scaling-multi") {
                self.data.second_attack = secondAttack.value;
                secondAttackContainer.style.display = "block";
            } else {
                secondAttackContainer.style.display = "none";
            }
        }

        setData(this);
        return holder;
    }

    setupDisplayConfig() {
        const holder = document.createElement("div");


        holder.appendChild(document.createTextNode("Display Name: "));
        const displayName = holder.appendChild(document.createElement("input"));
        displayName.placeholder = "Name";
        displayName.value = this.data.name ?? "";
        displayName.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Variant Names (csv): "));
        const variants = holder.appendChild(document.createElement("input"));
        variants.placeholder = "internal_name,internal_name2";
        variants.value = this.data.variants ?? "";
        variants.addEventListener("change", () => setData(this));


        function setData(self) {
            self.data = {
                name: displayName.value,
                variants: variants.value.split(",").map(word => word.trim())
            };
        }

        setData(this);
        return holder;
    }

    setupMasteryConfig() {
        const holder = document.createElement("div");

        holder.appendChild(document.createTextNode("Element: "));
        const elementSelect = holder.appendChild(document.createElement("select"));
        elementSelect.innerHTML =
            "<option value='Earth'>Earth</option>" +
            "<option value='Thunder'>Thunder</option>" +
            "<option value='Water'>Water</option>" +
            "<option value='Fire'>Fire</option>" +
            "<option value='Air'>Air</option>";
        elementSelect.value = this.data.element ?? "Earth";
        elementSelect.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Base Damage: "));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Min: "));
        const minInput = holder.appendChild(document.createElement("input"));
        if (this.data.base) minInput.value = this.data.base[0] ?? "0";
        minInput.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Max: "));
        const maxInput = holder.appendChild(document.createElement("input"));
        if (this.data.base) maxInput.value = this.data.base[1] ?? "0";
        maxInput.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Percent: "));
        const pctInput = holder.appendChild(document.createElement("input"));
        pctInput.value = this.data.pct ?? "0";
        pctInput.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));


        function setData(self) {
            self.data = {
                element: elementSelect.value,
                base: [
                    parseInt(minInput.value),
                    parseInt(maxInput.value)
                ],
                pct: parseInt(pctInput.value)
            };
        }

        setData(this);
        return holder;
    }

    setupHealConfig() {
        const holder = document.createElement("div");

        holder.appendChild(document.createTextNode("Internal Name: "));
        const internalName = holder.appendChild(document.createElement("input"));
        internalName.value = this.data.internal_name ?? "";
        holder.appendChild(document.createElement("br"));
        internalName.addEventListener("change", () => setData(this));

        holder.appendChild(document.createTextNode("Heal Percent: "));
        const healInput = holder.appendChild(document.createElement("input"));
        healInput.value = this.data.heal ?? "0";
        healInput.addEventListener("change", () => setData(this));


        function setData(self) {
            self.data = {
                internal_name: internalName.value,
                heal: parseInt(healInput.value)
            };
        }

        setData(this);
        return holder;
    }

    setupResistanceConfig() {
        const holder = document.createElement("div");

        holder.appendChild(document.createTextNode("Internal Name: "));
        const nameInput = holder.appendChild(document.createElement("input"));
        nameInput.value = this.data.internal_name ?? "";
        nameInput.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Resistance Modifier: "));
        const numberInput = holder.appendChild(document.createElement("input"));
        numberInput.value = this.data.multiplier ?? "0";
        numberInput.addEventListener("change", () => setData(this));


        function setData(self) {
            self.data = {
                internal_name: nameInput.value,
                multiplier: parseFloat(numberInput.value)
            };
        }

        setData(this);
        return holder;
    }

    setupPersonalDamageMultiplierConfig() {
        const holder = document.createElement("div");

        holder.appendChild(document.createTextNode("Internal Name: "));
        const nameInput = holder.appendChild(document.createElement("input"));
        nameInput.value = this.data.internal_name ?? "";
        nameInput.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Multiplier: "));
        const numberInput = holder.appendChild(document.createElement("input"));
        numberInput.value = this.data.multiplier ?? "1";
        numberInput.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Target Ability: "));
        const targetInput = holder.appendChild(document.createElement("input"));
        targetInput.placeholder = "\"all\" for global multiplier";
        targetInput.value = this.data.target ?? "";
        targetInput.addEventListener("change", () => setData(this));


        function setData(self) {
            self.data = {
                internal_name: nameInput.value,
                multiplier: parseFloat(numberInput.value)
            };
            if (targetInput.value) self.data.target = targetInput.value;
        }

        setData(this);
        return holder;
    }

    setupTeamDamageMultiplierConfig() {
        const holder = document.createElement("div");

        holder.appendChild(document.createTextNode("Internal Name: "));
        const nameInput = holder.appendChild(document.createElement("input"));
        nameInput.value = this.data.internal_name ?? "";
        nameInput.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Multiplier: "));
        const numberInput = holder.appendChild(document.createElement("input"));
        numberInput.value = this.data.multiplier ?? "1";
        numberInput.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Type: "));
        const typeSelect = holder.appendChild(document.createElement("select"));
        typeSelect.innerHTML =
            "<option value=''>-select-</option>" +
            "<option value='damage-boost'>Damage Boost</option>" +
            "<option value='vulnerability'>Vulnerability</option>";
        typeSelect.value = this.data.type ?? "damage-boost";
        typeSelect.addEventListener("change", () => setData(this));


        function setData(self) {
            self.data = {
                internal_name: nameInput.value,
                multiplier: parseFloat(numberInput.value)
            };
            if (typeSelect.value) self.data.type = typeSelect.value;
        }

        setData(this);
        return holder;
    }

    setupSpellCostConfig() {
        const holder = document.createElement("div");

        holder.appendChild(document.createTextNode("Spell: "));
        const typeSelect = holder.appendChild(document.createElement("select"));
        typeSelect.innerHTML =
            "<option value='0'>1st Spell, (R-L-R)/(L-R-L)</option>" +
            "<option value='1'>2nd Spell, (R-R-R)/(L-L-L)</option>" +
            "<option value='2'>3rd Spell, (R-L-L)/(L-R-R)</option>" +
            "<option value='3'>4th Spell, (R-R-L)/(L-L-R)</option>";
        typeSelect.value = this.data.spell_number ?? "0";
        typeSelect.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Spell Cost: "));
        const costInput = holder.appendChild(document.createElement("input"));
        costInput.value = this.data.cost ?? "0";
        costInput.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Is Base Spell: "));
        const isBase = holder.appendChild(document.createElement("select"));
        isBase.innerHTML = "<option value=''>False</option><option value='true'>True</option>";
        isBase.value = this.data.is_melee ?? "";
        isBase.addEventListener("change", () => setData(this));


        function setData(self) {
            self.data = {
                spell_number: parseInt(typeSelect.value),
                cost: parseInt(costInput.value),
                is_base_spell: isBase.value === "true"
            };
        }

        setData(this);
        return holder;
    }

    setupSpellCostMultiplierConfig() {
        const holder = document.createElement("div");

        holder.appendChild(document.createTextNode("Spell: "));
        const typeSelect = holder.appendChild(document.createElement("select"));
        typeSelect.innerHTML =
            "<option value='0'>1st Spell, (R-L-R)/(L-R-L)</option>" +
            "<option value='1'>2nd Spell, (R-R-R)/(L-L-L)</option>" +
            "<option value='2'>3rd Spell, (R-L-L)/(L-R-R)</option>" +
            "<option value='3'>4th Spell, (R-R-L)/(L-L-R)</option>";
        typeSelect.value = this.data.spell_number ?? "0";
        typeSelect.addEventListener("change", () => setData(this));

        holder.appendChild(document.createElement("br"));

        holder.appendChild(document.createTextNode("Spell Cost Multiplier: "));
        const costInput = holder.appendChild(document.createElement("input"));
        costInput.value = this.data.cost_multiplier ?? "0";
        costInput.addEventListener("change", () => setData(this));


        function setData(self) {
            self.data = {
                spell_number: parseInt(typeSelect.value),
                cost_multiplier: parseFloat(costInput.value)
            };
        }

        setData(this);
        return holder;
    }
}