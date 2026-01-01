import {preLoadAssets} from "./control/preloading.js";
import {addInputListeners} from "./control/listener/input_listeners.js";
import {addSettingsListeners} from "./control/listener/settings_listeners.js";

// code entry point:
window.addEventListener("load", loadSite);

function loadSite() {
    console.log("loadSite");
    // noinspection JSIgnoredPromiseFromCall
    preLoadAssets();
    // TODO:
    //  read Link
    //  parse Build from Link
    //  Initialize Input HTML values from Link
    addInputListeners();
    addSettingsListeners();
}

let branches = 1;

// TODO: doesn't handle negative given SP, handling is easy
function findOrder(items, i = 0, verify = true, usableArmor = new Array(items.length).fill(false),
                   order = [], assignedSP = [0, 0, 0, 0, 0], givenSP = [0, 0, 0, 0, 0], spCap = [150, 150, 150, 150, 150]) {
    if (i >= items.length) {
        if (verify) return findOrder(items, 0, false, usableArmor, order, assignedSP, givenSP, spCap);
        else return null;
    } else if (i === 0) verify = false;
    console.log("a");

    if (usableArmor[i]) return findOrder(items, i + 1, verify, usableArmor, order, assignedSP, givenSP, spCap);
    console.log("b");
    console.log(i);
    const item = items[i];
    console.log(item.cost, assignedSP, givenSP);
    console.log("c");
    if (itemCanEquip(item, assignedSP, givenSP)) {
        console.log("d1");
        verify = true;
        usableArmor[i] = true;
        order.push(i);
        if (order.length >= items.length) return {order, assignedSP}; // SUCCESS!
        givenSP = givenSP.map((x,i) => x + item.given[i]);
    } else {
        console.log("d2");
        branches++;
        console.log(`${branches} branches`);

        const newCap = spCap.map((x, i) => item.cost[i] <= 0 ? x : Math.min(x, item.cost[i] - givenSP[i] - 1));
        const loweredCap = findOrder(items, i + 1, verify, usableArmor, order, assignedSP, givenSP, newCap);

        const newAssign = assignedSP.map((x, i) => Math.max(x, item.cost[i] - givenSP[i]));
        const raisedAssign = findOrder(items, i, verify, [...usableArmor], [...order], newAssign, [...givenSP], [...spCap]);

        return getLowestCap(loweredCap, raisedAssign);
    }
    console.log("e");
    i++;
    return findOrder(items, i, verify, usableArmor, order, assignedSP, givenSP, spCap);
}

function getLowestCap(a, b) {
    if (!a) return b;
    if (!b) return a;
    return a.assignedSP.reduce((x, y) => x + y) > b.assignedSP.reduce((x, y) => x + y)
        ? b : a;
}

function itemCanEquip(item, assignedSP, givenSP) {
    for (let i = 0; i < item.cost.length; i++)
        if (item.cost[i] > 0 && item.cost[i] - assignedSP[i] - givenSP[i] > 0) return false;
    return true;
}

const inputItems = [
    {cost: [8, 0, 0, 0, 0], given: [1, 1, 1, 1, 1]},
    {cost: [7, 7, 0, 0, 0], given: [1, 1, 1, 1, 1]},
    {cost: [6, 6, 6, 0, 0], given: [1, 1, 1, 1, 1]},
    {cost: [5, 5, 5, 5, 0], given: [1, 1, 1, 1, 1]},
    {cost: [4, 4, 4, 4, 4], given: [1, 1, 1, 1, 1]},
    {cost: [3, 3, 3, 3, 3], given: [1, 1, 1, 1, 1]},
    {cost: [2, 2, 2, 2, 2], given: [1, 1, 1, 1, 1]},
    {cost: [1, 1, 1, 1, 1], given: [1, 1, 1, 1, 1]},
    {cost: [0, 0, 0, 0, 0], given: [1, 1, 1, 1, 1]}
];

console.log(findOrder(inputItems));