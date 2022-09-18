# 俺的ReactWebAppサンプル
### 本プロジェクトでやること
- [ ] 汎用的なフロント・バックエンド開発環境を構築できること
    - devコンテナとpreviewコンテナの作成
        - TSのトランスパイルには`webpack`を使用．
        - [x] dev
            - コード実装・ビルドに必要な環境を構築
            - フロント・バックエンドのいずれもビルド先を指定して出力するように設定しておく
            - [ ] 環境構築できたら，フロントで簡易TODOページ・バックエンドでDB操作コードを実装
        - [ ] preview
            - 実運用とほぼ同じ環境を構築
            - devで出力されたビルド先から読み込んで画面表示
- [ ] WSL2でMySQL on docker-composeを動かせること
    - previewコンテナで動かす．
    - できればSQLServerも．[これ](https://github.com/KagenoMoheji/LingoBook/tree/main/based_sourcecode/test_env)が参考になると思われ．
- [ ] Reactコンポネントテストができる開発構成であること
- [ ] NodeJS(Express) x ReactでSSR
    - CSR無しで状態変化(ボタン操作等)することを確認できること．
    - 参考
        - [自分の失敗コード](https://github.com/KagenoMoheji/docker_practice/tree/master/dev_jvm/scala/web/dwango_Nhigh/src/1_start/src/1_serverside/17_oauth/main/correctCode)
        - [Server-Side Rendering with React and TypeScript](https://medium.com/atticus-engineering/server-side-rendering-with-react-and-typescript-8cebb4400b3c#676b)
        - [How to build React apps that load quickly using server side rendering](https://www.terlici.com/2015/03/18/fast-react-loading-server-rendering.html)
        - [SERVER-SIDE RENDERING WITH REACT AND EXPRESS — JSCASTS EPISODE 14](https://softwarebrothers.co/blog/server-side-rendering-with-react-and-express/)
        - [Quick Start Tutorial: Universal React, with Server Side Rendering](https://medium.com/@firasd/quick-start-tutorial-universal-react-with-server-side-rendering-76fe5363d6e#file-react-server-tutorial-snippet-js-L14)
        - [【基礎】ReactでServer Side Rendering](https://qiita.com/tsuuuuu_san/items/a042aa5b23c310537736)
        - [webpack4でReact16のSSR（サーバサイドレンダリング）をする](https://qiita.com/teradonburi/items/32e8339ce93273219661)
        - [react-routerではなくuniversal-routerでReact + ReduxのSSR + SPAする](https://blog.nabeliwo.com/2017/07/react-redux-ssr-not-react-router-but-universal-router/)
- [ ] NodeJS x ReactでISR(Incremental Static Regeneration)を実装できること
    - SSRで渡したコンポネントからAPIやり取りすればいいのでは？と軽く考えてる…
- [ ] ExpressをFastifyに変えてみる
- [ ] React x SCSSでレスポンシブデザインテンプレ実装
    - 構成は[これ](https://codepen.io/KagenoMoheji/pen/bGpdBYX)を参考にしてみよ．flexbox目一杯使いたい．
        - 左サイドバーを消せばもへじの編綴で使える．
- [ ] このあたりで，「俺的TypeScript x React x Redux(Class based component，サンプル付)　第2弾」の記事書く．
    - 上記のレスポンシブデザインテンプレが1つのページ
        - こっちではRedux使う例かな？
        - できればReduxのソース構成を再検討したい(actionsやstoresに分けているが，できれば状態ごとにディレクトリ分けてみたい)
    - 別のページは何かサンプルを…
        - こっちではReduxとの対比で，GraphQLとかReactContextとか？
        - [Redux vs. React Context: Which Should You Use?](https://www.fireup.pro/blog/redux-vs-react-context-which-should-you-use)
- [ ] コンポネントの更新と合わせてURLのパラメータ変更もできること
    - もへじの編綴のスライダータブの記憶できるようになるといい…．別サイトから戻った時に再現できる．
- [ ] GraphQL触ってみる
    - 参考になりそう
        - [Querying your Redux store with GraphQL](https://madewithlove.com/blog/software-engineering/querying-your-redux-store-with-graphql/)
- [ ] React版DailyReportub実装
    - [こっち](https://github.com/KagenoMoheji/jQuery-DailyReportub)の方で，jQueryとreactでディレクトリ作って開発がよさげ
- [ ] タスク管理アプリを自作する
    - Asanaのタスク管理
        - バックエンドのDBも交えて．
    - Asana/Notionのカレンダー・タイムライン・カンバンへの変換
    - 各タスクは，「生成日時(ミリ秒)xPJIDxUUID」で一意のIDを持つ感じ？
    - タスク名のインクリメンタル検索
    - オフラインでの作業のオンラインへの更新
        - localstorageかJSONに，変更のあったタスク(順位が変わったとか)すべてを更新後の値のみ持たせて，オンラインになったときにループで更新？
    - 上記に加え，我流PBL/SBL(ProductionBackLog/SprintBackLog．「Item -> 難易度x優先順位 -> 優先順位xカンバン」の流れ)への変換
- [ ] Markdownリアルタイム変換を自作する
    - JSONで記号<->タグ&CSSを設定して，フロントエンド完結でリアルタイム変換できるようにしたい．
    - ライブラリ化してリリース
    - この自作ライブラリは，もへじの編綴とDocdMapで使う
    - 通常左右配置だが，レスポンシブデザインで上下配置に．
    - 2画面のスクロールは同期させる(JSで？)
    - 画像アップロードについて，クリップボードペーストでできるといいな…
        - [web 画像アップロード クリップボード | Google検索](https://www.google.com/search?sxsrf=ALeKk02R5lb7VDlECt-HBGqe3EVdrR7diw%3A1613972685761&ei=zUQzYJf7LZWJoASj8ZugBg&q=web+%E7%94%BB%E5%83%8F%E3%82%A2%E3%83%83%E3%83%97%E3%83%AD%E3%83%BC%E3%83%89+%E3%82%AF%E3%83%AA%E3%83%83%E3%83%97%E3%83%9C%E3%83%BC%E3%83%89&oq=web+%E7%94%BB%E5%83%8F%E3%82%A2%E3%83%83%E3%83%97%E3%83%AD%E3%83%BC%E3%83%89+%E3%82%AF%E3%83%AA%E3%83%83%E3%83%97%E3%83%9C%E3%83%BC%E3%83%89&gs_lcp=Cgdnd3Mtd2l6EAMyBQghEKABOgcIIxCwAxAnOgQIIxAnOgQIABAeOgYIABAFEB46BQgAEM0CUPRNWO1uYLJxaARwAHgAgAG1AYgBwxCSAQQxOC40mAEAoAEBqgEHZ3dzLXdpesgBAcABAQ&sclient=gws-wiz&ved=0ahUKEwjXlfLk5PzuAhWVBIgKHaP4BmQQ4dUDCA0&uact=5)
- [ ] MindMapライブラリを自作する
    - 無限のキャンバスや，そこでの現在位置情報の取得・保持はどうやって実現するのだろう？
        - マイナス座標も無限に取得して，画面現在地は，ウィンドウ中央または左上の座標を取得する？
- [ ] バックエンドにてNodeJSの代わりにRustでやる
    - RustでReactレンダリングどうやるんだろ？？
        - rusty_v8とかいうRustのJSエンジンがあるっぽい？



### 各種ReactAppの実装予定メモ
#### もへじの編綴
- SSRで記事一覧無しのHTMLを生成してフロントに渡し，ページ表示時に(デフォルトで0タブ目＝最新の記事番号から7記事を)APIで取得して表示させる，形にできないか？
    - 他のページも全て生成済みで渡しておく．
    - 他のページの記事一覧やコンタクトフォームもAPIによるものとし，全ページリレンダリングはしない形．


#### DocdMap
- Canvasでマインドマップ描きたいなぁ…


#### WebARWhiteboard
- 手の画像認識に応じてカメラ映像のCanvas上に図形描写したいなぁ…

#### ARTextSearch
- WebARWhiteboardと同じくカメラ映像と画像認識結果をCanvas上に図形描画したいなぁ

#### Quolog
- 引用を軸としたブログフレームワーク

