`use strict`;

function treeClicked(event) {
    const target = event.target;
    if (target.dataset.type !== "ability") return;
    toggleNode(target);
    refreshBuild();
}

function refreshAbilities(build) {
    if (previousClass === build.wynnClass) {
        addNodesToBuild(build);
        addAspectsToBuild(build);
    } else {
        changeAbilityTree(build);
        changeAspects(build);
    }
}

function changeAbilityTree(build) {
    const abilityTree = document.getElementById("abilityTree");

    abilityTree.removeAttribute("hidden");

    const tree = punscake;
    abilityTree.innerHTML = "";
    mapHTML(tree, abilityTree, build.wynnClass);

    // prevent images from being dragged
    document.querySelectorAll(".node_img").forEach((img) => {
        img.ondragstart = () => {
            return false;
        };
    });
}

function changeAspects(build) {
    const aspects = classes[build.wynnClass].aspects;
    const aspectNames = Object.keys(aspects);

    const activeHolder = document.getElementById("active_aspects");
    const inactiveHolder = document.getElementById("inactive_aspects");

    activeHolder.innerHTML = "";
    inactiveHolder.innerHTML = "";

    for (let i = 0; i < aspectNames.length; i++) {
        const aspect = aspects[aspectNames[i]];

        const aspectDiv = document.createElement("div");
        aspectDiv.classList.add("aspect");
        aspectDiv.classList.add(aspect.rarity);
        aspectDiv.dataset.aspect = aspectNames[i];
        aspectDiv.title = aspectNames[i];

        const aspectImage = document.createElement("span");
        aspectImage.classList.add("aspect_image");
        aspectImage.style["background-image"] = "url(img/aspect/" + build.wynnClass + ".png)";

        const tierOverlay = document.createElement("span");
        tierOverlay.classList.add("aspect_tier");
        tierOverlay.style.position = "absolute";
        tierOverlay.classList.add("Tier_" + (aspect.rarity === "legendary" ? romanize(4) : romanize(3)));
        tierOverlay.textContent = aspect.rarity === "legendary" ? romanize(4) : romanize(3);
        tierOverlay.dataset.tier = String(aspect.rarity === "legendary" ? 4 : 3);
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
    for (let key in cellMap) {
        const index = parseInt(key);
        const node = cellMap[key];

        while (treeArray.length < index) {
            treeArray.push(undefined);
        }
        treeArray[index - 1] = node;
    }

    let row = undefined;
    for (let i = 0; i < treeArray.length; i++) {
        if (i % 54 < 9 && i > 8) continue;
        const ability = treeArray[i];
        if (i % 9 === 0) {
            const tr = document.createElement("tr");
            abilityTree.appendChild(tr);
            row = tr;
        }
        const cell = document.createElement("td");
        row.appendChild(cell);

        if (ability === undefined) continue;

        cell.classList.add("tree_cell");

        cell.dataset.map_id = (i + 1).toString();

        // Connector
        if (ability.abilityID === undefined) {
            const dirs = ability.travelNode;
            cell.dataset.type = "connector";
            cell.style["background-image"] = "url(img/branch/" + dirs.up + dirs.down + dirs.left + dirs.right + ".png)";
            continue;
        }
        cell.dataset.type = "node";
        cell.dataset.ability_id = ability.abilityID;

        const img = document.createElement("img");

        let abilityType = abilities[ability.abilityID].type;
        if (abilityType === "skill") abilityType = wynnClass;
        img.src = "img/node/" + abilityType + "_open.png";
        img.style.display = "block";
        img.style.width = "100%";
        img.style.cursor = "pointer";
        img.dataset.type = "ability";
        img.dataset.name = abilities[ability.abilityID]._plainname;
        img.title = abilities[ability.abilityID]._plainname; // hover text
        img.classList.add("ability_img");
        img.onload = function () {
            img.style.scale = (100 * img.naturalHeight) / 18 + "%";
        };
        img.ondragstart = function () {
            return false;
        };

        cell.appendChild(img);
    }
}

// called any time the build changes but the class doesn't
function addNodesToBuild(build) {
    const treeNodes = document.querySelectorAll(".ability_img");
    treeNodes.forEach((node) => {
        if (node.parentElement.dataset.selected === "true") {
            build.nodes.push(node.dataset.name);
        }
    });
}

function addAspectsToBuild(build) {
    const aspects = document.getElementById("active_aspects").querySelectorAll(".aspect");
    aspects.forEach((aspect) => {
        build.aspects.push(aspect.dataset.aspect);
        build.aspectTiers.push(Number(aspect.childNodes[2].dataset.tier));
    });
}

function updateTreeRender(build) {
    validateTree(build.wynnClass);
    renderTree(build.wynnClass);
}

function validateTree(wynnClass) {
    const treeHTML = document.getElementById("abilityTree");

    const nodes = {};
    const unvalidatedIDs = [];
    const archetypePoints = {};

    // initialize archetype points
    for (let i = 0; i < punscake.archetypes; i++) {
        archetypePoints[punscake.archetypes[i]] = 0;
    }

    // gather all nodes
    Object.keys(punscake.abilities).forEach(abilityID => {
        const treeNode = treeHTML.querySelector("td[data-ability_id='" + abilityID + "']");

        nodes[abilityID] = {
            // grab their selected state from the html
            selected: treeNode.dataset.selected === "true",
            mapID: parseInt(treeNode.dataset.map_id),
        };

        // determine what the parent node is, and mark it as reachable
        if (abilityID === punscake.startingAbilityID)
            nodes[abilityID].reachable = true;

        unvalidatedIDs.push(abilityID);

    });

    // propagation
    // - from the node, propagate out to find other nodes, marking any found as reachable
    const propagateReachable = function (index) {

    };

    // loop over all nodes in its exclusion list, returning whether any block it
    const blockedByExclusive = function (abilityID) {
        const exclusives = punscake.abilities[abilityID].unlockingWillBlock;
        for (let i = 0; i < exclusives.length; i++) {
            if (nodes[exclusives[i]].selected) {
                return true;
            }
        }
        return false;
    };

    // loop over a "list" of all nodes
    for (let i = 0; i < unvalidatedIDs.length; i++) {
        const unvalidatedID = unvalidatedIDs[i];
        const node = nodes[unvalidatedID];
        const ability = punscake.abilities[unvalidatedID];

        // if node is not selected
        if (!node.selected) {
            // if any exclusives are selected, mark as locked
            if (blockedByExclusive(unvalidatedID)) {
                node.locked = true;
            }

            // remove from array, and reset
            unvalidatedIDs.splice(i, 1);
            i = 0;
        } else if (!node.reachable ||
            (ability.requires !== -1 && !nodes[ability.requires].selected) ||
            blockedByExclusive(unvalidatedID)) {
            // if node is definitely not valid

            node.red = true;
            unvalidatedIDs.splice(i, 1);
            i = 0;
        } else if (ability.archetypePointsRequired === -1 ||
            ability.archetypePointsRequired <= archetypePoints[ability.archetype]) {
            // node is reachable and has met its archetype req.
            node.valid = true;
            if (ability.archetype !== "") archetypePoints[ability.archetype] += 1;
            unvalidatedIDs.splice(i, 1);
            i = 0;
        }
        // node hasn't met its archetype req. yet
    }

    // loop over the list, setting the images for nodes
    // 	1. if it's still in the unconfirmed list, color red
    // 	2. if it's marked red, color red
    // 	3. if it's marked valid, color blue
    // 	4. if it's marked locked, color locked
    // 	5. if it's marked reachable, color reachable
    // 	6. mark unreachable
}

function renderTree(wynnClass) {
    propagateHighlights(punscake);
    renderHighlights();
}

function getElementFromMapIndex(index) {
    return document.getElementById("abilityTree")
        .querySelector("td[data-map_id='" + index + "']");
}

const dirOffsets = {
    up: -9,
    down: 9,
    left: -1,
    right: 1,
};

const inverseDirs = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
};

