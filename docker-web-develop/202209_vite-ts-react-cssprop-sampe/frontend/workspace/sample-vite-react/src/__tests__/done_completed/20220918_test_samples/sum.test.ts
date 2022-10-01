/*
@jest-environment node

- Refs
  - https://zenn.dev/tentel/books/08b63492b00f0a/viewer/27c963
*/

import {describe, expect, test} from "@jest/globals";
// WARNING: 「Cannot find module」と出るのは，tsconfig.jsonで`**/done_*/`下にあるtypescriptコードを設定適用の範囲外にしてるから．
import {sum} from "~~/sample/ts/funcs";

describe("sum module", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
