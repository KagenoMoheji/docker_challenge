/*
- Refs
  - https://zenn.dev/ciffelia/articles/a42434cd8c1abc
  - https://b.0218.jp/202111152315.html
*/
const common = require("./.stylelintrc.common.cjs");

module.exports = {
  ...common,
  overrides: [
    {
      customSyntax: "@stylelint/postcss-css-in-js",
      files: [
        "src/**/*.{jsx,tsx}", // css,scss,
      ],
      rules: {
        "no-empty-first-line": null,
        "value-keyword-case": null,
        // "function-no-unknown": null,
        // "function-name-case": null,
      },
    },
  ],
};
