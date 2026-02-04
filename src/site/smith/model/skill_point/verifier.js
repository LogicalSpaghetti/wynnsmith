import permuteOrders from "../../../common/permutation.js";
import {sp_indexes} from "./skill_points.js";
import {minimizeRequiredSP} from "./minimizer.js";
import {WEOMinimizer} from "./weo_minimizer.js";

let validations;
let checks;
let branches = 0;

export function increaseBranchCount() {
    branches++;
    return branches;
}

export function testOptimizer(solverFunction, testCases, verifyOptimal = true) {
    console.log(`Testing optimizer function: ${solverFunction.name} ${verifyOptimal ? "and comparing against exact results" : ""}`);
    for (const inputItems of testCases) {
        checks = 0;
        branches = 0;

        const t1 = performance.now();
        const result = solverFunction(inputItems);
        const t2 = performance.now();
        // console.log(result.assignedSP)

        const valid = properValidate(result.assignedSP, inputItems);
        const softValid = wynnValidate(result.assignedSP, inputItems);

        if (valid) {
            if (verifyOptimal) {
                const minimumAssigned = minimizeRequiredSP(inputItems).assignedSP;
                const trueMinimum = minimumAssigned.reduce((a, b) => a + b);
                const resultMinimum = result.assignedSP.reduce((a, b) => a + b);
                if (resultMinimum < trueMinimum)
                    console.log(`Error! function "${solverFunction.name}" somehow found a solution better than the perfect optimizer!`);
                else if (resultMinimum > trueMinimum)
                    console.log(`Failure! Generated ${JSON.stringify(result.assignedSP)} (${resultMinimum}) when the optimal result is ${JSON.stringify(minimumAssigned)} (${trueMinimum})`);
            }
            console.log("Success", "Elapsed: (ms)", t2 - t1, "branches:", branches);
        } else if (softValid) {
            if (verifyOptimal) {
                const minimalWEO = WEOMinimizer(inputItems).assignedSP;
                const minimumTotal = minimalWEO.reduce((a, b) => a + b);
                const resultMinimum = result.assignedSP.reduce((a, b) => a + b);
                if (resultMinimum < minimumTotal)
                    console.log(`Error! function "${solverFunction.name}" somehow found a WEO solution better than the perfect WEO!`);
                else if (resultMinimum > minimumTotal)
                    console.log(`Failure! Generated ${JSON.stringify(result.assignedSP)} (${resultMinimum}) when the optimal WEO is ${JSON.stringify(minimalWEO)} (${minimumTotal})`);
            }
            console.log(`Invalid, Passes WEO`);
        } else
            console.log(`Failure for function "${solverFunction.name}", assigned SP:`, result.assignedSP);
    }
}

export function properValidate(assigned, items) {
    let order;

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
        if (!itemCanEquip(items[i], assigned, given, true))
            return false;

    return true;
}

export function itemCanEquip(item, assignedSP, givenSP, subtractItemSP = false) {
    checks++;
    for (let i = 0; i < sp_indexes; i++)
        if (item.reqs[i] > 0 && item.reqs[i] > assignedSP[i] + givenSP[i] - (subtractItemSP ? item.given[i] : 0)) return false;
    return true;
}
