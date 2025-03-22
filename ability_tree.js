`use strict`;

var currentClass = "";

function treeClicked(event) {
    const node = event.target;
    if (node.dataset.type !== "ability") return;
    toggleNode(node);
}

function refreshAbilityTree(build) {
    const previousClass = currentClass;
    const weapon = getItemByInput(document.querySelector(`.input--weapon`));
    if (weapon !== undefined) currentClass = weapon.requirements.classRequirement;
    if (previousClass === currentClass) return;

    const treeMap = classAbilities[currentClass]["map"]; // array
    const abilityTree = document.querySelector(".abilityTree");
    abilityTree.innerHTML = mapHTML(treeMap);

    const treeNodes = classAbilities[currentClass]["tree"];
    const treeAspects = classAbilities[currentClass]["aspects"];

    // prevent images from being dragged
    document.querySelectorAll(".node_img").forEach((img) => {
        img.ondragstart = () => {
            return false;
        };
    });
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
            '<div class="connector" style="background-image: url(img/abilities/' +
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
    const treeNodes = document.querySelectorAll('.ability_node');
    treeNodes.forEach(node => {
        if (node.classList.contains("highlight_node")) {
            build.nodes.push(node.dataset.id);
        }
    });

    console.log('build.nodes: ' + JSON.stringify(build.nodes));
}