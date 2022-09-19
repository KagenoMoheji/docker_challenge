# Dockerコンテナ上でのフロントエンド開発の仕方

### 構成
```
├ {プロジェクト名(リポジトリ名)}/
    ├ docker-compose.yml
    ├ .env
    ├ docker/
        ├ dev_frontend/
            ├ Dockerfile
    ├ workspace/
        ├ [開発する場所]
```

##### もへじ構想
```
├ frontend/workspace/
    ├ sample-app/ [Vueとかへの技術変更やアプリ追加するときはここのレベルでディレクトリ切る]
        ├ package.json
        ├ tsconfig.jsonとか設定
        ├ node_modules/
        ├ src
            ├ main/
                ├ index.html
                ├ App.tsx
                ├ components/
                    ├ atoms/
                    ├ molecules/
                    ├ organisms/
                    ├ templates/
                    ├ pages/
                ├ middlewares/
                ├ routes/
                ├ store/ [Reduxの考え方]
                    ├ <状態名>/
                        ├ state.ts
                        ├ reducer.ts
                        ├ action.ts
                ├ api/
                ├ utils/ [自作の汎用関数とかの実装]
                ├ consts/ [設定値とかの定数の実装]
                ├ styles/
                ├ types/
                ├ assets/
            ├ __tests__/
                ├ [Jestによるテストコードをここで実装]
            ├ mock_graphql/
                ├ [mainの本体コードにモックサーバのコードははいらないので，ここで分かれるイメージある．ここでGraphQLのモックコード作って，package.jsonでサーバ起動]
        ├ public/
        ├ dist/ [ここに出力したものをバックエンドコードに移管]
        ├ outputs/
```


### Dockerコンテナの使い方
1. `{プロジェクト名(リポジトリ名)}/.env`の下記設定を必要あれば変更
    - `SHARED_WORKSPACE_HOST`
        - コンテナがマウントするホスト側のディレクトリ．
        - 基本的に変更しないこと．
    - `SHARED_WORKSPACE_CONTAINER`
        - マウントするコンテナ側のディレクトリ．
        - 基本的に変更しないこと．
    - `APPNAME`
        - PJまたはアプリ名．
        - Dockerイメージ名やコンテナ名にも反映される．
    - `NODE_VERSION`
        - NodeJSのバージョン
        - 基本的にStable版に合わせたい
1. 下記コマンドでコンテナ起動し，コンテナ(のターミナル)に入る<span id="docker-compose-up"></span>
    ```
    cd {プロジェクト名(リポジトリ名)}/
    docker-compose up -d
    docker exec -it {2.のAPPNAMEで指定した文字列} bash
    ```
    - ~~コンテナビルドが遅い場合は，`node_modules`や出力物のような巨大なコピーが発生している可能性あり．削除してからコンテナビルドすること．~~
        - `.dockerignore`に記載することで問題解消した．
1. NodeJSのコマンドの動作確認
    ```
    node --version
    npm --version
    npx --version
    ```
- コンテナ停止は下記コマンド
    ```
    docker-compose stop
    ```
