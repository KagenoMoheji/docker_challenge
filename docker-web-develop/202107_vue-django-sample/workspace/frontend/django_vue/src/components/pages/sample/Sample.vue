<template>
    <div class="comp-sample">
        <div>Hello Sample</div>
    </div>
</template>

<script>
// main.jsでappに登録して全コンポーネントに(this.$routerとして)伝搬させているのでimport不要
// import RootRouter from "@/routes/Root";

export default {
    name: "Sample",
    mounted() {
        /*
        初回マウント時の処理を記述．
        */
        this.checkLoggedIn();
    },
    methods: {
        /*
        本コンポーネント(をクラスと見なした)のメソッド群を記述．
        */
        checkLoggedIn() {
            // 未認証の場合は認証画面に飛ばす．
            // this.$router.push("/auth"); // こっちだとリダイレクトされててワンプシュで戻りづらい．ログアウトで使うやつ．
            this.$router.replace("/auth"); // こっちだと戻りやすい
            // 下記はRootRouterからサブPathいけるかの確認．=> いけた
            // RootRouter.push("/sample/user");
        },
    },
};
</script>
