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



# TODO
- [x] Viteアプリディレクトリ作成
- [x] ディレクトリ構造・トランスパイル設定
- [x] 静的解析設定
- [x] `npm run dev/build`したときにeslint/prettierの結果が出ない(ダブルクォートとか)
- [x] bundle-analyzer追加
- [x] なんかpublicから読み込めてないぞ～～
    - [Github](https://github.com/vitejs/vite/discussions/10070)に質問投げて一旦手で修正
- [x] テスト環境構築
- [x] SCSS/TailwindCSS導入
- [ ] なんかpublicからiconが読み込めてないぞ～～
    - わからん
    - `npm run build`したものは読み込めてる．`npm run dev`のときだけ．
- [ ] Storybook導入
    - 無理ぃ
    - tailwindcssやcss prop(styled-components)とかのCSSライブラリの対応できて無さそう
- [x] 使いそうなReactライブラリインストール
- [ ] GraphQLモック