const dirIndexes = {
    up: 0,
    down: 1,
    left: 2,
    right: 3,
};

function propagateHighlights(tree) {
    const grid = document.getElementById("abilityTree").querySelectorAll("td");
    if (grid.length < 1) throw new Error("Ability Tree Grid Trying to Highlight While Empty!");

    // reset reachable
    for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        if (cell.dataset.type === "connector") {
            cell.dataset.highlights = "0000";
        } else if (cell.dataset.type === "node") {
            cell.dataset.highlights = "0000";
            cell.dataset.reached = "false";
        }
    }

    // propagate from the starting node
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].dataset.type === "node") {
            // verify that it's the starting node

            if (punscake.cellMap[parseInt(grid[i].dataset.map_id)].abilityID === punscake.startingAbilityID) {
                propagateHighlightFrom(tree, grid, i);
                break;
            }
        }
    }
}

function propagateHighlightTo(tree, grid, destIndex, sourceDir) {
    const cell = grid[destIndex];
    if (cell.dataset.type === "connector") {
        // if it's connected from the source, re-propagate and return the success of that
        if (tree.cellMap[parseInt(grid[destIndex].dataset.map_id)].travelNode[inverseDirs[sourceDir]]) {
            return propagateHighlightFrom(tree, grid, destIndex, sourceDir);
        }
        return false;
    } else if (cell.dataset.type === "node") {
        cell.dataset.reached = "true";
        return cell.dataset.selected === "true";
    }
    return false;
}

