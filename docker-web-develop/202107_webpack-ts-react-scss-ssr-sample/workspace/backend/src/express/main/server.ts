import express from "express";
import helmet from "helmet";
import cors from "cors";
import config from "@express/main/conf/config";
import router from "@express/main/routes/root";

/*
必要に応じて設定ファイル"config.ts"の設定値を環境変数に登録する．
- 参考
    - https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html-jp
        - `process.env.環境変数名 = 値`で格納できるらしい
*/
if (config.IS_PROD) {
    if (Object.keys(config).includes("HTTPS_PROXY_PROD")) {
        process.env.https_proxy = config.HTTPS_PROXY_PROD;
    }
} else {
    if (Object.keys(config).includes("HTTPS_PROXY_DEV")) {
        process.env.https_proxy = config.HTTPS_PROXY_DEV;
    }
}

const app = express();
/*
セキュアなサーバにするための設定を登録．
- 参考
    - コード
        - https://qiita.com/macaroniSalad0141/items/5e00aa96138d169dabf5#%E5%BF%85%E8%A6%81%E3%81%AA%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E3%81%AA%E3%81%A9%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB
    - helmet
        - https://qiita.com/qianer-fengtian/items/148602c437e1703aa764
        - https://expressjs.com/ja/advanced/best-practice-security.html
    - cors
        - https://developer.mozilla.org/ja/docs/Web/HTTP/CORS
        - https://zenn.dev/luvmini511/articles/d8b2322e95ff40
        - https://javascript.keicode.com/newjs/what-is-cors.php
        - https://yamory.io/blog/about-cors/
*/
app.use(helmet());
app.use(cors());

/*
その他設定
*/
// app.use(express.json());

/*
Controller(Routes)を定義
- 参考
    - https://swallow-incubate.com/archives/blog/20190425
        - 個人的にしっくりきたMVC的書き方
    - https://qiita.com/kuroneko8960/items/1e6dcd0d897b42567319#%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E6%9B%B8%E3%81%8F
        - 子・孫…とPathをつなぐには`express.Router.use()`を使うと良さげ．
    - https://blog-mk2.d-yama7.com/2020/03/20200314_express-reqres-generics/
        - リクエスト・レスポンスの型定義①．ただ②のRequestの継承の方が良さげ．
    - https://qiita.com/manten120/items/aa87e6af01a0cb87109e#%E6%96%B9%E6%B3%952-request%E5%9E%8B%E3%82%92%E7%B6%99%E6%89%BF%E3%81%97%E3%81%A6%E6%96%B0%E3%81%97%E3%81%84%E5%9E%8B%E3%82%92%E4%BD%9C%E3%82%8B
        - リクエスト・レスポンスの型定義②．
    - https://stackoverflow.com/a/65386795/15842506
        - リクエスト・レスポンスの型定義③．
    - https://qiita.com/ponko2bunbun/items/a703346bedda1ee1a4eb
    - https://qiita.com/bellcrud/items/59722c80c562d6c1d3e3
    - https://blog.capilano-fw.com/?p=5619
    - https://www.wakuwakubank.com/posts/633-nodejs-express-validator/
        - リクエストの型判定とか文字数とかの判定はexpress-validator使ったほうが楽そう．
    -
        - リクエストパラメータの取得
    -
        - chaiでリクエストのテストコード
    - https://auth0.com/blog/node-js-and-typescript-tutorial-build-a-crud-api/
        - async/awaitを使う書き方．どんな効果かはわからん
    - https://peteranderson.me/articles/dependency-injection-with-nodejs-expressjs-and-typescript
        - TypeScriptでのDependencyInjection
    - その他参考
        - https://qiita.com/macaroniSalad0141/items/5e00aa96138d169dabf5
        - https://ccbaxy.xyz/blog/2019/10/16/sequelize1/
        - https://qiita.com/tamura_CD/items/e3abdab9b8c5aa35fa6b
        - https://dev.classmethod.jp/articles/node-js-express-avoiding-garbled-japanese-characters/
            - POSTとかのレスポンスで文字化けたら参考
*/
app.use("/", router);

/*
ポート番号を指定してサーバ起動
*/
app.listen(config.PORT, () => {
    console.log(`HTTP Server launched with 127.0.0.1:${config.PORT}`);
});
