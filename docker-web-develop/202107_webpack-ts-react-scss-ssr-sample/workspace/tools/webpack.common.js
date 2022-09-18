const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (isProd = false) => {
    return {
        entry: {
            "displayhtml/displayhtml": path.join(__dirname, "src/displayhtml/main/displayHtml.ts"),
        },
        output: {
            path: path.join(__dirname, "dist/build"),
            filename: `[name]${(isProd ? "" : "_dev")}.js` // 開発用なら「_dev」が付く
        },
        target: "node", // 今回はBrowser用JSではなくクライアントNodeJSで動かすのでこれ使って"fs"の問題解消しても問題無さそう．
        resolve: {
            modules: ["node_modules"],
            extensions: [".js", ".ts"],
            alias: { // importの絶対パス化に必要
                // "~": path.resolve(__dirname, "src/main"),
                "~~": path.resolve(__dirname, "./src"),
                // "@": path.resolve(__dirname, "src/main"),
                "@@": path.resolve(__dirname, "./src")
            }
        },
        module: {
            rules: [
                { // tslintの代わりであるeslintのコーディング規則をbuildとwatchに適用
                    enforce: "pre",
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    loader: "eslint-loader"
                },
                {
                    exclude: /node_modules/,
                    test: /\.ts$/, // .tsx$
                    use: "ts-loader"
                }
            ]
        },
        plugins: [
            // 以下，コンパイル結果の可視化
            // https://github.com/webpack-contrib/webpack-bundle-analyzer
            // https://levelup.gitconnected.com/webpack-bundle-analyzer-in-docker-c4d8a4d4f570
            // https://dwango-js.github.io/performance-handbook/startup/reduce-size/
            // https://qiita.com/kurosame/items/9e7092cdf08ff2ba7500#webpack-bundle-analyzer
            // https://recruit-tech.co.jp/blog/2018/12/15/try_optimization_webpack_bundle_size/
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                reportFilename: "./../stats/report.html", // [output][path]="dist/build"であるため，"dist/stats"にするために一つ上に戻る必要あり
                statsFilename: "./../stats/stats.json", // [output][path]="dist/build"であるため，"dist/stats"にするために一つ上に戻る必要あり
                generateStatsFile: true,
                openAnalyzer: false,
                defaultSizes: "gzip",
                statsOptions: null,
                logLevel: "info"
            })
        ]
    };
};