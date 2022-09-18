const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const StylelintPlugin = require("stylelint-webpack-plugin");

module.exports = {
    configureWebpack: {
        devServer: {
            watchOptions: {
                poll: true
            }
        },
        resolve: {
            alias: {
                // importのルートパスを指定
                // "~"でも良いが，静的(画像)ファイルのパス指定におけるプレフィクスの"~"とかぶってわかりにくそう．
                // "#"だと，静的ファイルの読み込みのパス指定ができなかった
                "@": path.resolve(__dirname, "src")
            }
        },
        plugins: [
            new BundleAnalyzerPlugin({
                // "$ npm run analyze"の設定
                analyzerMode: "static",
                reportFilename: "stats/app.html",
                statsFilename: "stats/stats.json",
                generateStatsFile: true,
                openAnalyzer: false,
                defaultSizes: "gzip",
                statsOptions: null,
                logLevel: "info"
            }),
            new StylelintPlugin({
                // https://webpack.js.org/plugins/stylelint-webpack-plugin/
                configFile: "./.stylelintrc.js",
                files: "src/**/*.{css,scss,vue}",
                fix: false
            }),
        ]
    }
};