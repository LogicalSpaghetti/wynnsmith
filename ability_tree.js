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

    const tree = punscake[build.wynnClass];
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
        const ability = treeArray[i];
        if (i % 9 === 0) {
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

        const img = document.createElement("img");

        let abilityType = abilities[ability.abilityID].type;
        if (abilityType === "skill") abilityType = wynnClass;
        img.src = "img/node/" + abilityType + "_open.png";
        img.style.display = "block";
        img.style.width = "100%";
        img.style.cursor = "pointer";
        img.dataset.type = "ability";
        img.dataset.name = abilities[ability.abilityID]._plainname;
        img.title = abilities[ability.abilityID].description; // hover text
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
    if (build.wynnClass === undefined) return;
    validateTree(build.wynnClass);
    renderHighlights();

}

function validateTree(wynnClass) {

    const treeHTML = document.getElementById("abilityTree");
    // reset tree highlights
    treeHTML.querySelectorAll("td[data-type='node']").forEach((red) => {
        red.dataset.red = "false";
    })
    treeHTML.querySelectorAll(".tree_cell").forEach(connector => {
        connector.dataset.highlights = "0000";
    });

    const nodes = {};
    const unvalidatedIDs = [];
    const archetypePoints = {};
    const unselectedIDs = [];

    // initialize archetype points
    for (let i = 0; i < punscake[wynnClass].archetypes.length; i++) {
        archetypePoints[punscake[wynnClass].archetypes[i]] = 0;
    }

    // gather all nodes
    Object.keys(punscake[wynnClass].abilities).forEach(abilityID => {
        const treeNode = getElementFromAbilityID(abilityID);


        nodes[abilityID] = {
            // grab their selected state from the html
            selected: treeNode.dataset.selected === "true",
            mapID: parseInt(treeNode.dataset.map_id),
            element: treeNode,
        };

        // determine what the parent node is, and mark it as reachable
        if (abilityID === punscake[wynnClass].startingAbilityID)
            nodes[abilityID].reachable = true;

        unvalidatedIDs.push(abilityID);

    });

    // loop over all nodes in its exclusion list, returning whether any block it
    const blockedByExclusive = function (abilityID) {
        const exclusives = punscake[wynnClass].abilities[abilityID].unlockingWillBlock;
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
        const ability = punscake[wynnClass].abilities[unvalidatedID];

        if (!node.selected) {
            unvalidatedIDs.splice(i, 1);
            unselectedIDs.push(unvalidatedID);
            i = -1;
        } else if ((ability.requires !== -1 && !nodes[ability.requires].selected) ||
            blockedByExclusive(unvalidatedID)) {
            // if node is definitely not valid
            node.red = true;
            if (blockedByExclusive(unvalidatedID)) node.locked = true;
            unvalidatedIDs.splice(i, 1);
            i = -1;
        } else if (node.reachable &&
            (ability.archetypePointsRequired <= 0 ||
                ability.archetypePointsRequired <= archetypePoints[ability.archetype])) {
            // node is reachable and has met its archetype req.
            node.valid = true;
            propagateHighlightFrom(nodes, wynnClass, node.mapID);
            if (ability.archetype !== "") archetypePoints[ability.archetype] += 1;
            unvalidatedIDs.splice(i, 1);
            i = -1;
        }
        // node hasn't met its archetype req. yet
    }

    for (let i = 0; i < unselectedIDs.length; i++) {
        const id = unselectedIDs[i];
        const ability = punscake[wynnClass].abilities[id];
        const node = nodes[id];

        if (blockedByExclusive(id)) node.locked = true;
        if ((ability.requires !== -1 && !nodes[ability.requires].selected)) node.unavailable = true;
        if (!(ability.archetypePointsRequired <= 0 ||
            ability.archetypePointsRequired <= archetypePoints[ability.archetype])) node.unavailable = true;
    }

    unvalidatedIDs.forEach((unvalidatedID) => {
        nodes[unvalidatedID].red = true;
    });

    Object.keys(nodes).forEach(key => {
        nodes[key].element.dataset.red = (nodes[key].red);
    })

    // loop over the list, setting the images for nodes
    Object.keys(nodes).forEach(abilityID => {
        changeNodeImg(nodes, abilityID, wynnClass);
    })
}

