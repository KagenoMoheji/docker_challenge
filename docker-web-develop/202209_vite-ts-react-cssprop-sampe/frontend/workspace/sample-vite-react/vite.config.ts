import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import checker from "vite-plugin-checker";
import { visualizer } from "rollup-plugin-visualizer";
import macrosPlugin from "vite-plugin-babel-macros";

// https://vitejs.dev/config/
export default defineConfig(({command, mode, ssrBuild}) => {
  const IS_PROD = command === "build";
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            [
              // styled-componentのcss propはbabelによるトランスパイラ設定をしないと有効にならないので，ここで設定
              // https://github.com/styled-components/babel-plugin-styled-components/issues/350#issuecomment-979873241
              // https://styled-components.com/docs/tooling#babel-plugin
              // https://qiita.com/yanamura/items/7bd630a8dd56cbfa1f46
              "babel-plugin-styled-components",
              {
                displayName: true,
                fileName: false,
              },
            ]
          ],
        },
      }),
      checker({
        // https://nullnull.dev/blog/add-eslint-and-typescript-type-checking-into-vite/
        // https://zenn.dev/nozomi_iida/articles/vite_type_error
        typescript: true,
        eslint: {
          lintCommand: "eslint 'src/**/*.{ts,tsx}'", // アプリコードをmainディレクトリに移動させたら'src/**/*.{ts,tsx}'から'src/main/**/*.{ts,tsx}'に変更
          // dev: {
          //   logLevel: ["error"],
          // },
        },
      }),
      macrosPlugin(
        // 「Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/styled-components_macro.js?v=4112b8d2' does not provide an export named 'css'」というエラーを解消してstyled-componentのcss propを使えるために必要
        // https://github.com/styled-components/babel-plugin-styled-components/issues/350
      ),
    ],
    server: {
      host: true, // DockerのIPポートフォワーディングに必要 // `--host 0.0.0.0`と同等
      port: 8001, // Dockerのポートフォワーディングに合わせる // `--port 8001`と同等
      watch: { // developモードでのファイル変更に伴うリビルドを有効化
        // https://ja.vitejs.dev/config/server-options.html#server-watch
        usePolling: true, // WSL2使用の場合に必要
      },
    },
    resolve: {
      alias: {
        // コード上のimportパスを簡略化させる設定
        // tsconfig.jsonでの設定に合わせる
        // https://zenn.dev/k_u_0615/articles/34b7f7d4a79e52
        // https://chaika.hatenablog.com/entry/2022/05/14/083000
        "~": path.resolve(__dirname, "src/main"),
        "~~": path.resolve(__dirname, "src"),
        // "@": path.resolve(__dirname, "src/main"),
        // "@@": path.resolve(__dirname, "src"),
      },
    },
    root: process.cwd(), // index.htmlがある場所ということらしい．デフォはカレントディレクトリかな
    base: "/", // デフォは"/"．ReactRouterを使い始めたらこっちの絶対パスでビルドするべし． // ローカルファイルまたはLiveServerなどローカルサーバで開くときは"./"にする必要あり
    // publicDir: "public", // rootからの相対パス(たぶん)．デフォは"public"
    build: {
      outDir: "dist", // rootからの相対パス(たぶん)．デフォはdist
      minify: IS_PROD ? "terser" : "esbuild",
      terserOptions: IS_PROD ? {
        // この設定するときは`build.minify: terser`にしないといけないらしい
        // https://vitejs.dev/config/build-options.html#build-minify
        // https://terser.org/docs/api-reference#format-options
        output: {
          comments: IS_PROD ? false : true, // 機能してるか？？
        },
      } : undefined,
      rollupOptions: {
        plugins: ((isProd) => {
          let plugins = [];
          if (isProd) {
            plugins.push(
              visualizer({
                open: false,
                filename: "stats/treemap.html", // outDirからの相対パス
                gzipSize: true,
                brotliSize: true,
                emitFile: true,
              }
            ));
            plugins.push(
              visualizer({
                open: false,
                filename: "stats/network.html", // outDirからの相対パス
                gzipSize: true,
                brotliSize: true,
                emitFile: true,
                template: "network"
              }
            ));
            plugins.push(
              visualizer({
                open: false,
                filename: "stats/sunburst.html", // outDirからの相対パス
                gzipSize: true,
                brotliSize: true,
                emitFile: true,
                template: "sunburst"
              }
            ));
          }
          return plugins;
        })(IS_PROD)
      }
    }
  }
});
