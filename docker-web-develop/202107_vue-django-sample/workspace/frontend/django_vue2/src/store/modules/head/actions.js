このへんでapiフォルダでaxiosを使ってAPI叩く関数をimportしてAPI叩くようにする

APIでストアのデータをサーバ(DB)に渡したり，サーバ(DB)からのデータをストアに格納したりする

apiフォルダへのファイル分割はまだ難しいと思うので，actionの中でaxiosのコード書くとこから始めて良いかも

import { fetchUserAuthorized } from "@/api/user";

export default {
    fetchUserAuthorized: (context) => {
        fetchUserAuthorized()
            .then((res) => {
                // ここでAPI処理が成功した場合の処理
                // 下記はストアのmutationsでストアに格納してる
                context.commit("updateUserAuthorized", res.data);
            })
            .catch((err) => {
                if (err.response) {
                    // ここでAPI処理が失敗，例えば401エラーとか500エラーのときの処理
                    if (err.response.status === 403) {
                        console.error("ログインしてねーじゃんよ");
                    }
                } else {
                    // API通信以外の例外処理
                }
            });
    },
};