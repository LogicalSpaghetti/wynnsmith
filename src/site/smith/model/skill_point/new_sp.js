const arr = [];

function findOrder(items, index = 0, verify = true, usableArmor = new Array(items.length).fill(false),
                   order = [], assignedSP = [0, 0, 0, 0, 0], givenSP = [0, 0, 0, 0, 0], spCap = [150, 150, 150, 150, 150], spTotalFloor = [0, 0, 0, 0, 0]/*Ensures an item will never unequip after being equipped*/) {
    if (index >= items.length)
        return (verify) ? findOrder(items, 0, false, usableArmor, order, assignedSP, givenSP, spCap) : null;
    else if (index === 0) verify = false;

    if (usableArmor[index]) return findOrder(items, index + 1, verify, usableArmor, order, assignedSP, givenSP, spCap);

    const item = items[index];
    if (itemCanEquip(item, assignedSP, givenSP)) {
        order.push(index);
        if (order.length >= items.length) return {order, assignedSP}; // SUCCESS!
        verify = true;
        usableArmor[index] = true;
        givenSP = givenSP.map((x, i) => x + item.given[i]);
        return findOrder(items, index + 1, verify, usableArmor, order, assignedSP, givenSP, spCap);
    } else {
        // try equip
        const newAssign = assignedSP.map((x, i) => item.cost[i] > 0 ? Math.max(x, item.cost[i] - givenSP[i]) : x);
        const isWithinBounds = newAssign.reduce((withinBounds, x, i) => withinBounds && x <= spCap[i], true);
        let bestBranch = isWithinBounds ? findOrder(items, index, verify, [...usableArmor], [...order], newAssign, [...givenSP], [...spCap])
            : null;

        // try preventing equip
        const loweredCaps = item.cost.map((cost, i) => item.cost[i] <= 0 || item.cost[i] - assignedSP[i] - givenSP[i] <= 0 ? null :
            spCap.map((x, k) => k === i ? Math.max(0, Math.min(x, cost - givenSP[i] - 1)) : x))
            .filter(cap => cap != null)
            .filter((cap, i, arr) =>
                cap === arr.find((capB) => cap.join(",") === capB.join(",")));

        for (const newCap of loweredCaps) {
            branches++;
            if (null == newCap.find((x, i) => x !== spCap[i])) continue;
            const loweredCap = findOrder(items, index + 1, verify, [...usableArmor], [...order], [...assignedSP], [...givenSP], newCap);
            bestBranch = getLowestCap(bestBranch, loweredCap);

        }

        return bestBranch;
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
    console.log(arr);
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
