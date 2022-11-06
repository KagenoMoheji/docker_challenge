/*
- Refs
  - https://github.com/stylelint/stylelint/issues/3128#issuecomment-357613641
*/
module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
  ],
  rules: {
    "no-duplicate-selectors": [true, { disallowInList: true }],
    "no-duplicate-at-import-rules": [true],
    "rule-empty-line-before": null,
    "declaration-empty-line-before": null,
    /*
    末尾の`--`も許容したかったのでケバブケースからパターン修正
    - Refs
      - https://stylelint.io/user-guide/rules/list/selector-class-pattern/
      - https://stylelint.io/user-guide/rules/regex/
    */
    "selector-class-pattern": "^([a-z][a-zA-Z0-9]*)(-[a-zA-Z0-9]+)*(--[a-zA-Z0-9]+)?$",
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          // 普通に`@import "tailwindcss/base";`とかすればこの設定必要無さそう
          "tailwind"
        ]
      }
    ],
  },
};
