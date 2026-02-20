import punscake from "../../js_data/trees.js";
import {maxPlayerLevel} from "../misc/small_stuff.ts";
import {minecraftToHTML} from "../hover_html/minecraft_html.ts";
import aspect_descriptions from "../../js_data/aspects.js";
import {decimalToRoman} from "../misc/numbers.ts";
import * as codeDictionary from "../../js_data/code_dictionary.ts";
import {addWarning} from "../smith/warnings.js";
import {hideHoverTooltip, renderHoverTooltip} from "../misc/tooltip.js";
import classEffects from "../../js_data/effects.js";
import updateBuild from "../smith/update_build.js";
import {getHoverTextForAbility} from "../hover_html/ability_description.ts";

const treeColumns = 9;
const abilityPointsAtLevel = [
    0,
    1, 2, 2, 3, 3, 4, 4, 5, 5, 6,
    6, 7, 8, 8, 9, 9, 10, 11, 11, 12,
    12, 13, 14, 15, 15, 16, 16, 17, 17, 18,
    18, 19, 19, 20, 20, 20, 21, 21, 22, 22,
    23, 23, 23, 24, 24, 25, 25, 26, 26, 27,
    27, 28, 28, 29, 29, 30, 30, 31, 31, 32,
    32, 33, 33, 34, 34, 34, 35, 35, 35, 36,
    36, 36, 37, 37, 37, 38, 38, 38, 38, 39,
    39, 39, 39, 40, 40, 40, 40, 41, 41, 41,
    41, 42, 42, 42, 42, 43, 43, 43, 43, 44,
    44, 44, 44, 45, 45
];

export function treeClicked(e) {
    const target = e.target;
    if (target.dataset.type !== "ability") return;
    toggleNode(target);
    updateBuild();
}

//region [Abilities]

export class Abilities {
    nodes;
    aspects;
    toggles;

    constructor(nodes = [], aspects = [], toggles = []) {
        this.nodes = nodes;
        this.aspects = aspects;
        this.toggles = toggles;
    }

    static fromHTML(wynnClass) {
        const previousClass = document.getElementById("ability_tree").dataset.class;
        if (previousClass !== wynnClass) return new Abilities();
        return new Abilities(Abilities.#readNodes(), Abilities.#readAspects(), getActiveToggles());
    }

    static #readNodes = () => Array.from(document.querySelectorAll(".tree_cell[data-type='node']"))
        .filter(node => node.dataset.selected === "true")
        .map((node) => node.dataset.ability_id);

    static #readAspects() {
        const aspectInputs = document.getElementById("active_aspects").querySelectorAll(".aspect");
        return Array.from(aspectInputs).map(input => Aspect.fromInput(input));
    }
}

//endregion

// region [Tree]

export class Tree {
    static id = "abilityTree";

    wynnClass;
    data;
    selectedNodes;

    constructor(wynnClass, selectedNodes = []) {
        this.wynnClass = wynnClass;
        this.selectedNodes = selectedNodes;
        this.data = Tree.getDataFromClass(wynnClass);
    }

    static fromHTML(id = Tree.id) {

        const treeElement = document.querySelector(`#${id}}`);

        const wynnClass = treeElement.dataset.class;


        const nodes = [];
        for (const node of treeElement.querySelectorAll("[data-type='node']"))
            nodes.push(new Node(node.dataset.map_id, node.dataset.selected === "true"));

        const tree = new Tree(wynnClass, nodes);
    }

    static getDataFromClass(wynnClass) {
        return punscake[wynnClass];
    }

    static markClear() {

    }
}

class Node {
    map_id;
    selected;

    constructor(map_id, selected) {
        this.map_id = map_id;
        this.selected = selected;
    }
}

// endregion

function changeAbilityTree(wynnClass) {
    const abilityTree = document.getElementById("ability_tree");
    abilityTree.innerHTML = "";

    abilityTree.dataset.class = wynnClass || abilityTree.dataset.class;

    const tree = punscake[wynnClass];

    abilityTree.hidden = !tree;

    if (!tree) return;

    mapHTML(tree, abilityTree, wynnClass);

    for (const img of document.querySelectorAll(".node_img"))
        img.ondragstart = () => false;
}

