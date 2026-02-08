import {expect, test} from "vitest";
import {BitReader} from "./numbers.ts";

test("binary", () => {
    const str = "01010100"
    const binary = new BitReader(str, false)
    expect(binary.readFlag()).toEqual(false)
    expect(binary.previewBits(3)).toEqual("101")
    expect(binary.readNumberByMaximum(7)).toEqual(5)
    expect(binary.readBits(3)).toEqual("010")
    expect(binary.bitsRemaining()).toEqual(1)
    expect(binary.previewRemainingBits()).toEqual("0")
    binary.reset()
    expect(binary.readBits(8)).toEqual(str)
    expect(binary.toString()).toEqual(str)
})