# 開発者向けメモ

### 環境
- 開発環境
    - WSL2
    - トランスパイラ：`webpack`
- バックエンド
    - TypeScript
    - NodeJS
- フロントエンド
    - TypeScript
    - React


### ディレクトリ構成
- React x Reduxの場合
    ```
    ├ Project
        ├ .gitignore
        ├ docker-compose.yml
        ├ docker/
            ├ dev/
            ├ preview/
                ├ app/
                ├ db/
                    ├ mysql/
                        ├ data/
                ├ phpmyadmin/
        ├ workspace [あるいはプロジェクト・アプリ名]
            ├ frontend/
                ├ package.json
                ├ dist/
                    ├ build/ [ビルド結果でありpreview・release用．previewコンテナのフロントエンドのディレクトリにはここからマウントしてくる．]
                    ├ stats/
                        ├ stats.json [Webpackによる可視化ファイル]
                ├ src/
                    ├ test/
                    ├ main/
                        ├ index.html
                        ├ Root.tsx
                        ├ components/
                            ├ App.tsx
                            ├ common/
                                ├ tsx/
                                    ├ <tsxパーツ名>/
                                        ├ PartsA.tsx
                                        ├ PartsA.scss
                                ├ scss/ [基本的にscssへのインポートのみ．]
                            ├ pages/
                                ├ pageA/
                                    ├ PageA.tsx
                                    ├ PageA.scss
                        ├ states/
                            ├ stores/
                                ├ index.ts
                            ├ actions/
                            ├ reducers/
                            ├ types/
                        ├ types/
                            ├ declarations.d.ts [SCSS等CSS-Moduleの読み込みのために必要になった型定義ファイル]
                        ├ errhandle/
            ├ backend/
                ├ package.json [今回はNodeJSなので]
                ├ dist/
                    ├ build/ [ビルド結果でありpreview・release用．previewコンテナのフロントエンドのディレクトリにはここからマウントしてくる．]
                    ├ stats/
                        ├ stats.json [Webpackによる可視化ファイル]
                ├ src/
                    ├ express/
                        ├ test/
                        ├ main/
                            ├ app.ts
                    ├ fastify/
                        ├ test/
                        ├ main/
                            ├ app.ts

    ```

