const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (isProd = false) => {
    return {
        target: "node",
        entry: {
            "express/server": path.join(__dirname, "src/express/main/server.ts")
        },
        output: {
            path: path.join(__dirname, "dist/build"),
            filename: `[name]${(isProd ? "" : "_dev")}.js` // 開発用なら「_dev」が付く
        },
        resolve: {
            modules: ["node_modules"],
            extensions: [".js", ".ts", ".tsx"],
            alias: { // importの絶対パス化に必要
                // "~": path.resolve(__dirname, "src/main"),
                "~~": path.resolve(__dirname, "src"),
                "@express": path.resolve(__dirname, "src/express"),
                "@fastify": path.resolve(__dirname, "src/fastify"),
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
                    test: /\.(ts|tsx)$/,
                    use: "ts-loader"
                },
                // { // サーバサイドレンダリング未実施なのでひとまずコメントアウト
                //     exclude: /node_modules/,
                //     test: /\.(css|scss)$/,
                //     use: [
                //         {loader: "style-loader"},
                //         {
                //             loader: "css-loader",
                //             options: {
                //                 // modulesを指定しないと'import styles from "styles.scss"'でstylesがundefinedになってしまう
                //                 modules:
                //                     // true,
                //                     // "local",
                //                     {
                //                         // https://github.com/rails/webpacker/issues/2197
                //                         localIdentName: "[name]__[local]___[hash:base64:10]"
                //                     }
                //             }
                //         },
                //         {loader: "sass-loader"}
                //     ]
                // }
            ]
        },
        plugins: [
            // new HtmlWebpackPlugin({ // サーバサイドレンダリング未実施なのでひとまずコメントアウト
            //     template: "src/main/index.html",
            //     filename: "index.html",
            //     minify: {
            //         removeComments: isProd,
            //         collapseWhitespace: isProd
            //     }
            // }),
            // new StylelintPlugin({ // サーバサイドレンダリング未実施なのでひとまずコメントアウト
            //     // https://webpack.js.org/plugins/stylelint-webpack-plugin/
            //     configFile: ".stylelintrc.json",
            //     files: "src/**/*.scss",
            //     fix: false
            // }),
            /*
            以下，コンパイル結果の可視化
            - https://github.com/webpack-contrib/webpack-bundle-analyzer
            - https://levelup.gitconnected.com/webpack-bundle-analyzer-in-docker-c4d8a4d4f570
            - https://dwango-js.github.io/performance-handbook/startup/reduce-size/
            - https://qiita.com/kurosame/items/9e7092cdf08ff2ba7500#webpack-bundle-analyzer
            - https://recruit-tech.co.jp/blog/2018/12/15/try_optimization_webpack_bundle_size/
            */
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                reportFilename: "../stats/report.html", // [output][path]="dist/build"であるため，"dist/stats"にするために一つ上に戻る必要あり
                statsFilename: "../stats/stats.json", // [output][path]="dist/build"であるため，"dist/stats"にするために一つ上に戻る必要あり
                generateStatsFile: true,
                openAnalyzer: false,
                defaultSizes: "gzip",
                statsOptions: null,
                logLevel: "info"
            })
        ]
    };
};