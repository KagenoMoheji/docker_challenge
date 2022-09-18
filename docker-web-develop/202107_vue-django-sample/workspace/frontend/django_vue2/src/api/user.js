// ログインユーザ情報に関するAPI操作

import axios from "axios";

export const fetchUserAutorized = () => {
    /*
    ログイン済みユーザ(Authorized User)をfetch(getでもよい)する
    */
    // このへんでデータ加工(APIリクエストのデータ形式にしたり暗号化したり)してAPIのURLに乗っけて送る感じかな
    return axios.get(
        // DjangoとかサーバのControllerで"/user/logined"(このリクエストを受けたら，サーバにあるログイン済みユーザのセッション情報を返す)のルーティングが用意されている前提
        "http://localhost/user/logined",
        {}
    );
}

HTTPリクエスとの基本的なメソッドかな
GET/POST/PUT/PATCH/DELETE

// DB接続はバックエンドの役割
// 例えば下記のようなユーザメールを変更するSQLがあったとして，バックエンドのリクエストを受け取ったあとに，受け取ったデータ(emailやuserid)をSQLに埋め込んで実行する
UPDATE user_info WITH email = {email} WHERE userid = {userid}