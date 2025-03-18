function setUpAbilityTree() {
    const previousClass = currentClass;
    const weapon = getItemByInput(document.querySelector(`.input--weapon`));
    if (weapon === undefined) return;
    currentClass = weapon.requirements.classRequirement;
    if (previousClass === currentClass) return;

    const treeMap = classAbilities[currentClass]["map"]; // array
    document.querySelector(".abilityTree").innerHTML = mapHTML(treeMap);

    document.querySelectorAll(".ability_node").forEach((node) => {
        if (node.dataset["type"] !== "connector") {
            node.addEventListener("click", function () {
                // propagate toggle
                toggleNode(node);
            });
        }
    });

    const treeNodes = classAbilities[currentClass]["tree"];
    const treeAspects = classAbilities[currentClass]["aspects"];
}

function toggleNode(node) {
    const oldImg = node.style["background-image"];
    const darken = oldImg.includes('_a.png"');

    // toggle
    const newImg = darken ? oldImg.replaceAll("_a.png", ".png") : oldImg.replaceAll(".png", "_a.png");

    node.style["background-image"] = newImg;

    tryPropagateFromNode(node);

    if (darken && node.dataset.type === 'ability') {
        const abilities = document.querySelectorAll('[data-type="ability"]')
        for (let i = 0; i < abilities.length; i++) {
            const ability = abilities[i]
            if (ability.style["background-image"].includes('_a.png"')) {
                tryPropagateFromNode(ability);
            }
        }
    }
    
}

function tryPropagateFromNode(node) {
    tryPropagateInDirection(node, 9, "up");
    tryPropagateInDirection(node, 1, "left");
    tryPropagateInDirection(node, -1, "right");
}

function tryPropagateInDirection(startNode, indexOffset, connectionDirection) {
    const index = parseInt(startNode.dataset["index"]) + indexOffset;
    const node = document.querySelector('[data-index="' + index + '"]');
    if (node === null) return;
    if (node.style["background-image"].includes('_a.png"') === startNode.style["background-image"].includes('_a.png"'))
        return;
    if (node.dataset.name.includes("_" + connectionDirection)) {
        toggleNode(node);
    }
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

        tablePieces.push(new TablePiece(index, '<div class="filledNodeDiv"></div>', node));
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

        var attrs = "";
        attrs += ' class="ability_node" data-type="' + this.node.type + '"';
        attrs += ' data-page="' + this.node.meta.page + '"';
        attrs += ' data-id="' + this.node.meta.id + '"';
        attrs += ' data-name="' + nodeName + '"';
        attrs += ' style="background-image: url(img/abilities/' + this.node.type + "/" + nodeName + '.png)"';
        attrs += ' data-index="' + this.index + '"';
        attrs += ' data-family="' + this.node.family + '"';

        return attrs;
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
