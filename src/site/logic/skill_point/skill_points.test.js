import {testOptimizer} from "./verifier.js";
import {minimizeRequiredSP} from "./minimizer.js";
import {expect, test} from 'vitest';
import {WEOMinimizer} from "./weo_minimizer.js";

const testCases = [[
    {reqs: [8, 0, 0, 0, 0], given: [1, 1, 1, 1, 1]},
    {reqs: [7, 7, 0, 0, 0], given: [1, 1, 1, 1, 1]},
    {reqs: [6, 6, 6, 0, 0], given: [1, 1, 1, 1, 1]},
    {reqs: [5, 5, 5, 5, 0], given: [1, 1, 1, 1, 1]},
    {reqs: [4, 4, 4, 4, 4], given: [1, 1, 1, 1, 1]},
    {reqs: [3, 3, 3, 3, 3], given: [1, 1, 1, 1, 1]},
    {reqs: [2, 2, 2, 2, 2], given: [1, 1, 1, 1, 1]},
    {reqs: [1, 1, 1, 1, 1], given: [1, 1, 1, 1, 1]},
    {reqs: [0, 0, 0, 0, 0], given: [1, 1, 1, 1, 1]},
], [
    {reqs: [18, 0, 0, 0, 0], given: [0, 0, 0, 1, 0]},
    {reqs: [7, 7, 0, 0, 0], given: [1, 1, 1, 1, 1]},
    {reqs: [6, 6, 1, 6, 0], given: [1, 1, 1, 0, 1]},
    {reqs: [5, 1, 5, 5, 0], given: [1, 3, 1, 3, 1]},
    {reqs: [4, 7, 0, 4, 4], given: [0, 1, 0, 0, 0]},
    {reqs: [3, 3, 7, 3, 3], given: [3, 0, 0, 1, 1]},
    {reqs: [2, 2, 2, 20, 2], given: [1, 1, 1, 1, 1]},
    {reqs: [1, 1, 1, 1, 8], given: [1, 1, 1, 1, 1]},
    {reqs: [0, 0, 0, 0, 0], given: [1, 1, 1, 1, 1]},
], [
    {reqs: [1, 4, 0, 0, 0], given: [2, 1, 0, 0, 0]},
    {reqs: [0, 0, 3, 1, 0], given: [0, 0, 0, 3, 0]},
    {reqs: [0, 0, 0, 0, 1], given: [0, 1, 0, 0, 0]},
    {reqs: [0, 0, 0, 6, 1], given: [0, 0, 0, 1, 5]},
    {reqs: [4, 0, 0, 0, 0], given: [1, 0, 0, 0, 0]},
    {reqs: [0, 0, 1, 0, 0], given: [0, 0, 1, 0, 0]},
    {reqs: [0, 0, 0, 1, 0], given: [0, 0, 0, 1, 0]},
    {reqs: [0, 1, 0, 0, 7], given: [0, 1, 0, 0, 0]},
    {reqs: [5, 8, 0, 0, 0], given: [0, 0, 3, 0, 1]},
], [
    {reqs: [2, 0, 0, 0, 0], given: [0, -10, 0, 0, 0]},
    {reqs: [0, 2, 0, 0, 0], given: [0, 10, 0, 0, 0]},
], [
    {reqs: [0, 0, 0, 0, 60], given: [0, 20, 0, 0, 0]},
    {reqs: [40, 40, 0, 40, 40], given: [0, 0, -20, 0, 0]},
    {reqs: [0, 50, 0, 0, 50], given: [0, 0, -30, 8, 0]},
    {reqs: [40, 70, 0, 0, 0], given: [13, 0, -50, 0, 0]},
    {reqs: [0, 0, 0, 0, 0], given: [0, 0, 0, 0, 0]},
    {reqs: [0, 0, 0, 0, 0], given: [1, 1, 1, 1, 1]},
    {reqs: [0, 100, 0, 0, 0], given: [0, 60, 0, 0, 0]},
    {reqs: [0, 0, 0, 0, 0], given: [3, 3, 3, 3, 3]},
], [
    {reqs: [0, 0, 0, 0, 0], given: [-7, -7, -7, -7, -7]},
    {reqs: [0, 60, 0, 0, 60], given: [0, 12, 0, 0, 12]},
    {reqs: [0, 45, 0, 0, 55], given: [0, 0, 0, 0, 0]},
    {reqs: [40, 70, 0, 0, 0], given: [13, 0, -50, 0, 0]},
    {reqs: [55, 0, 0, 0, 55], given: [0, 3, 2, 3, 0]},
    {reqs: [0, 0, 0, 0, 0], given: [0, 0, 0, 0, 0]},
    {reqs: [0, 0, 0, 0, 0], given: [0, 0, 0, 0, 3]},
    {reqs: [0, 0, 0, 0, 20], given: [0, 5, 0, 0, 5]},
], [
    {reqs: [4, 0, 0, 0, 0], given: [10, 0, 0, 0, 0]},
    {reqs: [4, 0, 0, 0, 0], given: [10, 0, 0, 0, 0]},
    {reqs: [0, 0, 0, 0, 0], given: [-7, 0, 0, 0, 0]},
    {reqs: [0, 0, 0, 0, 0], given: [4, 0, 0, 0, 0]},
], [
    {reqs: [50, 0, 0, 0, 40], given: [9, 0, 0, 0, 8]}, // leggings
    {reqs: [75, 0, 0, 0, 0], given: [0, 0, 0, 0, 10]}, // chest
    {reqs: [50, 0, 0, 0, 0], given: [7, 0, 0, 0, -3]}, // bracelet
], [
    {reqs: [1, 0, 0, 0, 1], given: [1, 0, 0, 0, 1]}, // leggings
    {reqs: [3, 0, 0, 0, 0], given: [0, 0, 0, 0, 1]}, // chest
    {reqs: [1, 0, 0, 0, 0], given: [1, 0, 0, 0, -1]}, // bracelet
],
];

test('resting SP optimizers', () => {
    for (const inputItems of testCases) {
        expect(testOptimizer(minimizeRequiredSP, inputItems, true), JSON.stringify(inputItems)).toBe(true);
    }
});