function changeAspects(wynnClass) {
    const aspects = aspect_descriptions[wynnClass];

    const activeHolder = document.getElementById("active_aspects");
    const inactiveHolder = document.getElementById("inactive_aspects");

    activeHolder.innerHTML = "";
    inactiveHolder.innerHTML = "";

    for (const aspect of aspects) {
        const name = aspect.name;
        const rarity = aspect.rarity;

        const aspectDiv = document.createElement("div");
        aspectDiv.classList.add("aspect");
        aspectDiv.classList.add(rarity);
        aspectDiv.dataset.aspect = name;
        aspectDiv.title = name;

        const aspectImage = document.createElement("span");
        aspectImage.classList.add("aspect_image");
        aspectImage.style["background-image"] = "url(img/aspect/" + wynnClass + ".png)";

        const tierOverlay = document.createElement("span");
        tierOverlay.classList.add("aspect_tier");
        tierOverlay.classList.add("Tier_" + (rarity === "legendary" ? decimalToRoman(4) : decimalToRoman(3)));
        tierOverlay.textContent = rarity === "legendary" ? decimalToRoman(4) : decimalToRoman(3);
        tierOverlay.dataset.tier = String(rarity === "legendary" ? 4 : 3);
        tierOverlay.style.display = "none";

        const upButton = document.createElement("button");
        upButton.classList.add("aspect_up");
        upButton.style.display = "none";
        const downButton = document.createElement("button");
        downButton.classList.add("aspect_down");
        downButton.style.display = "none";

        aspectDiv.appendChild(upButton);
        aspectDiv.appendChild(downButton);

        aspectDiv.appendChild(tierOverlay);
        aspectDiv.appendChild(aspectImage);
        inactiveHolder.appendChild(aspectDiv);
    }
}

function toggleNode(img) {
    // node.classList.toggle("highlight_node");
    img.parentElement.dataset.selected = String(img.parentElement.dataset.selected !== "true");
}

function mapHTML(tree, abilityTree, wynnClass) {
    const cellMap = tree.cellMap;
    const abilities = tree.abilities;
    abilityTree.innerHTML = "";
    // add spacing
    const treeArray = [];


    for (let i = 0; i < (treeColumns * tree.properties.pages * tree.properties.rowsPerPage); i++)
        treeArray.push(cellMap[i + 1]);

    let row = undefined;
    for (let i = 0; i < treeArray.length; i++) {
        const ability = treeArray[i];
        if (i % treeColumns === 0) {
            const tr = document.createElement("tr");
            abilityTree.appendChild(tr);
            row = tr;
        }

        const cell = document.createElement("td");
        row.appendChild(cell);

        if (ability == null) continue;

        cell.classList.add("tree_cell");

        cell.dataset.map_id = (i + 1).toString();

        // Connector
        if (ability.abilityID == null) {
            const dirs = ability.travelNode;
            cell.dataset.type = "connector";
            cell.style["background-image"] = "url(img/branch/" + dirs.up + dirs.down + dirs.left + dirs.right + ".png)";
            continue;
        }
        cell.dataset.type = "node";
        cell.dataset.ability_id = ability.abilityID;
        cell.dataset.color = abilities[ability.abilityID].type;

        const img = document.createElement("img");

        let abilityType = abilities[ability.abilityID].type;
        if (abilityType === "skill") abilityType = wynnClass;
        img.src = "img/node/" + abilityType + "_open.png";
        img.style.display = "block";
        img.style.width = "100%";
        img.style.cursor = "pointer";
        img.dataset.type = "ability";
        img.dataset.id = ability.abilityID;
        img.classList.add("ability_img");
        img.onload = () => {
            img.style.scale = (100 * img.naturalHeight) / 18 + "%";
        };
        img.ondragstart = () => false;
        img.addEventListener("mouseover", () => {
            renderHoverTooltip(getHoverTextForAbility(ability.abilityID, wynnClass));
        });
        img.addEventListener("mouseout", () => {
            hideHoverTooltip();
        });

        cell.appendChild(img);
    }
}

