/**
 * Calls a defined callback function on each element of an array, and returns an array that contains the results.
 * @param items :{}[] sorted by slot
 * @param i :number simulated for() index
 * @param verify :boolean simulated while() condition
 * @param usableArmor :boolean[] booleans representing whether the equipment in the corresponding slot has been equipped
 * @param order :number[]
 * @param assignedSP :number[]
 * @param givenSP :number[]
 * @param spCap :number[]
 * @param spTotalFloor :number[]
 */
function findOrder(items, i = 0, verify = true, usableArmor = new Array(items.length).fill(false),
                   order = [], assignedSP = [0, 0, 0, 0, 0], givenSP = [0, 0, 0, 0, 0], spCap = [150, 150, 150, 150, 150], spTotalFloor = [0, 0, 0, 0, 0]/*Ensures an item will never unequip after being equipped*/) {
    if (i >= items.length)
        return (verify) ? reLoop() : null;
    else if (i === 0) verify = false;

    if (usableArmor[i]) return incrementLoop();

    const item = items[i];
    if (itemCanEquip(item, assignedSP, givenSP)) {
        order.push(i);
        if (order.length >= items.length) return {order, assignedSP}; // SUCCESS!
        verify = true;
        usableArmor[i] = true;
        givenSP = givenSP.map((x, i) => x + item.given[i]);
    } else {
        branches++;
        const newCap = spCap.map((x, i) => item.cost[i] <= 0 ? x : Math.min(x, item.cost[i] - givenSP[i] - 1));
        const loweredCap = findOrder(items, i + 1, verify, [...usableArmor], order, assignedSP, givenSP, newCap);

        const newAssign = assignedSP.map((x, i) => Math.max(x, item.cost[i] - givenSP[i]));
        const raisedAssign = findOrder(items, i, verify, [...usableArmor], [...order], newAssign, [...givenSP], [...spCap]);

        return getLowestCap(loweredCap, raisedAssign);
    }

    return incrementLoop();

    function reLoop() {
        return findOrder(items, 0, false, usableArmor, order, assignedSP, givenSP, spCap);
    }

    function incrementLoop() {
        return findOrder(items, i + 1, verify, usableArmor, order, assignedSP, givenSP, spCap);
    }
}

function getLowestCap(a, b) {
    if (!a) return b;
    if (!b) return a;
    return a.assignedSP.reduce((x, y) => x + y) > b.assignedSP.reduce((x, y) => x + y)
        ? b : a;
}

function itemCanEquip(item, assignedSP, givenSP) {
    checks++;
    for (let i = 0; i < item.cost.length; i++)
        if (item.cost[i] > 0 && item.cost[i] - assignedSP[i] - givenSP[i] > 0) return false;
    return true;
}

const testCases = [[
    {cost: [8, 0, 0, 0, 0], given: [1, 1, 1, 1, 1]},
    {cost: [7, 7, 0, 0, 0], given: [1, 1, 1, 1, 1]},
    {cost: [6, 6, 6, 0, 0], given: [1, 1, 1, 1, 1]},
    {cost: [5, 5, 5, 5, 0], given: [1, 1, 1, 1, 1]},
    {cost: [4, 4, 4, 4, 4], given: [1, 1, 1, 1, 1]},
    {cost: [3, 3, 3, 3, 3], given: [1, 1, 1, 1, 1]},
    {cost: [2, 2, 2, 2, 2], given: [1, 1, 1, 1, 1]},
    {cost: [1, 1, 1, 1, 1], given: [1, 1, 1, 1, 1]},
    {cost: [0, 0, 0, 0, 0], given: [1, 1, 1, 1, 1]}
], [
    {cost: [18, 0, 0, 0, 0], given: [0, 0, 0, 1, 0]},
    {cost: [7, 7, 0, 0, 0], given: [1, 1, 1, 1, 1]},
    {cost: [6, 6, 1, 6, 0], given: [1, 1, 1, 0, 1]},
    {cost: [5, 1, 5, 5, 0], given: [1, 3, 1, 3, 1]},
    {cost: [4, 7, 0, 4, 4], given: [0, 1, 0, 0, 0]},
    {cost: [3, 3, 7, 3, 3], given: [3, 0, 0, 1, 1]},
    {cost: [2, 2, 2, 20, 2], given: [1, 1, 1, 1, 1]},
    {cost: [1, 1, 1, 1, 8], given: [1, 1, 1, 1, 1]},
    {cost: [0, 0, 0, 0, 0], given: [1, 1, 1, 1, 1]}
], [
    {cost: [1, 4, 0, 0, 0], given: [2, 1, 0, 0, 0]},
    {cost: [0, 0, 3, 1, 0], given: [0, 0, 0, 3, 0]},
    {cost: [0, 0, 0, 0, 1], given: [0, 1, 0, 0, 0]},
    {cost: [0, 0, 0, 6, 1], given: [0, 0, 0, 1, 5]},
    {cost: [4, 0, 0, 0, 0], given: [1, 0, 0, 0, 0]},
    {cost: [0, 0, 1, 0, 0], given: [0, 0, 1, 0, 0]},
    {cost: [0, 0, 0, 1, 0], given: [0, 0, 0, 1, 0]},
    {cost: [0, 1, 0, 0, 7], given: [0, 1, 0, 0, 0]},
    {cost: [5, 8, 0, 0, 0], given: [0, 0, 3, 0, 1]}
]
];

let branches;
let checks;

for (const inputItems of testCases) {
    branches = 1;
    checks = 0;

    const t1 = performance.now();
    const result = findOrder(inputItems);
    const t2 = performance.now();

    const validation = validate(result.assignedSP, inputItems);

    console.log(result, validation.indexOf(false) ? "valid!" : `invalid: ${validation}`);
    console.log("Elapsed:", t2 - t1, "branches:", branches, "checks:", checks);
}

function validate(assigned, items) {
    let modified = true;
    let usable = new Array(items.length).fill(false);
    let given = new Array(5).fill(0);
    while (modified) {
        modified = false;
        for (let i = 0; i < items.length; ++i) {
            if (usable[i]) {
                continue;
            }
            if (itemCanEquip(items[i], assigned, given)) {
                given = given.map((x, j) => x + items[i].given[j]);
                usable[i] = true;
                modified = true;
            }
        }
    }
    return usable;
}
