module.exports = {
  env: {
    browser: true,
    es2021: true,
    // 以下ユーザ定義
    node: true,
  },
  extends: [
    "plugin:react/recommended",
    "standard-with-typescript",
    // 以下ユーザ定義
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended", // 冗長かも 
    "plugin:@typescript-eslint/eslint-recommended", // 冗長かも 
    "prettier", // eslint-config-prettierのこと // prettierと競合したらprettier(.prettierrc.js？)を優先
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    // 以下ユーザ定義
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
    ecmaFeatures: {
      "jsx": true,
    }
  },
  plugins: [
    "react",
    // 以下ユーザ定義
    "@typescript-eslint",
    "react-hooks",
  ],
  rules: {
    // 以下ユーザ定義
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-empty-character-class": "error",
    "no-eval": ["error"],
    "no-trailing-spaces": ["error"],
    "no-unsafe-finally": "error",
    "no-whitespace-before-property": "error",
    "spaced-comment": [
      "error",
      "always",
      {
        // `vite.env.d.ts`で使われているTripleSlashReferenceで怒られないようにするため
        "markers": ["/"],
      },
    ],
    "brace-style": ["warn", "1tbs"],
    indent: [
      "warn",
      2,
      {
        SwitchCase: 1,
      },
    ],
    quotes: [
      "error",
      "double",
      {
        avoidEscape: true,
      },
    ],
    semi: ["error", "always"],
    "@typescript-eslint/no-inferrable-types": "warn", // 自明な型アノテーションの除去については警告に留める
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"], // 厳密に検討してないが…
    "react/react-in-jsx-scope": "off", // `import react from "React"`の省略を禁じるか
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/triple-slash-reference": "off", // `vite.env.d.ts`で怒られないようにするため
    "react/no-unknown-property": [
      "error",
      {
        // コンポーネントのタグにおけるcssプロパティに対し「Unknown property 'css' found」というエラーが出ることを避けるため
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md#rule-options
        ignore: ["css"],
      },
    ],
    "object-shorthand": ["warn", "never"], // 連想配列のキーの省略はしないようにしよう
    "@typescript-eslint/type-annotation-spacing": [ // 型の前にスペース入れよう
      "error",
      {
        "before": false,
        "after": true,
        "overrides": {
          arrow: { // アロー関数のアローの前後はスペース入れよう
            before: true,
            after: true
          }
        },
      }
    ],
  },
  ignorePatterns: [
    // VSCodeによるアプリに関係ないコード(設定用など)の静的解析を無視させるために必要
    // `.eslintignore`と同等のようだが，ファイル数減らすため一旦こちらで設定
    "*.config.ts",
    "*.config.js",
    "*.cjs",
    "**/build/",
    "**/public/",
    "**/node_modules/",
    "**/*.escapeCheck/", // lintしたくないコードを置く場所
    // "**/*.mdx", // Storybook用
    "**/done_*", // 実施し終わったテストコードも一旦無視
  ],
  settings: {
    react: {
      // 「Warning: React version not specified in eslint-plugin-react settings.」非表示のため
      version: "detect"
    }
  },
  // overrides: [
  //   // {
  //   //   // Storybook用
  //   //   // https://zenn.dev/longbridge/articles/13e65ef71455e4#eslint-%E3%81%AE%E8%A8%AD%E5%AE%9A
  //   //   files: [
  //   //     "**/*.stories.(js|jsx|ts|tsx)",
  //   //   ],
  //   //   extends: [
  //   //     "plugin:storybook/recommended",
  //   //   ],
  //   //   // rules: {}
  //   // },
  // ],
};