function changeNodeImg(nodes, abilityID, wynnClass) {
    const node = nodes[abilityID];

    const img = node.element.querySelector("img");

    let suffix;
    if (node.red) {
        suffix = "_error";
    } else if (node.valid) {
        suffix = "_active";
    } else if (node.locked) {
        suffix = "_blocked";
    } else if (node.unavailable) {
        suffix = "";
    } else if (node.reachable) {
        suffix = "_open";
    } else {
        suffix = "";
    }

    let abilityType = punscake[wynnClass].abilities[abilityID].type;
    if (abilityType === "skill") abilityType = wynnClass;
    img.src = "img/node/" + abilityType + suffix + ".png";
    img.style.scale = (100 * img.naturalHeight) / 18 + "%";
}

function getElementFromMapIndex(index) {
    return document.getElementById("abilityTree")
        .querySelector("td[data-map_id='" + index + "']");
}

function getElementFromAbilityID(index) {
    return document.getElementById("abilityTree")
        .querySelector("td[data-ability_id='" + index + "']");
}

const dirs = ["up", "down", "left", "right"];

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

function propagateHighlightTo(nodes, wynnClass, destIndex, sourceDir) {
    const cell = punscake[wynnClass].cellMap[destIndex];
    const node = nodes[cell.abilityID];
    if (node) {
        node.reachable = true;
        return node.selected;
    } else
        return propagateHighlightFrom(nodes, wynnClass, destIndex, sourceDir);
}

function propagateHighlightFrom(nodes, wynnClass, sourceIndex, sourceDir) {
    const sourceCell = punscake[wynnClass].cellMap[sourceIndex];
    const element = getElementFromMapIndex(sourceIndex);
    const highlights = Array.from(element.dataset.highlights);

    dirs.forEach(newDir => {
        // if the node is going up
        if (!punscake[wynnClass].bTravesableUp && newDir === "up") return;
        // if the cell doesn't go in this direction
        if (sourceCell.travelNode[newDir] === 0) return;
        // if this is the same direction it came from
        if (inverseDirs[sourceDir] === newDir) return;

        const destIndex = sourceIndex + dirOffsets[newDir];

        const destCell = punscake[wynnClass].cellMap[destIndex];

        // if it's not a used cell
        if (destCell === undefined) return;
        // if dest doesn't connect to this
        if (destCell.travelNode[inverseDirs[newDir]] === 0) return;

        // left on left edge or right on right edge
        if (!punscake[wynnClass].loopTree && sourceIndex % 9 === 1 && newDir === "left") return;
        if (!punscake[wynnClass].loopTree && sourceIndex % 9 === 0 && newDir === "right") return;

        // if it finds a selected node:
        if (propagateHighlightTo(nodes, wynnClass, destIndex, newDir)) {
            highlights[dirIndexes[newDir]] = 2;
            highlights[dirIndexes[inverseDirs[sourceDir]]] = 2;
        }
    });

    element.dataset.highlights = highlights.join("");

    // if it's not 0000, return true
    return element.dataset.highlights !== "0000";
}

function renderHighlights() {
    document.getElementById("abilityTree").querySelectorAll(".tree_cell[data-type='connector']").forEach(connector => {
        connector.innerHTML = "";
        if (connector.dataset.highlights === "0000") return;

        const img = document.createElement("img");

        img.src = "img/branch/" + connector.dataset.highlights + ".png";
        img.style.display = "block";
        img.ondragstart = function () {
            return false;
        };

        connector.appendChild(img);
    });
}