- コンテナ再始動は下記コマンド
    ```
    docker-compose start
    ```
    - ただしコンテナに必要なnetworkやvolumeが削除されたなどすると起動できないので，[`docker-compose up -d`](#docker-compose-up)を再度やる必要あり．  
    この時はDB系コンテナのデータも初期化される．
- コンテナ削除は下記コマンド
    ```
    docker-compose down
    docker rmi {2.のAPPNAMEで指定した文字列}
    ```
    - Dockerコンテナの削除が難しい場合はdockerコマンドで個別に削除する．
        ```
        docker rm {コンテナ名|コンテナID}
        ```

### NodeJS(Vite&TypeScript&React)のアプリディレクトリ作成
1. Viteアプリディレクトリ未作成の場合は，(Dockerコンテナ上で)アプリディレクトリを作成する場所に移動して新規構築を進める．  
Viteアプリディレクトリ作成済みの場合は2.に進む．
    1. 下記コマンドを実行．
        ```
        cd ({プロジェクト名(リポジトリ名)}/)workspace
        npm create vite@latest {アプリ名} -- --template react-ts
        ```
        - `react-ts`というテンプレートについて，他の例は[公式](https://github.com/vitejs/vite/tree/main/packages/create-vite)を参照．
        - npmではなくyarnでやる場合は`yarn create vite {アプリ名} --template react-ts`．
        - もし`create-vite: Permission denied`とエラーが出る場合は一回nodeユーザに切り替えてダミーのアプリディレクトリを作る必要あるかも．
            ```
            su node
            npm create vite@latest dummy
            exit
            npm create vite@latest {アプリ名} --template react-ts
            rm -r ./dummy
            ```
    1. アプリディレクトリに移動し，依存ライブラリをインストール
        ```
        cd {アプリ名}
        npm install
        ```
    1. 開発モードでトランスパイルの動作確認
        ```
        npm run dev -- --host 0.0.0.0 --port 8001
        ```
    1. Viteアプリのデフォ依存ライブラリに無かった依存ライブラリを手動インストール
        ```
        cd {アプリ名}
        npm install (--save-dev) {ライブラリ名}
        ```
        - TypeScript型系：@types/node，ts-node
        - Reactライブラリ：react-router-dom，redux
        - ビルド系：後述
        - 静的解析系：後述
        - テスト系：後述
        - 装飾系：後述
        - その他：axios
    1. ビルドに関する設定
        1. `tsconfig.json`
            ```
            {
                "compilerOptions": {
                    "target": "ESNext",
                    "useDefineForClassFields": true,
                    "lib": [
                        "DOM",
                        "DOM.Iterable",
                        "ESNext"
                    ],
                    "allowJs": false,
                    "skipLibCheck": true,
                    "esModuleInterop": false,
                    "allowSyntheticDefaultImports": true,
                    "strict": true, // https://qiita.com/kyntk/items/9c596306495aef06dbc0
                    "forceConsistentCasingInFileNames": true,
                    "module": "ESNext",
                    "moduleResolution": "Node",
                    "resolveJsonModule": true,
                    "isolatedModules": true,
                    "noEmit": true,
                    "jsx": "react-jsx",
                    // 以上が`npm create vite@latest`によるデフォで，以下がユーザ定義
                    "baseUrl": ".", // 後述のpathsの開始位置
                    "paths": { // コード上のimportパスを簡略化させる設定
                        // 厳密にはimportパスの解決はtsconfig.jsonではなくビルダーの設定ファイルの方が対応してる．
                        //// https://www.agent-grow.com/self20percent/2019/03/11/typescript-paths-work-careful/
                        "~\/*": [
                            "./src/main/*"
                        ],
                        "~~\/*": [
                            "./src/*"
                        ],
                        // "@\/*": ["./src/main/*"],
                        // "@@\/*": ["./src/*"],
                    },
                    "outDir": "./dist", // トランスパイル結果の出力先
                    "removeComments": true, // トランスパイル時にコメントアウトを消すか
                    "noImplicitAny": true, // 暗黙的なany型を禁ずるか
                    "noImplicitThis": true, // any型のthisを禁ずるか
                    "strictNullChecks": true, // 非null/undefined型へのnull/undefinedの代入を禁ずるか
                    "strictFunctionTypes": true, // 関数の引数型を厳密にチェックするか．ただしメソッドはその限りでないらしい．
                    "strictPropertyInitialization": true, // クラスプロパティの初期化を必須にするか
                    "noImplicitReturns": true, // 戻り値の型適用を厳密にチェックするか
                    "noUnusedLocals": true, // 未使用のローカル変数を禁ずるか
                    "noUnusedParameters": true, // 未使用の引数を禁ずるか
                    "exactOptionalPropertyTypes": true, // オプショナルプロパティへのundefinedの代入を禁ずるか
                    "noFallthroughCasesInSwitch": true, // case文で処理が空でない時のbreakを必須とするか
                    // "typeRoots": [ // 設定しなくても動いたのでコメントアウトしたままにしとく
                    //   "node_modules/@types",
                    //   "src/main/types"
                    // ],
                },
                "include": [
                    // "src" // デフォだが，一旦コメントアウト
                    // 以上が`npm create vite@latest`によるデフォで，以下がユーザ定義
                    // importパスの簡略化について下記設定も必要らしい
                    "./src/**/*.ts",
                    "./src/**/*.tsx",
                ],
                "exclude": [ // 上記チェックを適用しない場所
                    "node_modules",
                    "**/*.escapeCheck",
                ],
                "references": [
                    {
                        "path": "./tsconfig.node.json"
                    }
                ]
            }
            ```
        1. 下記ライブラリをインストール
            ```
            npm install --save-dev \
                rollup-plugin-visualizer \
                terser
            ```
        1. `vite.config.ts`
            ```
            import { defineConfig } from "vite";
            import react from "@vitejs/plugin-react";
            import * as path from "path";
            import { visualizer } from "rollup-plugin-visualizer";

            // https://vitejs.dev/config/
            export default defineConfig(({ command, mode, ssrBuild }) => {
                const IS_PROD = command === "build";
                return {
                    plugins: [
                        react(),
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
                        alias: { // コード上のimportパスを簡略化させる設定
                            // https://zenn.dev/k_u_0615/articles/34b7f7d4a79e52
                            // https://chaika.hatenablog.com/entry/2022/05/14/083000
                            "~": path.resolve(__dirname, "src/main"),
                            "~~": path.resolve(__dirname, "src"),
                            // "@": path.resolve(__dirname, "src/main"),
                            // "@@": path.resolve(__dirname, "src"),
                        },
                    },
                    root: process.cwd(), // index.htmlがある場所ということらしい．デフォはカレントディレクトリかな
                    base: "./", // デフォは"/" // ローカルファイルまたはLiveServerなどローカルサーバで開くときは"./"にする必要あり
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
            ```
        1. `npm run build`してプラグインによるファイル出力がされるか確認
    1. 静的解析の設定
        1. 下記ライブラリをインストール
            ```
            npm install --save-dev \
                eslint \
                prettier \
                eslint-config-pettier \
                vite-plugin-checker \
                eslint-plugin-react-hooks
                // @typescript-eslint/eslint-plugin \ // eslintの初期設定作成時に入れられるはず
                // eslint-config-standard-with-typescript \ // eslintの初期設定作成時に入れられるはず
                // eslint-plugin-import \ // eslintの初期設定作成時に入れられるはず
                // eslint-plugin-n \ // eslintの初期設定作成時に入れられるはず
                // eslint-plugin-promise \ // eslintの初期設定作成時に入れられるはず
                // eslint-plugin-react \ // eslintの初期設定作成時に入れられるはず
            ```
        1. eslint
            1. `package.json`(・`vite.config.js`)と同じ場所で下記コマンドで設定ファイル作成
                ```
                npm create @eslint/config
                ```
                - `npm create vite@latest`と同じく，Docker上での最初の使用時はnodeユーザで実行しないといけないかも
                - How would you like to use ESLint?: To check syntax, find problems, and enforce code style
                - What type of modules does your project use?: JavaScript modules (import/export)
                - Which framework does your project use?: React
                - Does your project use TypeScript?: Yes
                - Where does your code run?: Browser
                    - NextJSとかのときがたぶんNode
                - How would you like to define a style for your project?: Use a popular style guide(適当)
                - Which style guide do you want to follow?: Standard: https://github.com/standard/eslint-config-standard-with-typescript(適当)
                - What format do you want your config file to be in?: JavaScript
                - Would you like to install them now?: Yes
                    - `eslint-plugin-react@latest eslint-config-standard-with-typescript@latest @typescript-eslint/eslint-plugin@^5.0.0 eslint@^8.0.1 eslint-plugin-import@^2.25.2 eslint-plugin-n@^15.0.0 eslint-plugin-promise@^6.0.0 typescript@*`
                - Which package manager do you want to use?: npm
                - 拡張子`cjs`でファイルが作られるが，`import/export`が使えるために仕方ないもののようだ
            2. 設定ファイル`.eslintrc.js`を下記内容にする
                ```
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
                        quotes: ["error", "double", { avoidEscape: true }],
                        semi: ["error", "always"],
                        "@typescript-eslint/no-inferrable-types": "warn", // 自明な型アノテーションの除去については警告に留める
                        "@typescript-eslint/no-empty-interface": "warn",
                        "@typescript-eslint/consistent-type-definitions": ["error", "type"], // 厳密に検討してないが…
                        "react/react-in-jsx-scope": "off", // `import react from "React"`の省略を禁じるか
                        "react-hooks/rules-of-hooks": "error",
                        "react-hooks/exhaustive-deps": "warn",
                        "@typescript-eslint/triple-slash-reference": "off", // `vite.env.d.ts`で怒られないようにするため
                    },
                    ignorePatterns: [
                        // VSCodeによるアプリに関係ないコード(設定用など)の静的解析を無視させるために必要
                        // `.eslintignore`と同等のようだが，ファイル数減らすため一旦こちらで設定
                        "*.config.ts",
                        "*.cjs",
                        "**/build/",
                        "**/public/",
                        "**/node_modules/",
                        "**/*.ignoreLint/", // lintしたくないコードを置く場所
                    ],
                    settings: {
                        react: {
                            // 「Warning: React version not specified in eslint-plugin-react settings.」非表示のため
                            version: "detect"
                        }
                    }
                };
                ```
        1. prettier
            1. `package.json`(・`vite.config.js`)と同じ場所に`.prettierrc.js`をファイル作成
            2. 下記内容にする
                ```
                module.exports = {
                    tabWidth: 2,
                    tabs: true,
                    singleQuote: true,
                    semi: true,
                    // https://takeda-san.hatenablog.com/entry/2019/09/08/231123
                    htmlWhitespaceSensitivity: "ignore",
                };
                ```
        1. 静的解析に関する簡略コマンドを`package.json`で追加
            ```
            "scripts": {
                ...,
                "lint:eslint": "eslint 'src/**/*.{ts,tsx}'",
                "fix:eslint": "eslint --fix",
                "fix:prettier": "prettier --write",
            },
            ```
        1. Viteのビルド時に毎回静的解析が走るよう`vite.config.ts`に下記設定を追加
            ```
            ... // 他import
            import checker from "vite-plugin-checker";

            export default defineConfig(({command, mode, ssrBuild}) => {
                ...
                return {
                    plugins: [
                        ...,
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
                    ],
                    ...
                };
            };
            ```
        1. `npm run dev`して動作確認
            - ただ静的解析が遅い…
            - 静的解析で怒られたとこは直してく
    1. テスト環境構築
        1. 下記ライブラリをインストール
            ```
            npm install --save-dev \
                jest \
                ts-jest \
                @types/jest \
                jest-environment-jsdom \
                @testing-library/jest-dom \
                @testing-library/react \
                @testing-library/user-event
            ```
        1. デフォで作られたコードを`src/main/`に移動させ，`src/test/`を作成
            - 移動後させた場合`index.html`におけるscriptsの読み込みするパスの修正が必要
        1. 下記コマンドでJestの設定ファイルを作成
            ```
            npx jest --init
            ```
            - Would you like to use Jest when running "test" script in "package.json"?: Y
            - Would you like to use Typescript for the configuration file?: y
            - Choose the test environment that will be used for testing: node
            - Do you want Jest to add coverage reports?: N
            - Which provider should be used to instrument code for coverage?: v8
            - Automatically clear mock calls, instances, contexts and results before every test?: y
        1. `jest.config.ts`の内容を書き換え
            ```
            /*
            *  For a detailed explanation regarding each configuration property and type check, visit:
            *  https://jestjs.io/docs/configuration
            * 
            *  - MEMO
            *    - 「Your test suite must contain at least one test.」と出たら
            *      - jest.config.ts["testMath"]で設定したテストコードを置く場所に，テストを一切書いていないモジュールを置いていないか確認
            *  - Refs
            *    - https://stackoverflow.com/a/63627142/15842506
            *    - https://reffect.co.jp/react/react-test
            */
            import type { Config } from "jest";
            import { defaults } from "jest-config";

            const config: Config = {
                // Automatically clear mock calls, instances, contexts and results before every test
                clearMocks: false,

                // The directory where Jest should output its coverage files
                coverageDirectory: "<rootDir>/outputs/.jest/coverage",

                // Indicates which provider should be used to instrument code for coverage
                coverageProvider: "v8",

                // An array of file extensions your modules use
                moduleFileExtensions: [
                    "js",
                    "jsx",
                    "ts",
                    "tsx",
                    "json",
                    "node",
                ],

                // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
                /*
                - MEMO
                - vite.config.ts["resolve.alias"]やtsconfig.json["compilerOptions.paths"]に合わせる
                    - https://zenn.dev/link/comments/7cac8e58c1300c
                */
                moduleNameMapper: {
                    "^~/(.+)": "<rootDir>/src/main/$1",
                    "^~~/(.+)": "<rootDir>/src/$1",
                },

                // A preset that is used as a base for Jest's configuration
                /*
                - MEMO
                - TypeScriptに対してJestが機能する設定を組み込んでくれるっぽい
                    - https://blog.ojisan.io/ts-jest/
                */
                preset: "ts-jest",

                // A list of paths to directories that Jest should use to search for files in
                roots: [
                    "<rootDir>/src"
                ],

                // The test environment that will be used for testing
                /*
                - MEMO
                - テスト環境の切り替えはdocblockをテストコード先頭に記載することで行うこととする
                    - https://jestjs.io/docs/configuration#testenvironment-string
                - Jest v28以上は`jest-environment-jsdom`を別途インストールしないといけなくなったらしい
                    - https://zenn.dev/keita_hino/articles/488d31e8c4a240#jsdom%E3%81%8C%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%81%A7%E3%81%AF%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%95%E3%82%8C%E3%81%AA%E3%81%8F%E3%81%AA%E3%81%A3%E3%81%9F
                */
                testEnvironment: "node",

                // The glob patterns Jest uses to detect test files
                testMatch: [
                    "**/__tests__/targets/**/*.[jt]s?(x)",
                ],

                // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
                // testPathIgnorePatterns: [
                //   "/node_modules/"
                // ],
                testPathIgnorePatterns: [
                    ...defaults.testPathIgnorePatterns,
                ],

                // A map from regular expressions to paths to transformers
                /*
                - MEMO
                - SVGやCSSをReactコンポーネントとしてテストできるようにする方法
                    - https://zenn.dev/link/comments/c340340ee8571d
                */
                transform: {
                    "^.+\\.svg$": "<rootDir>/.jest/transformSvg.cjs",
                    "^.+\\.(css|scss)$": "<rootDir>/.jest/transformStyle.cjs",
                },
            };

            export default config;
            ```
        1. 静的解析をトランスパイル前に実行するように`package.json["scripts"]`を変更
            ```
            "scripts": {
                ...,
                "test": "npm run lint:eslint && jest",
                "test:coverage": "npm run lint:eslint && jest test --coverage"
            },
            ```
        1. 合計値を求めるテストコードや`App.tsx`に特定の文字列が存在するテストコードを書いて，`npm run test`してみる
        1. svgやstyle(css/scss等)をimportしているReactコンポーネントのテストしようとしている場合は下記対応も必要
            - svgに関する対応
                1. `{アプリ名}/__jest__/transformSvg.cjs`を作成して下記を記載
                    ```
                    module.exports = {
                        process() {
                            return {
                                code: "module.exports = {};"
                            };
                        },
                        getCacheKey() {
                            return "transformSvg";
                        },
                    };
                    ```
                2. `jest.config.ts`で下記を追加
                    ```
                    ...
                    const config: Config = {
                        ...,
                        transform: {
                            "^.+\\.svg$": "<rootDir>/__jest__/transformSvg.cjs",
                        },
                        ...
                    };
                    ...
                    ```
            - style(css/scss等)に関する対応
                1. `{アプリ名}/__jest__/transformStyle.cjs`を作成して下記を記載
                    ```
                    module.exports = {
                        process() {
                            return {
                                code: "module.exports = {};"
                            };
                        },
                        getCacheKey() {
                            return "transformStyle";
                        },
                    };
                    ```
                2. `jest.config.ts`で下記を追加
                    ```
                    ...
                    const config: Config = {
                        ...,
                        transform: {
                            "^.+\\.(css|scss)$": "<rootDir>/__jest__/transformStyle.cjs",
                        },
                        ...
                    };
                    ...
                    ```
        - 動くけど「Could not find a declaration file for module '@jest/globals'.」と怒られることが気になるなら，型定義ファイル`{アプリ名}/src/main/types/@jest/globals/index.d.ts`を作成して下記を記載
            ```
            declare module "@jest/globals";
            ```
            - Ref
                - https://qiita.com/kgtkr/items/2800e44803d9d11af1b8
    1. SCSS/styled-component(css prop)/TailwindCSSの導入
        - styled-componentを導入 ※SCSSでの実装の可能
            1. 下記ライブラリをインストール
                ```
                npm install styled-components
                npm install --save-dev \
                    sass \
                    @types/styled-components \
                    vite-plugin-babel-macros \
                    babel-plugin-styled-components
                ```
            1. `vite.config.ts`にて下記のビルド設定を追加
                ```
                ... // 他のimport
                import macrosPlugin from "vite-plugin-babel-macros";
                
                export default defineConfig(({command, mode, ssrBuild}) => {
                    ...
                    return {
                        plugins: [
                            react({
                                ...,
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
                            ...,
                            macrosPlugin(
                                // 「Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/styled-components_macro.js?v=4112b8d2' does not provide an export named 'css'」というエラーを解消してstyled-componentのcss propを使えるために必要
                                // https://github.com/styled-components/babel-plugin-styled-components/issues/350
                            ),
                        ],
                        ...
                    };
                };
                ```
            1. `App.tsx`でcss propの記述を導入して動作確認
                - ついでに`.css`を`.scss`に改名し，tsxでのimportの書き換えもする
            1. css propの実装をアプリコードに適用してくとTypeScriptによるエラーがちょこちょこ出てくるので解消していく
                - Reactコンポーネントに属性`css`を書いて「Type '{ children: Element[]; className: string; css: FlattenSimpleInterpolation; }' is not assignable to type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.Property 'css' does not exist on type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.」と怒られる
                    - 属性`css`がstyled-componentの型ではないので型定義`{アプリ名}/src/main/types/cssprop/index.d.ts`を新規作成して下記内容を書く
                        ```
                        import {} from "styled-components/cssprop";
                        ```
                - Reactコンポーネントに属性`css`を書いて「Unknown property 'css' found」と怒られる
                    - `.eslintrc.cjs`で下記ルールを追加して解消
                        ```
                        module.exports = {
                            ...,
                            rules: {
                                "react/no-unknown-property": [
                                    "error",
                                    {
                                        // コンポーネントのタグにおけるcssプロパティに対し「Unknown property 'css' found」というエラーが出ることを避けるため
                                        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md#rule-options
                                        ignore: ["css"]
                                    },
                                ],
                            },
                            ...,
                        };
                        ```
        - SCSSの静的解析を導入
            1. 下記ライブラリをインストール
                ```
                npm install --save-dev \
                    stylelint \
                    @stylelint/postcss-css-in-js \
                    stylelint-config-prettier \
                    stylelint-config-standard \
                    stylelint-config-standard-scss
                ```
            1. 共通設定`.stylelintrc.common.js`
                ```
                module.exports = {
                    extends: [
                        "stylelint-config-standard",
                        "stylelint-config-standard-scss",
                    ],
                    rules: {
                        "no-duplicate-selectors": [true, { disallowInList: true }],
                        "rule-empty-line-before": null,
                        "declaration-empty-line-before": null,
                        /*
                        末尾の`--`も許容したかったのでケバブケースからパターン修正
                        - Refs
                            - https://stylelint.io/user-guide/rules/list/selector-class-pattern/
                            - https://stylelint.io/user-guide/rules/regex/
                        */
                        "selector-class-pattern": "^([a-z][a-z0-9]*)(-[a-z0-9]+)*(--[a-z0-9]+)?$",
                    },
                };
                ```
            1. css/scssに対する設定`.stylelintrc.scss.js`
                ```
                const common = require("./.stylelintrc.common.cjs");

                module.exports = {
                    ...common,
                };
                ```
            1. css in JSに対する設定`.stylelintrc.cssinjs.js`
                ```
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
                ```
            1. stylelintによる静的解析の簡易コマンドを`package.json`に追加
                ```
                "scripts": {
                    ...,
                    "lint:style": "stylelint 'src/**/*.{css,scss}' --config .stylelintrc.scss.cjs & stylelint 'src/**/*.{jsx,tsx}' --config .stylelintrc.cssinjs.cjs",
                    "fix:scss": "stylelint --fix --config .stylelintrc.scss.cjs",
                    "fix:cssinjs": "stylelint --fix --config .stylelintrc.scss.cjs"
                },
                ```
            1. `npm run lint:style`や`npm run dev`してみる
            - TODO
                - css in JSに対する`stylelint --fix`で「Unknown word  CssSyntaxError」が出てうまくいかない
                    - 一旦静的解析結果を見て手動修正してもらう
                - ViteでStylelintを動かす良さげなプラグインが見当たらなかった
                    - 一旦stylelintはviteからではなく単独で使ってもらうこととする
                    - あるいは応急処置として`package.json`を下記のように修正するのもあり．
                        ```
                        "scripts": {
                            "dev": "npm run lint:style && vite",
                            "build": "npm run lint:style && tsc && vite build",
                            "preview": "npm run lint:style && vite preview",
                            ...
                        },
                        ```
                        - ただしこれはviteのwatchモードが効かないので注意
        - TailwindCSSを導入
            1. 下記ライブラリをインストール
                ```
                npm install --save \
                    tailwindcss \
                    postcss \
                    autoprefixer
                ```
            1. `npx tailwindcss init -p`を実行して`tailwind.config.cjs`と`postcss.config.cjs`を作成
            1. 各設定ファイルを下記内容にする
                - `tailwind.config.cjs`
                    ```
                    /** @type {import('tailwindcss').Config} */
                    module.exports = {
                        content: [
                            "index.html",
                            "src/**/*{jsx,tsx}"
                        ],
                        theme: {
                            extend: {},
                        },
                        plugins: [],
                    }
                    ```
                - `postcss.config.cjs`は特にいじらないがデフォの備忘
                    ```
                    module.exports = {
                        plugins: {
                            tailwindcss: {},
                            autoprefixer: {},
                        },
                    }
                    ```
            1. `{アプリ名}/src/main/plugins/tailwindcss.scss`を作成して下記内容を記述
                ```
                // 公式の下記の書き方だとVSCodeから警告でまくる
                // // @tailwind base; // これ使うと装飾崩れまくる．tailwindcss専用の初期化処理でありtailwindcssのみ使い場合に限定して使うべきかも．
                // @tailwind components;
                // @tailwind utilities;

                // @import "tailwindcss/base"; // これ使うと装飾崩れまくる．tailwindcss専用の初期化処理でありtailwindcssのみ使い場合に限定して使うべきかも．
                @import "tailwindcss/components";
                @import "tailwindcss/utilities";
                ```
            1. `index.(css|scss)`の冒頭に下記を書く
                ```
                @import "plugins/styles/tailwindcss"; // tailwindcssを使わずstyled-components(css prop)を使うならこれをコメントアウト
                ```
            1. (`@tailwind`を使用する場合実施)`.stylelintrc.common.cjs`にて下記設定を追加
                ```
                module.exports = {
                    ...,
                    rules: {
                        ...,
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
                ```
            1. `App.tsx`のJSX内でtailwindcssのclassを適当に追加してスタイルが変わることを確認
            - Refs
                - https://tailwindcss.com/docs/installation/using-postcss
    1. ~~Storybook導入~~ ※CSSライブラリの対応が不十分で楽に構築できなかったので保留
        1. 下記コマンドを実行
            ```
            npx sb init --builder @storybook/builder-vite
            ```
            - Docker上での最初の使用時はnodeユーザで実行しないといけないかも
            - Need to install the following packages: sb@6.5.12. Ok to proceed?: y
            - Do you want to run the 'eslintPlugin' migration on your project?: n
                - あまり自動的に設定ファイル書き換えら得れたくない気持ちが強かった．後で入れる
            - Do you want to run the 'npm7' migration on your project?: N
            - 自動で処理されたかもしれない内容
                - 下記ライブラリのインストール
                    ```
                    - @babel/core
                    - @storybook/addon-actions
                    - @storybook/addon-essentials
                    - @storybook/addon-interactions
                    - @storybook/addon-links
                    - @storybook/builder-vite
                    - @storybook/react
                    - @storybook/testing-library
                    - babel-loader
                    ```
                    - babel一気に来たなぁ…
                - `package.json`への簡易コマンドの追加
                    ```
                    "scripts": {
                        ...,
                        "storybook": "start-storybook -p 6006",
                        "build-storybook": "build-storybook"
                    },
                    ```
                    - ポート番号をdocker-composeで設定したものに変えておくと良いかも
        1. 下記ライブラリをインストール
            ```
            npm install --save-dev \
                eslint-plugin-storybook
            ```
        1. eslintの`.eslintrc.cjs`に下記追加
            ```
            module.exports = {
                ...,
                overrides: [
                    {
                        // Storybook用
                        // https://zenn.dev/longbridge/articles/13e65ef71455e4#eslint-%E3%81%AE%E8%A8%AD%E5%AE%9A
                        files: [
                            "**/*.stories.(js|jsx|ts|tsx)",
                        ],
                        extends: [
                            "plugin:storybook/recommended",
                        ],
                        // rules: {},
                    },
                ],
            };
            ```
        1. 「Could not find a declaration file for module '@storybook/testing-library'.(＝`@storybook/testing-library`の型定義が無い)」と怒られたら型定義ファイル`{アプリ名}/src/main/types/@storybook/testing-library/index.d.ts`を作成して下記を記載
            ```
            declare module "@storybook/testing-library";
            ```
            - Ref
                - https://qiita.com/kgtkr/items/2800e44803d9d11af1b8
        1. とりまサンプルコードを使って`npm run storybook`で動作確認
            - この後でサンプルコードいじりまくるので．
        1. `{アプリ名}/.storybook/main.cjs`にて下記のように設定追加
            ```
            const path = require("path");
            
            module.exports = {
                ...,
                // async viteFinal(config) {
                //     // viteを使用している場合，この実装でvite.config.tsからimportエイリアスの設定を含め読み込めるらしいが，eslintなど実行時間が伸びて面倒くさいので，後述のシンプルな設定することにした．
                //     // https://zenn.dev/longbridge/articles/13e65ef71455e4#storybook-%E8%B5%B7%E5%8B%95%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB-.main.js-%E3%81%AE%E8%A8%AD%E5%AE%9A
                //     const { loadConfigFromFile, mergeConfig } = require("vite");
                //     const { config: userConfig } = await loadConfigFromFile(
                //         path.resolve(__dirname, "../vite.config.ts")
                //     );
                //     return mergeConfig(config, {
                //         ...userConfig,
                //         // plugins: [],
                //     });
                // },
                async viteFinal(config) {
                    // https://zenn.dev/alesion/articles/132483d3fb6949#storybook%E3%82%92%E5%B0%8E%E5%85%A5
                    config.resolve.alias = {
                        ...config.resolve.alias,
                        // tsconfig.jsonやvite.config.tsでの設定に合わせる
                        "~": path.resolve(__dirname, "../src/main"),
                        "~~": path.resolve(__dirname, "../src"),
                        // "@": path.resolve(__dirname, "../src/main"),
                        // "@@": path.resolve(__dirname, "../src"),
                    };
                    return config;
                },
            };
            ```
        1. `npm run lint:selint`や`npm run lint:style`を実行し，サンプルコードに対して怒られた箇所の対処する
            - typescriptやcssにおけるシングルクォーテーションをダブルクォーテーションにする
            - `export default {}`ではなく変数宣言を挟むようにする
            - propsが無いコンポーネントにおいては引数のargsを消す
        1. アドオンを追加
            - ダークモード
                1. 下記ライブラリをインストール
                    ```
                    npm install --save-dev storybook-dark-mode
                    ```
                1. `{アプリ名}/.storybook/main.cjs`にて下記のように設定追加
                    ```
                    ...
                    module.exports = {
                        ...,
                        "addons": [
                            ...,
                            "storybook-dark-mode",
                        ],
                        ...,
                    };
                    ```
                - Refs
                    - https://storybook.js.org/addons/storybook-dark-mode
            - styled-componentsのcss prop
                - 記事見つからん，厳しい
            - tailwindcss
                - `{アプリ名}/.storybook/preview.cjs`に下記追加したけど機能せず．厳しそう
                    ```
                    import "../src/main/index.scss";
                    ```
                - `@storybook/addon-postcss`入れるんかな？入れたと思うけどな
    1. アプリコードをちょこちょこ変更
        - publicフォルダとassetsフォルダのsvgをsvgフォルダに入れる
        - 「jsx内のsrcでpublicフォルダから読み込むもの」が画面に表示されない場合，相対パスへの手での書き換えが必要
            - 「HTMLファイル内のsrc・href」や「jsx内でメディアファイルをimportの上でsrcに指定しているもの」と違い，`vite.config.ts[base]="./"`が適用されてくれずビルド後のHTMLでメディアファイルが読み込まれないから．
    1. TypeScriptをトランスパイル無しで実行したい場合があると思うので，実行できるよう簡易コマンドを`package.json`に追加
        ```
        "scripts": {
            ...,
            "ts": "npm run lint:eslint && node --loader ts-node/esm"
        },
        ```
        - MEMO
            - TypeScriptをトランスパイル無しで実行できる方法として`ts-node ～.ts`があるが，`package.json["type"]: "module"`のせいで「TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"」というエラーが出ていた．
                - 下記のように変更してが意味なかった．
                    - 削除したり`commonjs`に変更して`ts-node ～.ts`で実行した場合，「SyntaxError: Unexpected token 'export'」と怒られる
                        - Reactビルドへの影響は多分ないが．
        - Refs
            - https://zenn.dev/tak_iwamoto/articles/862527e69f544e
            - https://github.com/TypeStrong/ts-node/issues/1062#issuecomment-1028139483
1. アプリディレクトリに移動し，依存ライブラリをインストール
    ```
    cd {アプリ名}
    npm set progress false; npm install
    ```
    - ちょっと時間かかる…
    - `npm set progress false`によりプログレスバーが非表示になるが，インストールが高速になるらしい
    - インストール後のVSCodeで「`d.ts`が読み込まれない」エラーが出る場合はVSCodeを再起動する
1. ここまでで入らなかった依存ライブラリを，必要あれば手動インストール
1. 開発モードでトランスパイルして動作確認
    ```
    npm run dev
    ```

### その他環境構築
##### モック用GraphQL
1. `{アプリ名}/src/mock_graphql/`を作成
1. これを参考にモック用GraphQLサーバ建てようとしてた
    - https://www.apollographql.com/docs/apollo-server/testing/mocking/
    - https://reffect.co.jp/vue/graphql-apollo-server-vue
- いろんなクライアントツールがあるらしい…
    - Refs
        - https://user-first.ikyu.co.jp/entry/2022/07/01/121325
        - https://nulab.com/ja/blog/nulab/graphql-apollo-relay-urql/
        - https://suzukalight.com/blog/posts/2019-12-08-graphql-server
        - https://qiita.com/jintz/items/4ddc6bf4f95238eff5e9#apollo-server-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%8B
- 他の構築方法
    - CodeSandboxでApolloServerを立ち上げる(ログイン必要っぽい)
        - Refs
            - https://tech.fusic.co.jp/posts/mocking-graphql-server/
    - 「Mock Service Worker」というモックサーバツールがあり，RestとGraphQLの両方に対応しているそうなのでこれもそのうち試してみたい
        - MEMO
            - 別プロセスとしての(Rest・GraphQL)サーバの起動が不要で，クライアント側コードの実行中においてその要求のたびにレスポンスを返すコードだけ走ってるっぽい．
            - サーバ起動してないので，GraphiQL・GraphQL Playgroundような画面を出すのは無理かも
        - Refs
            - https://mswjs.io/docs/getting-started/mocks/graphql-api
            - https://zenn.dev/yoshii0110/articles/fb5261b3ff6c6c
            - https://zenn.dev/higuchimakoto/articles/d9865193910046
            - https://www.miracleave.co.jp/contents/1816/front-end-development-msw-mocks/
            - https://zenn.dev/sa2knight/scraps/13bf492debd5e1
            - https://tech.smartshopping.co.jp/msw-graphql-test
            - https://zenn.dev/higuchimakoto/articles/d9865193910046
            - https://zenn.dev/ynakamura/articles/5d92bd34a363c6
            - https://qiita.com/stake15/items/50476b986c8dab8d7fcf
            - https://zenn.dev/azukiazusa/articles/using-msw-to-mock-frontend-tests
            - https://zenn.dev/yuki_tu/articles/bdd942df59fb69
    - graphql-toolsライブラリによるモックサーバ
        - Refs
            - https://www.graphql-tools.com/docs/mocking#mockserver



### Vite&Reactのフロントエンド開発の進め方
##### 開発
1. `{アプリ名}/src/main/`下でコードを実装する
1. 下記コマンドを実行して静的解析＆開発モードでプレビュー
    ```
    npm run dev
    ```
    - 静的解析(構文チェック)はTypeScript・スタイルの両方に対して走るので，エラーが出たらコードを修正する
    - どうしてもエラー解消できない場合，チームメンバーに聞く
        - それでも解消できない場合は静的解析のルールの見直し検討
1. 下記コマンドを実行して本番コードをビルド
    ```
    npm run build
    ```
    - ここでも静的解析が走る
    - VSCodeの拡張機能「Live Server」で出力されたHTMLを開いて動作確認できる
    - ここで出力されたコードをバックエンドコードのtemplatesかstaticsあたりに置く感じ
- ちなみに静的解析が走るコマンドは下記の通り
    - スタイル・TypeScript両方
        - `npm run dev`
        - `npm run build`
        - `npm run preview`
    - TypeScriptのみ
        - `npm run lint:eslint`
        - `npm run test`
        - `npm run test:coverage`
        - `npm run ts`
    - スタイルのみ
        - `npm run lint:style`


##### テスト(単体・結合)
1. フォルダ`{アプリ名}/src/__tests__/targets/{テスト作成日：yyyyMMdd}_{テスト概要}/`を作成し，その下でテストコードを実装
1. 下記コマンドを実行してテスト実施
    ```
    npm run test
    ```
1. テスト結果に応じてフォルダ`{テスト作成日：yyyyMMdd}_{テスト概要}`を移動させてテスト対象から除外する
    - テスト成功: `{アプリ名}/src/__tests__/done_completed/`
    - テスト失敗: `{アプリ名}/src/__tests__/done_failed/`
1. (念のため他の開発メンバーにテストパターンやテスト実施のダブルチェックしてもらう)
