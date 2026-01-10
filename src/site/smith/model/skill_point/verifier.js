import permuteOrders from "../../../common/permutation.js";

// TODO: set bonuses

export let branches;
let checks;

export function testOptimizer(solverFunction, testCases) {
    for (const inputItems of testCases) {
        branches = 1;
        checks = 0;

        const t1 = performance.now();
        const result = solverFunction(inputItems);
        const t2 = performance.now();

        const valid = properValidate(result.assignedSP, inputItems);

        console.log(result, valid);
        console.log("Elapsed:", t2 - t1, "branches:", branches, "checks:", checks);
    }
}

export function properValidate(assigned, items) {
    let order = false;

    function tryOrder(orderedIndexes) {
        if (order) return;
        for (let i = 0; i < orderedIndexes.length; i++) {
            const equippedItems = items.filter((x, j) => orderedIndexes.indexOf(j) <= i);
            if (!wynnValidate(assigned, equippedItems)) return;
        }
        order = [...orderedIndexes];
    }

    // calls tryOrder with every possible ordering of 0 through items.length
    permuteOrders(items.length, items.length, tryOrder);

    return order;
}

export function wynnValidate(assigned, items) {
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

    modified = true;
    while (modified) {
        modified = false;
        for (let i = 0; i < items.length; i++) {
            if (usable[i] && !itemCanEquip(items[i], assigned, given)) {
                modified = true;
                usable[i] = false;
                given = given.map((x, j) => x - items[i].given[j]);
            }
        }
    }

    return !(usable.includes(false));
}

export function itemCanEquip(item, assignedSP, givenSP) {
    checks++;
    for (let i = 0; i < item.cost.length; i++)
        if (item.cost[i] > 0 && item.cost[i] - assignedSP[i] - givenSP[i] > 0) return false;
    return true;
}