export function validateTree(level = maxPlayerLevel, wynnClass) {
    const treeHTML = document.getElementById("ability_tree");

    if (treeHTML.dataset.class !== wynnClass) {
        changeAbilityTree(wynnClass);
        changeAspects(wynnClass);
        // return;
    }

    const tree = punscake[wynnClass];
    if (!tree) return;

    // reset tree highlights
    for (const cell of treeHTML.querySelectorAll(".tree_cell"))
        cell.dataset.highlights = "0000";

    let usedAP = 0;
    const nodes = {};
    const unvalidatedIDs = [];
    const archetypePoints = {};
    const unselectedIDs = [];

    // initialize archetype points
    for (let archetype of tree.archetypes) archetypePoints[archetype] = 0;

    // gather all nodes
    for (let abilityID of Object.keys(tree.abilities)) {
        const treeNode = getElementFromAbilityID(abilityID);

        nodes[abilityID] = {
            // grab their selected state from the html
            selected: treeNode.dataset.selected === "true",
            mapID: parseInt(treeNode.dataset.map_id),
            element: treeNode,
            ability: tree.abilities[abilityID]
        };

        if (abilityID === tree.startingAbilityID) nodes[abilityID].reachable = true;

        unvalidatedIDs.push(abilityID);

    }

    // loop over all nodes in its exclusion list, returning whether any block it
    const blockedByExclusive = function (abilityID) {
        const exclusives = tree.abilities[abilityID].unlockingWillBlock;
        for (let i = 0; i < exclusives.length; i++) {
            if (nodes[exclusives[i]].selected) {
                return true;
            }
        }
        return false;
    };

    // loop over a "list" of all nodes
    for (let i = 0; i < unvalidatedIDs.length;) {
        const unvalidatedID = unvalidatedIDs[i];
        const node = nodes[unvalidatedID];
        const ability = tree.abilities[unvalidatedID];

        if (!node.selected) {
            unvalidatedIDs.splice(i, 1);
            unselectedIDs.push(unvalidatedID);
            i = 0;
        } else if ((ability.requires !== -1 && !nodes[ability.requires].selected) || blockedByExclusive(unvalidatedID)) {
            // if node is definitely not valid
            node.red = true;
            if (blockedByExclusive(unvalidatedID)) node.locked = true;
            unvalidatedIDs.splice(i, 1);
            i = 0;
        } else if (node.reachable && (ability.archetypePointsRequired <= 0 || ability.archetypePointsRequired <= archetypePoints[ability.archetype])) {
            // node is reachable and has met its archetype req.
            node.valid = true;
            propagateHighlightFromNode(nodes, tree, node.mapID);
            if (ability.archetype !== "") archetypePoints[ability.archetype] += 1;
            unvalidatedIDs.splice(i, 1);
            i = 0;
            usedAP += ability.pointsRequired;
        } else {
            // node hasn't met its archetype req. yet
            i++;
        }
    }

    for (const id of unvalidatedIDs) nodes[id].red = true;

    const maxAP = abilityPointsAtLevel[level] ?? tree.properties.maxAbilityPoints;
    displayAP(usedAP, maxAP, level);

    for (let nodeID in nodes) {
        const node = nodes[nodeID];
        if (!node.selected && maxAP < usedAP + node.ability.pointsRequired) node.unavailable = true;
    }

    for (let id of unselectedIDs) {
        const ability = tree.abilities[id];
        const node = nodes[id];

        if (blockedByExclusive(id)) node.locked = true;
        if ((ability.requires !== -1 && !nodes[ability.requires].selected)) node.unavailable = true;
        if (ability.archetypePointsRequired > archetypePoints[ability.archetype]) node.unavailable = true;
    }

    for (let nodeID in nodes) changeNodeImage(nodes[nodeID], wynnClass);
}

function displayAP(usedAP, maxAP, level) {
    const apDisplay = document.getElementById("assigned_ap_display");
    const maxAPDisplay = document.getElementById("max_ap_display");
    const apColor = usedAP > maxAP ? codeDictionary.positivityColors.false : "";
    apDisplay.innerHTML = minecraftToHTML(apColor + usedAP);
    maxAPDisplay.innerHTML = maxAP;
    if (usedAP > maxAP) addWarning(`Maximum Ability Points exceeded! For level ${level}, there are only ${maxAP} Ability Points available.`);
}

function changeNodeImage(node, wynnClass) {
    const img = node.element.querySelector("img");

    node.element.dataset.red = node.red;
    let suffix =
        node.red ? "_error" :
            node.valid ? "_active" :
                node.locked ? "_blocked" :
                    node.unavailable ? "" :
                        node.reachable ? "_open" : "";

    let abilityType = node.ability.type;
    if (abilityType === "skill") abilityType = wynnClass;

    img.src = "img/node/" + abilityType + suffix + ".png";
    img.style.scale = (100 * img.naturalHeight) / 18 + "%";
}

function getElementFromMapIndex(index) {
    return document.getElementById("ability_tree")
        .querySelector("td[data-map_id='" + index + "']");
}

function getElementFromAbilityID(index) {
    return document.getElementById("ability_tree")
        .querySelector("td[data-ability_id='" + index + "']");
}

const dirs = ["up", "down", "left", "right"];

const dirOffsets = {
    up: -treeColumns, down: treeColumns, left: -1, right: 1
};

const inverseDirs = {
    up: "down", down: "up", left: "right", right: "left"
};

function propagateHighlightFromNode(nodes, tree, nodeIndex) {
    propagateHighlightFrom(nodes, tree, nodeIndex, undefined, nodeIndex);
}

function propagateHighlightTo(nodes, tree, destIndex, sourceDir, nodeIndex) {
    const cell = tree.cellMap[destIndex];
    const node = nodes[cell.abilityID];
    if (node) {
        node.reachable = true;
        return node.selected;
    } else return propagateHighlightFrom(nodes, tree, destIndex, sourceDir, nodeIndex);
}

