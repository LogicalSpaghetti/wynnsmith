import permuteOrders from "../../../common/permutation.js";

// TODO: set bonuses

let validations;
let checks;

export function testOptimizer(solverFunction, testCases) {
    for (const inputItems of testCases) {
        validations = 0;
        checks = 0;

        const t1 = performance.now();
        const result = solverFunction(inputItems);
        const t2 = performance.now();
        const resultChecks = checks;
        const resultValidations = validations;

        const valid = properValidate(result.assignedSP, inputItems);

        console.log(result, valid ?? "Invalid ");
        console.log("Elapsed: (ms)", t2 - t1, "validations:", resultValidations, "checks:", resultChecks);
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

let given = new Int16Array(5);


// TODO: Set Bonuses
export function wynnValidate(assigned, items) {
    validations++;
    let modified = true;
    let usable = new Array(items.length).fill(false);
    given.fill(0);
    while (modified) {
        modified = false;
        for (let i = 0; i < items.length; ++i) {
            if (usable[i]) continue;

            if (itemCanEquip(items[i], assigned, given)) {
                for (let j = 0; j < 5; j++)
                    given[j] += items[i].given[j];
                usable[i] = true;
                modified = true;
            }
        }
    }

    if (usable.includes(false)) return false;

    for (let i = 0; i < items.length; i++)
        if (!itemCanEquip(items[i], assigned, given.map((x, j) => x - items[i].given[j])))
            return false;

    return true;
}

export function itemCanEquip(item, assignedSP, givenSP) {
    checks++;
    for (let i = 0; i < item.cost.length; i++)
        if (item.cost[i] > 0 && item.cost[i] - assignedSP[i] - givenSP[i] > 0) return false;
    return true;
}
