/*
@jest-environment jest-environment-jsdom

- Refs
  - 上の@がついているdocblockによるテスト環境の切り替えについて
    - https://jestjs.io/docs/configuration#testenvironment-string
  - `TypeError: expect(...).toBeInTheDocument is not a function`と言われたら
    - https://zenn.dev/naonao70/articles/26fa670a2ef31c
  - React x Jestのテストコードの書き方
    - https://reffect.co.jp/react/react-test
    - https://qiita.com/ossan-engineer/items/4757d7457fafd44d2d2f
  - `screen.debug()`の表示行数上限があるらしい．変えることはできる
    - https://stackoverflow.com/questions/59763739/react-testing-library-some-portion-of-debugs-output-is-not-visible
*/

// import {describe, expect, test} from "@jest/globals"; // これimportするとReact専用のテストモジュールが使えなくなるらしい
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "~/App";

describe("component", () => {
  test("component 'App'", () => {
    render(<App />);
    const el = screen.getByText(/Vite \+ React/i);

    screen.debug(el);
    expect(el).toBeInTheDocument();
  });
});
