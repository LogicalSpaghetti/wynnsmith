`use strict`;

// elements
const testButton = document.querySelector(`.btn--test`);

const copyShortButton = document.querySelector(`.btn--short`);
const copyLongButton = document.querySelector(`.btn--long`);

const output = document.querySelector(`.output--A`);

var currentClass = "";
const classes = ["warrior", "shaman", "mage", "assassin", "archer"];

const inputs = [
    document.querySelector(`.input--helmet`),
    document.querySelector(`.input--chestplate`),
    document.querySelector(`.input--leggings`),
    document.querySelector(`.input--boots`),
    document.querySelector(`.input--ring0`),
    document.querySelector(`.input--ring1`),
    document.querySelector(`.input--bracelet`),
    document.querySelector(`.input--necklace`),
    document.querySelector(`.input--weapon`),
];

const searchParams = new URLSearchParams(window.location.search);

const sound = new Audio("sounds/mythic_old.ogg");
testButton.addEventListener("click", function () {
    sound.play();
});

copyShortButton.addEventListener("click", function () {
    navigator.clipboard.writeText(getBuildLink(false));
    copyShortButton.textContent = "Build copied!";
});

copyLongButton.addEventListener("click", function () {
    navigator.clipboard.writeText(getBuildLink(true));
    copyLongButton.textContent = "Build copied!";
});

function getBuildLink(long) {
    var text = "https://fiel.us/gabriel/wynnbuilder?";
    var appendedText = "";
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];

        const item = getItemByInput(input);
        if (item === undefined) continue;
        if (text.charAt(text.length - 1) !== "?") text += "&";
        text += input.dataset["slot"] + "=" + input.value.replaceAll(" ", "_");
        if (long) appendedText += "\n> " + input.value;
    }
    return text + appendedText + "\n";
}

const addAllItemData = function () {
    // resets the buttons if they were clicked
    copyLongButton.textContent = copyLongButton.dataset["default"];
    copyShortButton.textContent = copyShortButton.dataset["default"];

    const groupedStats = {};

    addBasePlayerStats(groupedStats);

    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        addItemToCombined(input, groupedStats);
    }

    // this stat is incorrectly listed on one item in the API, and should be ignored
    delete groupedStats["mainAttackFireDamage"];

    combineStats(groupedStats);

    output.textContent = formatCombined(groupedStats);

    return groupedStats;
};

function formatCombined(groupedStats) {
    var combinedString = "Build statistics:\n";
    const keys = Object.keys(groupedStats);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        combinedString += key + ": " + groupedStats[key] + "\n";
    }
    return combinedString;
}

const addBasePlayerStats = function (groupedStats) {
    groupedStats["sumHealth"] = 535;
};

const addItemToCombined = function (input, groupedStats) {
    const item = getItemByInput(input);
    if (item === undefined) return;

    addCategory(groupedStats, item, "base");
    addCategory(groupedStats, item, "identifications");
};

function getItemByInput(input) {
    if (itemGroups === undefined) return console.log("itemGroups is undefined");
    const itemCategory = itemGroups[input.dataset["slot"]];

    if (itemCategory === undefined) return console.log("itemCategory " + input.dataset["slot"] + " is undefined");
    return itemCategory[input.value];
}

const addCategory = function (groupedStats, item, subObjectName) {
    if (item[subObjectName] === undefined) return;
    const subObject = Object.entries(item[subObjectName]);

    for (let i = 0; i < subObject.length; i++) {
        const id = subObject[i];

        var result = id[1];
        if (!Number.isInteger(id[1])) {
            result = result["max"];
        }

        groupedStats[id[0]] = groupedStats[id[0]] === undefined ? result : groupedStats[id[0]] + result;
    }
};

// document.addEventListener() can be used to catch inputs on a global level

// called when the page finishes loading
window.addEventListener("load", function () {
    addInputEventListeners();

    loadBuildFromLink();

    refreshOutputs();
});

function loadBuildFromLink() {
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const itemType = input.dataset["slot"];
        const inputParam = searchParams.get(itemType);
        const inputParams = searchParams.getAll(itemType);
        if (inputParam === undefined || inputParam === null) continue;

        const slotContent =
            itemType !== "ring"
                ? inputParam
                : input === document.querySelector(`.input--ring0`)
                ? inputParams[0]
                : inputParams[1];

        input.value = slotContent.replaceAll("_", " ");
    }
}

function refreshOutputs() {
    addAllItemData();
    setUpAbilityTree();
}

function setUpAbilityTree() {
    const previousClass = currentClass;
    const weapon = getItemByInput(document.querySelector(`.input--weapon`));
    if (weapon === undefined) return;
    currentClass = weapon.requirements.classRequirement;
    if (previousClass === currentClass) return;

    const treeMap = classAbilities[currentClass]["map"]; // array
    document.querySelector(".abilityTree").innerHTML = mapHTML(treeMap);

    const treeNodes = classAbilities[currentClass]["tree"];
    const treeAspects = classAbilities[currentClass]["aspects"];

    const abilityTreeTable = document.querySelector(`.abilityTree`);

    // create things for the map
    var table = "";
    const emptyCell = "<td></td>";

    var currentPosition = 0;
}

function mapHTML(treeMap) {
    console.log("we made it this far!");
    var x = 0;
    var y = 1;

    // sort treeMap
    const nodeIndexes = [];
    for (let i = 0; i < treeMap.length; i++) {
        const node = treeMap[i];
        const coords = node["coordinates"];
        nodeIndexes.push(coords["x"] + (coords["y"] - 1) * 9);
    }
    console.log(nodeIndexes);
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

        //console.log('meta.id: ' + node.meta['id'] + ', family: ' + node.family, ', index: ' + index + ', coords: ' + coords);
    }

    var htmlOutput = "";
    for (let i = 0; i < tablePieces.length; i++) {
        htmlOutput += tablePieces[i].getHTML();
        //console.log(tablePieces[i].index)
    }

    return htmlOutput;
}

class TablePiece {
    constructor(index, content, node) {
        this.index = index;
        this.content = content;
        this.node = node;
        // console.log('pice created:' + index)
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
        attrs += ' class="baller" data-type="' + this.node.type + '"';
        attrs += ' data-page="' + this.node.meta.page + '"';
        attrs += ' data-id="' + this.node.meta.id + '"';
        attrs += ' data-name="' + nodeName + '"';
        attrs += 'style="background-image: url(img/abilities/' + this.node.type + "/" + nodeName + '.png)"';

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

// adds eventListeners to all inputs, such that when they're modified, it updates the build stats
function addInputEventListeners() {
    inputs.forEach((input) => {
        input.addEventListener("input", function () {
            refreshOutputs();
        });
    });
}
