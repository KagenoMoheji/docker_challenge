const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (isProd = false) => {
    return {
        entry: {
            "dist/bundle": path.join(__dirname, "src/main/Root.tsx"), // フロントエンドのビルドルート
        },
        output: {
            path: path.join(__dirname, "webpack_build"),
            filename: `[name]${(isProd ? "" : "_dev")}.js` // 開発用なら「_dev」が付く
        },
        resolve: {
            modules: ["node_modules"],
            extensions: [".js", ".ts", ".tsx"],
            alias: { // importの絶対パス化に必要
                "~": path.resolve(__dirname, "src/main"),
                "~~": path.resolve(__dirname, "src"),
                "@": path.resolve(__dirname, "src/main"),
                "@@": path.resolve(__dirname, "src")
            }
        },
        module: {
            rules: [
                { // tslintの代わりであるeslintのコーディング規則をbuildとwatchに適用
                    enforce: "pre",
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    loader: "eslint-loader"
                },
                {
                    exclude: /node_modules/,
                    test: /\.(ts|tsx)$/, // .tsx$
                    use: "ts-loader"
                },
                {
                    exclude: /node_modules/,
                    test: /\.(css|scss)$/,
                    use: [
                        {loader: "style-loader"},
                        {loader: "css-loader"},
                        {loader: "sass-loader"}
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "src/main/index.html",
                filename: "dist/index.html",
                minify: {
                    removeComments: isProd,
                    collapseWhitespace: isProd
                }
            })
        ]
    };
};