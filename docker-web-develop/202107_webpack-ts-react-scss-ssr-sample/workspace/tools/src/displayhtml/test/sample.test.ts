import * as assert from "assert";
import { expect } from "chai";

describe("test add: ", () => {
    const increment = (n: number): number => n + 1;
    const testFunc = (n: number) => {
        let expected = n + 1;
        it(`increment(${n}) should be ${expected}`, () => {
            assert.strictEqual(increment(n), expected);
            // expect(increment(n)).to.equal(expected);
        });
    }
    for(let i = -10; i <=10; i++) {
        testFunc(i);
    }
});