### 環境構築
1. docker-compose on WSL2導入
    1. Windwosのバージョン確認．
    - [ステップ2-WSL2を実行するための要件を確認します](https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-2---check-requirements-for-running-wsl-2)
        - x64の場合：バージョン1903以降、ビルド18362以降
    - Visualizationの有効化の確認も必要かな？
        - [Windows 10 Home で WSL 2 + Docker を使う](https://qiita.com/KoKeCross/items/a6365af2594a102a817b)
    2. 管理者権限でWindowsPowerShellを開き，下記コマンド．
        ```
        > Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
        ```
        - [WSL2のインストール方法【WindowsにLinuxを使う！】](https://yukituna.com/2079/)
        - 下記コマンドで`VirtualMachinePlatform`がEnabledになっているか確認．
            ```
            > Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
            ```
            - [ステップ1-Linux用のWindowsサブシステムを有効にする](https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-1---enable-the-windows-subsystem-for-linux)によると，`Microsoft-Windows-Subsystem-Linux`もEnableになっている必要がありそうだが，`VirtualMachinePlatform`のEnable化で一緒に変更されたっけかな？？
        - 逆に無効化する場合は下記コマンド．
            ```
            > Disable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
            ```
            - [Windows 10 の役割を PowerShell で有効/無効にする](https://www.vwnet.jp/Windows/w10/WindowsOptionalFeature.htm)
    3. [手順 4 - Linux カーネル更新プログラム パッケージをダウンロードする](https://docs.microsoft.com/ja-jp/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package)に則り，`x64 マシン用 WSL2 Linux カーネル更新プログラム パッケージ`をインストールする．
    4. WindowsTerminalを起動し，そこのPowerShellで下記コマンドを実行してディストリビューション(Microsoft Storeからダウンロードする)のwslのバージョン確認．
        ```
        > wsl -l --verbose
        ```
    5. 4.でバージョンが1ならば，下記コマンドで2に変更．
        ```
        > wsl --set-version <ディストリビューション名> 2
        ```
        - 下記コマンドでデフォルトで2にできるみたいだが，再度4.のコマンドで確認しても変わってないように見える…
            ```
            > wsl --set-default-version 2
            ```
        - エラー参考
            - [WSL バージョンを変更する方法](https://kb.seeck.jp/archives/16950)
    6. WindowsTerminalでUbuntuを起動し，下記コマンドを順次実行してdocker/docker-composeを導入．
        ```
        $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        $ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
        $ sudo apt update && sudo apt install -y docker-ce docker-compose
        $ sudo service docker start
        ```
    7. 下記コマンドでdockerの動作確認．
        ```
        $ sudo docker -v
        $ sudo docker-compose -v
        ```
        - バージョンの確認程度ならsudoなしでも行けるようだが，イメージビルドとかではsudo必要．
    - その他
        - 起動時のデフォルト画面をUbuntuにしたい．
            - `defaultProfile`にUbuntuの`guide`の値をコピペする．
                - [Windowsターミナルでデフォルトのコンソール/ターミナルを変更する方法](https://soundartifacts.com/ja/how-to/294-how-to-change-default-console-terminal-in-windows-terminal.html)
        - gitの最新バージョンを入れる
            - Ubuntuディストリビューションで下記コマンドを順次実行．
                ```
                $ sudo add-apt-repository ppa:git-core/ppa
                $ sudo apt update
                $ sudo apt upgrade
                ```
                - [Ubuntu で Git の最新を使う](https://qiita.com/cointoss1973/items/1c01837e65b937fc0761)
        - WSL2の起動時のディレクトリを(Windows上のディレクトリに)変更する
            - 下記コマンドを実行して`~/.bashrc`に追記
                ```
                $ echo "cd /mnt/<Windows上のディレクトリ>"
                ```
        - (例えばWSL2用のディレクトリがCドライブ下のgitディレクトリより離れたところにいる時に)Cドライブ下のgitディレクトリに簡単に移動するエイリアスを設定する
            - 下記コマンドでエイリアスを追記．
                ```
                $ echo -e "# <コメントアウト：エイリアスの説明>\nalias gg='cd /mnt/<gitディレクトリへのPath>'" >> ~/.bash_aliases
                ```
        - `sudo docker-compose`と打つのが面倒なら下記のエイリアスを追加．
            ```
            $ echo -e "# dc=docker-compose\nalias dc='sudo docker-compose'" >> ~/.bash_aliases
            $ echo -e "# d=docker\nalias d='sudo docker'" >> ~/.bash_aliases
            ```
2. docker-compose：フロント・バックエンド開発環境
    1. 下記コマンドでdocker-compose起動(3.のプレビュー環境も一緒に起動する)してコンテナに入る．
        ```
        $ docker-compose up -d
        $ docker exec -it reactapp_dev bash
        # 
        ```
        - **devコンテナではフロント言語・バック言語両方とも入っている状態．**
        - コンテナの片付けは下記
            ```
            $ docker-compose down
            $ docker rmi reactapp_dev
            $ docker volume prune
            $ docker network prune
            ```
    2. フロント・バックエンドのそれぞれでビルド設定をする．
        - フロントエンド
            1. . 下記コマンドを実行して`package.json`の生成またはインストールする．
                ```
                # pwd
                /opt/workspace/frontend
                # bash /opt/docker/tools/npm_install.sh -w ./

                または
                
                # pwd
                /opt/workspace
                # bash /opt/docker/tools/npm_install.sh -w /opt/workspace/frontend
                ```
                - `frontend/`下に`npm-install-dependencies.sh`を下記のように用意しておくと，`package.json`の生成と合わせて依存モジュールインストールもします．
                    ```
                    # TypeScript
                    npm install --no-optional --save-dev typescript
                    # TypeScriptコンパイル関連
                    npm install --no-optional --save-dev \
                        eslint \
                        @typescript-eslint/eslint-plugin \
                        @typescript-eslint/parser \
                        prettier \
                        eslint-config-prettier \
                        eslint-plugin-prettier
                    # TypeScript型関連
                    npm install --no-optional --save-dev \
                        @types/node
                    # TypeScript x Webpack関連
                    npm install --no-optional --save-dev \
                        webpack \
                        webpack-cli \
                        webpack-merge \
                        ts-loader \
                        eslint-loader \
                        webpack-bundle-analyzer
                    # テスト関連
                    npm install --no-optional --save-dev \
                        mocha \
                        chai \
                        ts-node \
                        tsconfig-paths \
                        @types/mocha \
                        @types/chai
                    ```
            2. `tsc`の設定
                1. 下記コマンドで`tsconfig.json`を生成．
                    ```
                    # pwd
                    /opt/workspace/frontend
                    # ./node_modules/.bin/tsc --init
                    ```
                2. `tsconfig.json`において下記を変更．
                    ```
                    {
                        "compilerOptions": {
                            "target": "es5",
                            "module": "commonjs",
                            "jsx": "react",
                            "sourceMap": true,
                            "outDir": "./dist/",
                            "removeComments": true,
                            "strict": true,
                            "noImplicitAny": true,
                            "strictNullChecks": true,
                            "strictFunctionTypes": true,
                            "strictPropertyInitialization": true,
                            "noImplicitReturns": true,
                            "baseUrl": "./", // importの絶対パス化に必要
                            "paths": { // importの絶対パス化に必要
                                "~\/*": ["./src/main/*"], // src下に複数プロジェクトコードディレクトリを配置している場合はコメントアウト推奨．
                                "~~\/*": ["./src/*"],
                                "@\/*": ["./src/main/*"], // src下に複数プロジェクトコードディレクトリを配置している場合はコメントアウト推奨．
                                "@@\/*": ["./src/*"]
                            }, 
                            "esModuleInterop": true,
                            "forceConsistentCasingInFileNames": true
                        },
                        "include": [
                            "./src/**/*.ts",
                            "./src/**/*.tsx"
                        ],
                        "exclude": [
                            "node_modules"
                        ]
                    }
                    ```
            3. `eslint`の設定
                1. 下記コマンドで`.eslintrc.json`を生成．
                    ```
                    # pwd
                    /opt/workspace/frontend
                    # ./node_modules/.bin/eslint --init
                    ```
                    - 上記コマンド実行時の選択
                        - How would you like to use ESLint?
                            - 基本的に"To check syntax and find problems"でOK
                        - What type of modules does your project use?
                            - tsconfig.json["compilerOptions"]["module"]で設定したものと一致させる．
                            - 今回は"commonjs"なので"commonjs"でOK
                        - Which framework does your project use?
                            - Reactで．
                        - Does your project use TypeScript? (y/N)
                            - 今回はTypeScriptを使うので"y"
                        - Where does your code run?
                            - 基本的に"Node"でOK…と思ったけどBrowserしか選べないぽい？
                        - What format do you want your config file to be in?
                            - 設定ファイルの拡張子．基本的に"JSON"でOK
                        - @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest Would you like to install them now with npm? (Y/n)
                            - package.jsonの用意のとこで既にインストールしちゃってるけど"Y"でいいか…
                2. `.eslintrc.json`において下記を変更．
                    ```
                    {
                        "env": {
                            "browser": true,
                            "commonjs": true,
                            "es2020": true
                        },
                        "extends": [
                            "eslint:recommended",
                            "plugin:react/recommended",
                            "plugin:@typescript-eslint/recommended",
                            "plugin:@typescript-eslint/eslint-recommended",
                            "plugin:prettier/recommended",
                            //=======================================================================
                            // "prettier/@typescript-eslint" has been merged into "prettier" in eslint-config-prettier 8.0.0.
                            // "prettier/@typescript-eslint" // これはもう使えないらしい
                            "prettier"
                            //=======================================================================
                        ],
                        "parser": "@typescript-eslint/parser",
                        "parserOptions": {
                            "ecmaFeatures": {
                                "jsx": true
                            },
                            "ecmaVersion": 12,
                            "sourceType": "module",
                            "project": "./tsconfig.json"
                        },
                        "plugins": [
                            "react",
                            "@typescript-eslint"
                        ],
                        "rules": {
                            "no-empty-character-class": "error",
                            "no-eval": ["error"],
                            "no-trailing-spaces": ["error"],
                            "no-unsafe-finally": "error",
                            "no-whitespace-before-property": "error",
                            "spaced-comment": ["error", "always"],
                            "brace-style": ["warn", "1tbs"], // if-else等の改行記法
                            "indent": ["error", 4, {"SwitchCase": 1}], // switch文のインデントの取り方もここで指定
                            "quotes": ["error", "double", {"avoidEscape": true}],
                            "semi": ["error", "always"],
                            "prettier/prettier": "error",
                            "@typescript-eslint/no-inferrable-types": "warn", // 自明な型アノテーションの除去については警告に留める
                            "@typescript-eslint/no-empty-interface": "warn"
                        },
                        "settings": {
                            // 「Warning: React version not specified in eslint-plugin-react settings.」非表示のため
                            "react": {
                                "version": "detect"
                            }
                        }
                    }
                    ```
                    - [ESLintのルールを全部手動で設定するのは大変だからやめておけ](https://qiita.com/khsk/items/0f200fc3a4a3542efa90)
                    - [Rules of ESLint](https://eslint.org/docs/rules/)
                    - [TSLint Migration Guide | Github](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/ROADMAP.md)
                    - [Imported modules only used as type annotation are marked as no-unused-vars #5](https://github.com/vuejs/eslint-config-typescript/issues/5)
            4. `prettier`の設定
                1. `.prettierrc.json`を4.で生成した`.eslintrc.json`と同じところに生成．
                2. `.prettierrc.json`において下記を変更．
                    ```
                    {
                        "tabWidth": 4,
                        "tabs": true,
                        "singleQuote": false,
                        "semi": true
                    }
                    ```
                    - [Opions of Prettier](https://prettier.io/docs/en/options.html)
            5. `stylelint`の設定
                1. `.stylelintrc.json`を`package.json`と同じところに生成．
                2. `.stylelintrc.json`において下記を記述．
                    ```
                    {
                        "extends": [
                            "stylelint-config-recommended-scss"
                        ],
                        "plugins": [
                            "stylelint-scss"
                        ],
                        "rules": {
                            // stylelint-config-recommendsd-scssで不満な部分をこっちで微調整
                            "no-duplicate-selectors": [
                                true,
                                {"disallowInList": true}
                            ]
                        }
                    }
                    ```
                - 参考
                    - [stylelintの導入方法と各ルール解説](https://qiita.com/DesignChips/items/cd5282dba553026757c8)
                    - [.stylelintrc](https://qiita.com/takeshisakuma/items/a7a3b8cc0ce05422f686)
                    - [no-duplicate-selectors](https://stylelint.io/user-guide/rules/no-duplicate-selectors)
            6. `webpack`の設定
                1. `webpack.common.js`・`webpack.dev.js`・`webpack.prod.js`を`package.json`と同じところに生成．
                2. 上記3つのファイルをそれぞれ下記のように変更．
                    - `webpack.common.js`
                        ```
                        const path = require("path");
                        const HtmlWebpackPlugin = require("html-webpack-plugin");
                        const StylelintPlugin = require("stylelint-webpack-plugin");
                        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

                        module.exports = (isProd = false) => {
                            return {
                                entry: {
                                    "bundle": path.join(__dirname, "src/main/Root.tsx"), // フロントエンドのビルドルート
                                },
                                output: {
                                    path: path.join(__dirname, "dist/build"),
                                    filename: `[name]${(isProd ? "" : "_dev")}.js` // 開発用なら「_dev」が付く
                                },
                                resolve: {
                                    modules: ["node_modules"],
                                    extensions: [".js", ".ts", ".tsx"],
                                    alias: { // importの絶対パス化に必要． // tsconfig.json[paths]に合わせる．
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
                                        filename: "index.html",
                                        minify: {
                                            removeComments: isProd,
                                            collapseWhitespace: isProd
                                        }
                                    }),
                                    new StylelintPlugin({
                                        // https://webpack.js.org/plugins/stylelint-webpack-plugin/
                                        configFile: ".stylelintrc.json",
                                        files: "src/**/*.scss",
                                        fix: false
                                    }),
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
                                        reportFilename: "../stats/app.html", //  // [output][path]="dist/build"であるため，"dist/stats"にするために一つ上に戻る必要あり
                                        statsFilename: "../stats/stats.json", //  // [output][path]="dist/build"であるため，"dist/stats"にするために一つ上に戻る必要あり
                                        generateStatsFile: true,
                                        openAnalyzer: false,
                                        defaultSizes: "gzip",
                                        statsOptions: null,
                                        logLevel: "info"
                                    })
                                ]
                            };
                        };
                        ```
                    - `webpack.dev.js`
                        ```
                        const { merge } = require("webpack-merge");
                        const common = require("./webpack.common.js");

                        module.exports = merge(
                            common(isProd = false),
                            {
                                mode: "development",
                                devtool: "inline-source-map"
                            }
                        );
                        ```
                    - `webpack.prod.js`
                        ```
                        const { merge } = require("webpack-merge");
                        const common = require("./webpack.common.js");

                        module.exports = merge(
                            common(isProd = true),
                            {
                                mode: "production"
                            }
                        );
                        ```
            7. 下記のように`package.json`にて簡略コマンド追加．
                ```
                {
                    ...,
                    "scripts": {
                        "test": "mocha --require ts-node/register --require tsconfig-paths/register --watch-extensions ts \"src/test/**/*.test.ts\"",
                        "onetest": "mocha --require ts-node/register --require tsconfig-paths/register --watch-extensions ts",
                        "dev": "webpack --config webpack.dev.js",
                        "build": "webpack --config webpack.prod.js",
                        "tsc": "tsc",
                        "watch": "webpack -w --config webpack.dev.js",
                        "lint": "eslint 'src/**/*.{ts,tsx}'",
                        "lint@scss": "stylelint src/**/*.scss",
                        "onefix": "eslint --fix",
                        "fix@scss": "stylelint --fix",
                        "analyze": "webpack-bundle-analyzer --host 0.0.0.0 --port 8765 ./dist/stats/stats.json"
                    },
                    ...
                }
                ```
                - コマンド説明
                    - `$ npm run test`
                        - 全ての？テストコードを実行
                    - `$ npm run onetest <テストコードのファイル>`
                        - テストコードを指定しての実行
                    - `$ npm run dev`
                        - Webpackによる開発用ビルド
                    - `$ npm run build`
                        - Webpackによる本番用ビルド
                    - `$ npm run tsc`
                        - `tsc`コマンドによるTypeScriptコードコンパイル．
                        - 例
                            - `$ npm run tsc -- --outFile outdir/out.js input.ts`
                            - ~~`$ npm run tsc -- --build ./tsconfig.json`~~
                                - これは，特定のTypeScriptファイルのみコンパイルしたい場合`tsconfig.json`を毎回変えないといけなくなるので面倒だし，コンパイルするファイルをコマンドライン引数に指定しても効かずに配下の全TypeScriptファイルをコンパイルしてしまうのでちょっと危険．
                    - `$ npm run watch`
                        - コード変更時の静的監視(解析？)
                    - `$ npm run lint`
                        - テストコード含む全ての`.ts|.tsx`のファイルに対する，ESLintとPrettierに基づくコード静的解析
                        - なお，`$ npm run lint -- --fix`で実行すると，全ての`.ts|.tsx`のファイルに対し自動整形をする．
                    - `$ npm run lint@scss`
                        - すべての`.scss`のファイルに対する静的解析
                        - `.stylelintrc.json`で指定のルールに基づく
                    - `$ npm run onefix <自動整形したいファイル>`
                        - 指定のファイルを自動整形する
                    - `$ npm run fix@scss <正規表現ディレクトリ|ファイル名>`
                        - SCSSを自動整形するコマンドのつもり…
                        - `The extension for the file (.scss) is non-standard. You should add "parserOptions.extraFileExtensions" to your config`と出てまだうまく行ってない
                    - `$ npm run analyze`
                        - トランスパイル結果のJSファイル(例えば`bundle.js`)におけるモジュールごとのファイルサイズを可視化．
                        - `tools/displayhtml/`で自作した，`node ./../tools/dist/build/displayhtml/displayHtml.js -h 0.0.0.0 --p 8765 ./dist/build/stats/report.html`でも代替できる．
        - バックエンド
- もしこうなったら
    - ビルド失敗しないが，下記のようなエラーが出る
        ```
        Cannot find name 'process'
        ```
        - VSCodeで複数プロジェクトが見えるように開いていて，`node_modules/`が直下になるように開いていないため．
    - `import readline from "readline"`してWebpackでトランスパイルしたら下記エラーが出た．
        ```
        Module not found: Error: Can't resolve 'util' in '/opt/workspace/tools/node_modules/readline'

        webpack < 5 used to include polyfills for node.js core modules by default.
        This is no longer the case. Verify if you need this module and configure a polyfill for it.
        If you want to include a polyfill, you need to:
                - add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
                - install 'util'
        If you don't want to include a polyfill, you can use an empty module like this:
                resolve.fallback: { "util": false }

        resolve 'util' in '/opt/workspace/tools/node_modules/readline'
        Parsed request is a module
        using description file: /opt/workspace/tools/node_modules/readline/package.json (relative path: .)
            Field 'browser' doesn't contain a valid alias configuration
        ```
        - Webpack5からweb向け？のトランスパイルが採用されて，pollyfillやfsなどのクライアントNodeJSで動かす用？のモジュール群がデフォルトで使用されなくなっているらしい？
        - ひとまず`npm install --no-optional --save-dev util`をしたら次のエラーに変わった．
        ```
        ERROR in ./displayhtml/src/main/modules/cliParser.ts 4:17-36
        Module not found: Error: Can't resolve 'readline' in '/opt/workspace/tools/displayhtml/src/main/modules'
        resolve 'readline' in '/opt/workspace/tools/displayhtml/src/main/modules'
        Parsed request is a module
        using description file: /opt/workspace/tools/package.json (relative path: ./displayhtml/src/main/modules)
            Field 'browser' doesn't contain a valid alias configuration
        ```
        - ひとまず`npm install --no-optional --save-dev readline`をしたら次のエラーに変わった．
        ```
        Module not found: Error: Can't resolve 'fs' in '/opt/workspace/tools/node_modules/readline'
        resolve 'fs' in '/opt/workspace/tools/node_modules/readline'
        Parsed request is a module
        using description file: /opt/workspace/tools/node_modules/readline/package.json (relative path: .)
            Field 'browser' doesn't contain a valid alias configuration
        ```
        - ひとまず`webpack.common.js`において`target: "node"`を追加してトランスパイルしたらうまくいった．  
        しかしこの方法はブラウザ向けJSへのトランスパイル向けではなくクライアントNodeJSで動かす用らしい．  
        フロントエンドとバックエンドを同じディレクトリ・webpackでトランスパイルするのはやめた方が良さげ．
            - [webpack 実行で Module not found: Error: Can't resolve 'fs' というエラー](https://qiita.com/kenboo/items/996daf12a3eb17b7c89f)
            - [webpackで「Module not found: Error: Can’t resolve ‘fs’」が出たときの対処法](https://tomokazu-kozuma.com/what-to-do-when-module-not-found-error-can-not-resolve-fs-comes-out-in-webpack/)
    - SCSS等をCSS-Modulesとして読み込ませる形で実装してトランスパイルしたら下記エラーが出た．
        ```
        ERROR in /opt/workspace/frontend/src/main/components/App.tsx
        ./src/main/components/App.tsx 4:23-44
        [tsl] ERROR in /opt/workspace/frontend/src/main/components/App.tsx(4,24)
            TS2307: Cannot find module '~/styles/test1.scss' or its corresponding type declarations.
        ```
        - `src/main/types/declarations.d.ts`を下記のように実装して配置したら解決した．
            ```
            declare module "*.scss";
            ```
            - [Can't import CSS/SCSS modules. TypeScript says “Cannot Find Module”](https://stackoverflow.com/a/41946697/15842506)


3. docker-compose：プレビュー環境
    - NodeJS on Nginx
    - MySQL(SQLServer)
    - phpMyAdmin

- その他
    - VSCode
        - JS/TSのオートインポートを止めたい
            - `.vscode/settings.json`に`"typescript.autoImportSuggestions.enabled": false`を追加．
            - [Disable autoimport on JS/TS files by default #38911](https://github.com/microsoft/vscode/issues/38911#issuecomment-346382914)



