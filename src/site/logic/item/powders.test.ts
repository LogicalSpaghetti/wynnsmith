import {expect, test} from "vitest";
import {Powder, Powders} from "./powders.ts";
import {BitReader} from "../../common/numbers.ts";

test("powders", () => {
    expect(new Powder("f", 5).equals(new Powder("f", 5))).toEqual(true)
    expect(new Powder("f", 0).equals(new Powder("f", 5))).toEqual(false)
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
    expect(Powders.fromString("").toString()).toEqual("")
    expect(Powders.fromString("b2").toString()).toEqual("")
    expect(Powders.fromString("f6").toString()).toEqual("f6")
});