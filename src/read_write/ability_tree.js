`use strict`;

const treeColumns = 9;

function treeClicked(event) {
    const target = event.target;
    if (target.dataset.type !== "ability") return;
    toggleNode(target);
    refreshBuild();
}

function getInputAbilities(wynnClass) {
    const previousClass = document.getElementById("ability_tree").dataset.class;

    if (previousClass !== wynnClass) return {
        nodes: [],
        aspects: [],
        toggles: []
    };

    return {
        nodes: getNodes(),
        aspects: getAspects(),
        toggles: getActiveToggles()
    };
}

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
        img.onload = function () {
            img.style.scale = (100 * img.naturalHeight) / 18 + "%";
        };
        img.ondragstart = function () {
            return false;
        };
        img.addEventListener("mouseover", () => {
            renderHoverTooltip(getHoverTextForAbility(ability.abilityID, wynnClass));
        });
        img.addEventListener("mouseout", () => {
            hideHoverAbilityTooltip();
        });

        cell.appendChild(img);
    }
}

function getNodes() {
    const treeNodes = Array.from(document.querySelectorAll(".tree_cell[data-type='node']"));

    return treeNodes
        .filter(node => node.dataset.selected === "true")
        .map((node) => node.dataset.ability_id);
}

function getAspects() {
    const aspectInputs = Array.from(document.getElementById("active_aspects")
        .querySelectorAll(".aspect"));

    return aspectInputs.map(aspect => ({
        name: aspect.dataset.aspect,
        tier: parseInt(aspect.childNodes[2].dataset.tier)
    }));
}

function validateTree(level = maxPlayerLevel, wynnClass) {
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
    displayAP(usedAP, maxAP);

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

function displayAP(usedAP, maxAP) {
    const apDisplay = document.getElementById("assigned_ap_display");
    const maxAPDisplay = document.getElementById("max_ap_display");
    const apColor = usedAP > maxAP ? codeDictionaryPositivityColors.false : "";
    apDisplay.innerHTML = minecraftToHTML(apColor + usedAP);
    maxAPDisplay.innerHTML = maxAP;
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

const dirIndexes = {
    up: 0, down: 1, left: 2, right: 3
};

function propagateHighlightFromNode(nodes, tree, nodeIndex) {
    propagateHighlightFrom(nodes, tree, nodeIndex, undefined, nodeIndex);
}

function propagateHighlightTo(nodes, tree, destIndex, sourceDir, sourceNodeIndex) {
    const cell = tree.cellMap[destIndex];
    const node = nodes[cell.abilityID];
    if (node) {
        node.reachable = true;
        return node.selected;
    } else return propagateHighlightFrom(nodes, tree, destIndex, sourceDir, sourceNodeIndex);
}

function propagateHighlightFrom(nodes, tree, sourceIndex, sourceDir, nodeIndex) {
    const sourceCell = tree.cellMap[sourceIndex];
    const element = getElementFromMapIndex(sourceIndex);
    const highlights = Array.from(element.dataset.highlights);

    for (const direction of getValidDirections(tree, sourceIndex, sourceDir, nodeIndex)) {
        if (propagateHighlightTo(nodes, tree, getDestinationForDirection(tree, sourceIndex, direction), direction, nodeIndex)) {
            highlights[dirIndexes[direction]] = 2;
            highlights[dirIndexes[inverseDirs[sourceDir]]] = 2;
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

function renderHighlights() {
    for (let connector of document.getElementById("ability_tree").querySelectorAll(".tree_cell[data-type='connector']")) {
        connector.innerHTML = "";
        if (connector.dataset.highlights === "0000") continue;

        const img = connector.appendChild(document.createElement("img"));

        img.src = "img/branch/" + connector.dataset.highlights + ".png";
        img.style.display = "block";
        img.ondragstart = () => false;
    }
}