function propagateHighlightFrom(tree, grid, sourceIndex, sourceDir) {
    const highlights = ["0", "0", "0", "0"];
    Object.keys(dirOffsets).forEach(dirName => {
        // if the node is going up
        if (dirName === "up") return;
        // if the node doesn't go in this direction
        if (!tree.cellMap[parseInt(grid[sourceIndex].dataset.map_id)].travelNode[dirName]) return;
        // if this is the same direction it came from
        if (inverseDirs[sourceDir] === dirName) return;

        const destIndex = dirOffsets[dirName] + sourceIndex;
        // too high or low
        if (destIndex < 0 || destIndex >= grid.length) return;
        // left on left edge or right on right edge
        if (sourceIndex % 9 === 0 && dirName === "left") return;
        if (sourceIndex % 9 === 8 && dirName === "right") return;

        // if the direction is valid:

        if (propagateHighlightTo(tree, grid, destIndex, dirName)) {
            highlights[dirIndexes[dirName]] = "1";
            highlights[dirIndexes[inverseDirs[sourceDir]]] = "1";
        }
    });

    grid[sourceIndex].dataset.highlights = decimalToBinary(
        binaryToDecimal(highlights[0] + highlights[1] + highlights[2] + highlights[3]) |
        binaryToDecimal(grid[sourceIndex].dataset.highlights));

    while (grid[sourceIndex].dataset.highlights.length < 4) {
        grid[sourceIndex].dataset.highlights = "0" + grid[sourceIndex].dataset.highlights;
    }

    // if it's not 0000, return true
    return grid[sourceIndex].dataset.highlights !== "0000";
}

function renderHighlights() {
    document.getElementById("abilityTree").querySelectorAll(".tree_cell[data-type='connector']").forEach(connector => {
        connector.innerHTML = "";
        if (connector.dataset.highlights === "0000") return;

        const img = document.createElement("img");
        let twosString = "";
        Array.from(connector.dataset.highlights).forEach(highlight => {
            twosString += (highlight === "1") ? "2" : "0";
        });
        img.src = "img/branch/" + twosString + ".png";
        img.style.display = "block";
        img.ondragstart = function () {
            return false;
        };

        connector.appendChild(img);
    });
}