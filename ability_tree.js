function addTreeEventListener() {
    const abilityTree = document.querySelector(".abilityTree");
    abilityTree.addEventListener("click", (event) => {
        const node = event.target;
        if (node.dataset.type !== "ability") return;
        toggleNode(node);
    });
}

function refreshAbilityTree() {
    const previousClass = currentClass;
    const weapon = getItemByInput(document.querySelector(`.input--weapon`));
    if (weapon === undefined) return;
    currentClass = weapon.requirements.classRequirement;
    if (previousClass === currentClass) return;

    const treeMap = classAbilities[currentClass]["map"]; // array
    const abilityTree = document.querySelector(".abilityTree");
    abilityTree.innerHTML = mapHTML(treeMap);

    const treeNodes = classAbilities[currentClass]["tree"];
    const treeAspects = classAbilities[currentClass]["aspects"];
}

function toggleNode(node) {
    node.classList.toggle("highlight_node");
    node.classList.previousSibling.toggle("highlight_node");
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
            tablePieces.push(new TablePiece(i + 1, "", undefined));
            continue;
        }
        const coords = node["coordinates"];
        var index = coords.x + (coords.y - 1) * 9;

        const temp = Object.toString(node);

        tablePieces.push(new TablePiece(index, "", node));
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
    constructor(index, content, node) {
        this.index = index;
        this.content = content;
        this.node = node;
    }

    getHTML() {
        if (this.node === undefined) return this.getEmpty();
        return this.htmlStart() + this.encodeNodeData() + ">" + this.content + this.htmlEnd();
    }

    encodeNodeData() {
        const nodeName = (
            this.node.meta.icon.format === undefined ? this.node.meta.icon : this.node.meta.icon.value.name
        ).replaceAll("abilityTree.", "");

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
            ' style="background-image: url(img/abilities/' +
            this.node.type +
            "/" +
            nodeName +
            '.png)"' +
            ' data-index="' +
            this.index +
            '"' +
            ' data-family="' +
            this.node.family +
            '"'
        );
    }

    getEmpty() {
        return this.htmlStart() + ">" + this.content + this.htmlEnd();
    }

    htmlStart() {
        return (this.index % 9 === 1 ? "<tr>" : "") + "<td";
    }

    htmlEnd() {
        return "</td>" + (this.index % 9 === 0 ? "</tr>" : "");
    }
}
