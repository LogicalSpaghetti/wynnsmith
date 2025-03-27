`use strict`;

function treeClicked(event) {
    const node = event.target;
    if (node.dataset.type !== "ability") return;
    toggleNode(node);
}

function refreshAbilities(build) {
    if (previousClass === build.class) {
        addNodesToBuild(build);
        addAspectsToBuild(build);
    } else {
        changeAbilityTree(build);
        changeAspects(build);
    }
}

function changeAbilityTree(build) {
    document.querySelector(".abilityTreeContainer").removeAttribute("hidden");

    const treeMap = classes[build.class].map; // array
    const abilityTree = document.querySelector(".abilityTree");
    abilityTree.innerHTML = mapHTML(treeMap);

    const treeNodes = classes[build.class].tree;

    // prevent images from being dragged
    document.querySelectorAll(".node_img").forEach((img) => {
        img.ondragstart = () => {
            return false;
        };
    });
}

function changeAspects(build) {
    const aspects = classes[build.class].aspects;
    const aspectNames = Object.keys(aspects);

    const activeHolder = document.querySelector("#active_aspects");
    const inactiveHolder = document.querySelector("#inactive_aspects");

    activeHolder.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        const offset = i*32.4 - 2.7;
        activeHolder.innerHTML += "<button class=\"aspect_up\" style=\"translate: " + offset + "px 0px\"></button>"
        activeHolder.innerHTML += "<button class=\"aspect_down\" style=\"translate: " + offset + "px 13.5px\"></button>"
    }
    inactiveHolder.innerHTML = "";

    for (let i = 0; i < aspectNames.length; i++) {
        const aspect = aspects[aspectNames[i]];

        const aspectDiv = document.createElement("div");
        aspectDiv.classList.add("aspect");
        aspectDiv.classList.add(aspect.rarity);
        aspectDiv.dataset.aspect = aspectNames[i];

        const aspectImage = document.createElement("span");
        aspectImage.classList.add("aspect_image");
        aspectImage.style = "background-image:url(img/aspect/" + build.class + ".png);";

        const tierOverlay = document.createElement("span");
        tierOverlay.classList.add("aspect_tier");
        tierOverlay.style.position = "absolute";
        tierOverlay.textContent = "IV";

        aspectDiv.appendChild(tierOverlay);
        aspectDiv.appendChild(aspectImage);
        inactiveHolder.appendChild(aspectDiv);
    }
}

function toggleNode(node) {
    node.classList.toggle("highlight_node");
    node.parentElement.parentElement.classList.toggle("highlight_node");
    refreshBuild();
}

function mapHTML(treeMap) {
    var x = 0;
    var y = 1;

    // sort treeMap
    const nodeIndexes = [];
    for (let i = 0; i < treeMap.length; i++) {
        const node = treeMap[i];
        const coords = node["coordinates"];
        nodeIndexes.push(coords["x"] + (coords["y"] - 1) * 9);
    }
    const newTreeMap = [];
    for (let i = 0; i < treeMap.length; i++) {
        const node = treeMap[i];
        if (node === undefined) continue;
        const index = nodeIndexes[i];

        while (newTreeMap.length < index) {
            newTreeMap.push(undefined);
        }
        newTreeMap[index - 1] = node;
    }
    treeMap = newTreeMap;

    var tablePieces = [];
    for (let i = 0; i < treeMap.length; i++) {
        const node = treeMap[i];
        if (node === undefined) {
            tablePieces.push(new TablePiece(i + 1, undefined));
            continue;
        }
        const coords = node["coordinates"];
        var index = coords.x + (coords.y - 1) * 9;

        const temp = Object.toString(node);

        tablePieces.push(new TablePiece(index, node));
    }

    var htmlOutput = "";
    for (let i = 0; i < tablePieces.length; i++) {
        htmlOutput += tablePieces[i].getHTML();
    }

    for (let i = 0; i < treeMap.length; i++) {
        if (treeMap.node === undefined) continue;
    }

    return htmlOutput;
}

class TablePiece {
    constructor(index, node) {
        this.index = index;
        this.node = node;
    }

    getHTML() {
        return (
            this.tdHead() +
            (this.node === undefined ? "" : this.node.type === "connector" ? this.getConnector() : this.getAbility()) +
            this.tdFoot()
        );
    }

    tdHead() {
        return (this.index % 9 === 1 ? "<tr>" : "") + "<td>";
    }
    tdFoot() {
        return "</td>" + (this.index % 9 === 0 ? "</tr>" : "");
    }

    getConnector() {
        const nodeName = this.node.meta.icon.replaceAll("abilityTree.", "");
        return (
            '<div class="connector" data-name="' + nodeName + '" style="background-image: url(img/abilities/' +
            this.node.type +
            "/" +
            nodeName +
            '.png)"></div>'
        );
    }

    getAbility() {
        const nodeName = this.node.meta.icon.value.name.replaceAll("abilityTree.", "");

        return "<div" + this.encodeNodeData(nodeName) + ">" + this.imgHTML(nodeName) + "</div>";
    }

    imgHTML(nodeName) {
        return (
            '<div class="node_img_box"' +
            ' data-name="' +
            nodeName +
            '"' +
            ' data-type="' +
            this.node.type +
            '"><img class="node_img" src="img/abilities/' +
            this.node.type +
            "/" +
            nodeName +
            '.png" data-type="' +
            this.node.type +
            '"></div>'
        );
    }

    encodeNodeData(nodeName) {
        return (
            ' class="ability_node" data-type="' +
            this.node.type +
            '"' +
            ' title="' +
            this.node.meta.id +
            '"' +
            ' data-page="' +
            this.node.meta.page +
            '"' +
            ' data-id="' +
            this.node.meta.id +
            '"' +
            ' data-name="' +
            nodeName +
            '"' +
            ' data-index="' +
            this.index +
            '"' +
            ' data-family="' +
            this.node.family +
            '"'
        );
    }
}

// called any time the build changes but the class doesn't
function addNodesToBuild(build) {
    const treeNodes = document.querySelectorAll(".ability_node");
    treeNodes.forEach((node) => {
        if (node.classList.contains("highlight_node")) {
            build.nodes.push(node.dataset.id);
        }
    });
}

function addAspectsToBuild(build) {
    const aspects = document.querySelector("#active_aspects").querySelectorAll(".aspect");
    aspects.forEach((aspect) => {
        build.aspects.push(aspect.dataset.aspect);
    });
}
