import {expect, test} from "vitest";
import {Powder, Powders} from "./powders.ts";
import {BitReader} from "../../common/numbers.ts";

test("powders", () => {
    const powderTestCases = [
        "000",
        "001",
        "010",
        "011",
        "100",
        "101000010",
    ];
    for (const test of powderTestCases)
        expect(Powder.fromBinary(new BitReader(test, false)).toBinary()).toEqual(test);

    const testCases = [
        "0",
        "100100",
        "1001101010100",
        "100110101010110110000000",
    ];
    for (const test of testCases)
        expect(Powders.fromBinary(new BitReader(test, false)).toBinary()).equals(test);
});