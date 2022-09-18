module.exports = {
    root: true,
    env: {
        node: true,
        // 以下，追加
        // browser: true, // いるかな？
        // commonjs: true, // いるかな？
        es2020: true, // いるかな？
    },
    extends: [
        "plugin:vue/essential",
        "eslint:recommended",
        "@vue/prettier",
        // 以下，追加
        "plugin:prettier/recommended",
        "prettier",
    ],
    parserOptions: {
        parser: "babel-eslint",
        ecmaVersion: 2020, // いるかな？
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        // 以下，追加
        "no-empty-character-class": "error",
        "no-eval": ["error"],
        "no-trailing-spaces": ["error"],
        "no-unsafe-finally": "error",
        "no-whitespace-before-property": "error",
        "spaced-comment": ["error", "always"],
        "brace-style": ["warn", "1tbs"], // if-else等の改行記法
        "indent": ["error", 4, { "SwitchCase": 1 }], // switch文のインデントの取り方もここで指定
        "quotes": ["error", "double", { "avoidEscape": true }],
        "semi": ["error", "always"],
        "prettier/prettier": [
            "error",
            {
                "htmlWhitespaceSensitivity": "ignore", // HTMLタグで変な改行されるのを防ぐ
            }
        ],
    },
};