function propagateHighlightFrom(nodes, tree, sourceIndex, sourceDir, nodeIndex) {
    const element = getElementFromMapIndex(sourceIndex);
    const highlights = Array.from(element.dataset.highlights);

    for (const direction of getValidDirections(tree, sourceIndex, sourceDir, nodeIndex)) {
        if (propagateHighlightTo(nodes, tree, getDestinationForDirection(tree, sourceIndex, direction), direction, nodeIndex)) {
            highlights[dirs.indexOf(direction)] = String(2);
            highlights[dirs.indexOf(inverseDirs[sourceDir])] = String(2);
        }
    }

    element.dataset.highlights = highlights.join("");

    // if it's not 0000, return true
    return element.dataset.highlights !== "0000";
}

function getValidDirections(tree, sourceIndex, sourceDirection, nodeIndex) {
    const source = tree.cellMap[sourceIndex];
    return dirs.filter(direction => {
        // if the node is going up
        if (!tree.bTravesableUp && direction === "up") return false;
        // if the cell doesn't go in this direction
        if (source.travelNode[direction] === 0) return false;
        // if this is the same direction it came from
        if (inverseDirs[sourceDirection] === direction) return false;

        // left on left edge or right on right edge
        if (!tree.loopTree && sourceIndex % treeColumns === 1 && direction === "left") return false;
        if (!tree.loopTree && sourceIndex % treeColumns === 0 && direction === "right") return false;

        let destIndex = getDestinationForDirection(tree, sourceIndex, direction);

        if ((direction === "left" || direction === "right"))
            if (getRow(nodeIndex) !== getRow(destIndex))
                return false;

        const destCell = tree.cellMap[destIndex];

        // if it's not an occupied cell
        if (!destCell) return false;
        // if it connects
        return destCell.travelNode[inverseDirs[direction]] !== 0;
    });
}

function getDestinationForDirection(tree, sourceIndex, dir) {
    let destIndex = sourceIndex + dirOffsets[dir];
    if (tree.loopTree)
        if (sourceIndex % treeColumns === 1 && dir === "left") destIndex += treeColumns;
        else if (sourceIndex % treeColumns === 0 && dir === "right") destIndex -= treeColumns;
    return destIndex;
}

function getRow(index) {
    return Math.floor((index - 1) / treeColumns);
}

export function renderHighlights() {
    for (let connector of document.getElementById("ability_tree").querySelectorAll(".tree_cell[data-type='connector']")) {
        connector.innerHTML = "";
        if (connector.dataset.highlights === "0000") continue;

        const img = connector.appendChild(document.createElement("img"));

        img.src = "img/branch/" + connector.dataset.highlights + ".png";
        img.style.display = "block";
        img.ondragstart = () => false;
    }
}

// #region Aspects

// TODO: add to tree builder and rework input before finishing formatting.
class Aspect {
    id;
    tier;
    data;

    constructor(id, tier, data) {
        this.name = name;
        this.tier = tier;
    }

    static fromInput = (input) => new Aspect(input.dataset.aspect, parseInt(input.childNodes[2].dataset.tier));

    static fromBinary() {
        // TODO
        return new Aspect();
    }

    toBinary() {
        // TODO
        return "";
    }

    // TODO: adding Aspects to HTML
}

// #endregion

// #region Toggles

export function getActiveToggles() {
    const toggles = Array.from(document.querySelector("#effect_toggles").querySelectorAll(".toggle"));
    if (toggles.length < 1) return [];

    return toggles
        .filter(toggle => toggle.classList.contains("toggleOn"))
        .map(toggle => toggle.dataset.toggle_name);
}

export function setToggles(build) {
    const effects = build.effects.map(effectId => classEffects[build.wynnClass].effects[effectId]);

    const newToggles = [];
    for (let effect of effects) {
        if (effect.toggle_name === "") continue;

        newToggles.push({
            toggle_name: effect.toggle_name,
            data: effect.data,
            selected: build.toggles.includes(effect.toggle_name)
        });
    }

    writeTogglesHTML(newToggles);

    document.querySelector("#effects_holder").style.display = newToggles.length > 0 ? "block" : "none";
}

function writeTogglesHTML(newToggles) {
    const toggleHolder = document.querySelector("#effect_toggles");
    toggleHolder.innerHTML = "";

    for (const newToggle of newToggles) toggleHolder.appendChild(generateToggleHTML(newToggle));
}

function generateToggleHTML(newToggle) {
    const button = document.createElement("button");

    button.classList.add("toggle");
    if (newToggle.selected) button.classList.add("toggleOn");

    button.dataset.toggle_name = newToggle.toggle_name;
    button.innerHTML = newToggle.toggle_name;

    return button;
}
