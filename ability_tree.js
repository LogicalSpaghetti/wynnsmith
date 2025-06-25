`use strict`;

function treeClicked(event) {
    const target = event.target;
    if (target.dataset.type !== "ability") return;
    toggleNode(target);
    refreshBuild();
    refreshTreeHighlights();
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
        aspectImage.style = "background-image:url(img/aspect/" + build.wynnClass + ".png);";

        const tierOverlay = document.createElement("span");
        tierOverlay.classList.add("aspect_tier");
        tierOverlay.style.position = "absolute";
        tierOverlay.classList.add("Tier_" + (aspect.rarity === "legendary" ? romanize(4) : romanize(3)));
        tierOverlay.textContent = aspect.rarity === "legendary" ? romanize(4) : romanize(3);
        tierOverlay.dataset.tier = aspect.rarity === "legendary" ? 4 : 3;
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
    img.parentElement.dataset.selected = img.parentElement.dataset.selected !== "true";
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
        cell.classList.add("cell_" + i);

        // Connector
        if (ability.abilityID === undefined) {
            const dirs = ability.travelNode;
            cell.dataset.type = "connector";
            cell.style["background-image"] = "url(img/branch/" + dirs.up + dirs.down + dirs.left + dirs.right + ".png)";
            cell.dataset.points = "" + dirs.up + dirs.down + dirs.left + dirs.right;
            continue;
        }
        cell.dataset.type = "node";

        const img = document.createElement("img");

        let abilityType = abilities[ability.abilityID].type;
        if (abilityType === "skill") abilityType = wynnClass;
        img.src = "img/node/" + abilityType + "_open.png";
        img.style.display = "block";
        img.style.width = "100%";
        img.style.scale = (100 * img.naturalHeight) / 18 + "%";
        img.style.cursor = "pointer";
        img.dataset.type = "ability";
        img.dataset.name = abilities[ability.abilityID]._plainname;
        img.title = abilities[ability.abilityID]._plainname; // hover text
        img.classList.add("ability_img");

        cell.appendChild(img);
        // cell.style["background-image"] = "url(img/node/" + abilityType + "_open.png)";
        // cell.style["background-size"] = "100%";
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

function refreshTreeHighlights() {
    const grid = document.querySelectorAll(".tree_cell");
    if (grid.length < 1) {
        console.log("no tree found!");
        return;
    }
    console.log(grid);
    // reset reachable
    for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        if (!cell.dataset.type) continue;
        // top node is left reachable
        cell.dataset.reachable = cell.dataset.index === "4" ? "true" : "false";
    }
    propagateFromNode(grid, 4);
}

const dirs = {
    up: -9,
    down: 9,
    left: -1,
    right: 1,
};

function propagateFromNode(grid, node) {
    // if selected, propogate to all neighbors
    if (node.dataset.selected === "true") {

    }
}

function propogateTo(grid, cell, source) {
    // if node,
        // toggle reachable
        // if selected, return true
        // return false
    // if connection,
        // propagate every direction except source
        // if it gets back a true, mark that direction as 2
        // once all have returned, if any were true
            // mark the source direction as true and return true
}
