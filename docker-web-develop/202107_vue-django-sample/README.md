# django_vue
## メモ
- 本当はdockerコンテナをdev-frontend/dev-backendに分けてみたかったけど，急ぎだったのでひとまず同じコンテナに両方の環境混ぜて，開発ディレクトリで分ける．frontendからはできたものをbackendにディレクトリごとコピペか？怖いな…同期させたい
- 環境構築の流れ予想
    1. バックエンドの構築
    2. バックエンドのディレクトリに則り，フロントエンド(NodeJS)の構築

## 参考サイト
- Django
    - [はじめての Django アプリ作成、その 1](https://docs.djangoproject.com/ja/3.2/intro/tutorial01/)
    - [プロジェクトを作成しよう！](https://tutorial.djangogirls.org/ja/django_start_project/)
        - Admin画面についても書かれてる
    - [DjangoとVue.jsで作るWEBアプリ（その2: 認証機能編）](https://nmomos.com/tips/2019/07/18/django-vuejs-2/)
    - [【次の祝日はいつですか】Vue CLIとDjango REST frameworkでREST APIを実装する](https://zenn.dev/selfsryo/articles/fbbf7ee62f703c630a45)
    - [[Python] Djangoで注文アプリケーションを作る（inline-formsets 使用方法）](https://qiita.com/okoppe8/items/3a8a5c8db72aa0dded91)
    - [Djangoのプロジェクトを始める](https://qiita.com/kwashi/items/d0f3c319725c4f480de5)
    - 認証系
        - [Azure AD で OIDC 認証するアプリを作ってみる](https://qiita.com/tomatsue/items/9d64fd22281a48d5f474)
            - DjangoでOIDC認証
        - [Python Django Web アプリを作成する](https://docs.microsoft.com/ja-jp/graph/tutorials/python?tutorial-step=1)
            - DjangoでOIDC?OAuth?認証
- Vue
    - [自分メモ](https://docs.google.com/document/d/1BAjxUcUlRS1PPZZ8lY2MFGUiirbq2f6hLuU14oaCs4Q/edit)
    - [vue-cli 3.0で始めるPWAとVue.jsのconfig周り](https://www.maytry.net/start-pwa-by-vue-cli-3/)
    - [Vue.jsを100時間勉強して分かったこと](https://qiita.com/kskinaba/items/3e8887d45b11f9132012)
    - [ネストされたvue routerを別ファイルで管理する](https://qiita.com/ultrasevenstar/items/6f543e84372def86ed69)
    - [Can i split up children routes into component files?](https://stackoverflow.com/a/57345055/15842506)
    - [Vue.jsのrender: h => h(App)について調べた](https://qiita.com/teinen_qiita/items/ed1bb1909a17f9ca9daa)
    - [webpackのaliasをVue単一コンポーネントのstyle内で使用する方法](https://b.0218.jp/20180331003845.html)
    - [「assets」からの指定方法](https://qiita.com/hiroyukiwk/items/a26e767d193ef8d9155b#%E7%94%BB%E5%83%8F%E3%81%AE%E6%A0%BC%E7%B4%8D%E5%A0%B4%E6%89%80)
        - 静的ファイルのパスは，`~{alias}/...`で書かないといけないらしい？
    - [【Vue】コンポーネントでnamed exportは使えないと知った話](https://qiita.com/hinaqiita/items/fea390538bcb4d839657)
    - [既存のVue.jsプロジェクトをVue 3へ移行したときに必要だった修正まとめ](https://qiita.com/laineus/items/d1f1f7972f521556a788)
        - Vue3にバージョンアップするに当たり，下記が変わったらしい
            - `new Vue()`/`new Router()`/...から`createApp()`/`createRouter()`/...
            - `vue.config.js`を手動作成(してWebpack設定)する必要あり
    - [VuetifyのWebpack でのインストール](https://vuetifyjs.com/ja/getting-started/installation/#webpack-3067306e30a430f330b930c830fc30eb)
    - [vue 3 import css in component code example](https://newbedev.com/css-vue-3-import-css-in-component-code-example)
    - [Scoped CSSにおけるCSS設計手法](https://ics.media/entry/200515/)
        - 各コンポネントのルートタグにコンポネント名そのままのclass名を与え，親コンポネントでそのclass名を使わないルールがいいかも
    - [Vue.jsでディープセレクタを使って親コンポーネントから子コンポーネントの要素にスタイルを適用させる](https://designsupply-web.com/media/knowledgeside/4833/)
    - [Vue.jsでコンポーネントの値をCSSに渡す方法](https://yumanoblog.com/vue-component-css/)
    - [VueRouter基本ルーティング記法まとめ](https://www.ritolab.com/entry/181)
    - [[Vue.js] ルーティング による画面遷移](https://qiita.com/ksh-fthr/items/a4ac1d04d9923c550cd7)
    - [プログラムによるナビゲーション](https://router.vuejs.org/ja/guide/essentials/navigation.html)
        - `app.use(router)`しておけば，`this.$router`で呼び出せる？
    - [Vue.js Push and the back button](https://stackoverflow.com/a/41560346/15842506)
    - [今さら聞けない？Vue Router](https://qiita.com/hshota28/items/765cf903f055754f7557)
    - [Enclosing a router-link tag in a button in vuejs](https://stackoverflow.com/a/53749696/15842506)
    - [Vue.jsのv-modelを正しく使う](https://qiita.com/simezi9/items/c27d69f17d2d08722b3a)


- (関係ないけど)Flask
    - 認証系
        - [ユーザーをサインインさせる Web アプリ:コード構成](https://docs.microsoft.com/ja-jp/azure/active-directory/develop/scenario-web-app-sign-user-app-configuration?tabs=python)
            - FlaskでOIDC認証するコードが書かれてるっぽい
        - [クイック スタート: Python Web アプリに Microsoft でサインインを追加する](https://docs.microsoft.com/ja-jp/azure/active-directory/develop/quickstart-v2-python-webapp)
        - [Flask-OIDC — Flask-OIDC 1.1 documentation](https://flask-oidc.readthedocs.io/en/latest/)
    - 管理者画面
        - [Introduction To Flask-Admin](https://flask-admin.readthedocs.io/en/latest/introduction/)
        - [Flask-AdminとFlask-LoginによるDB管理者画面の実装](https://qiita.com/FPC_COMMUNITY/items/c3bad2c95a577fcc9c9d)
        - [【Flask】flask-adminの使い方とデータベース管理画面(ダッシュボード)の実装](https://creepfablic.site/2020/05/03/python-flask-flask-admin/)
    - Vue
        - [FlaskとVue.jsでSPA Webアプリ開発](https://qiita.com/y-tsutsu/items/67f71fc8430a199a3efd)



## 環境
- Python: 3.9.6
    - Django: 3.2.5
- NodeJS: 6.14.13
    - Vue: 

