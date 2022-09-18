import Vue from "vue";
import App from "@/App.vue";
import RootRouter from "@/routes";
import store from "@/store";
import "@/plugins/elementui";
import "@/plugins/vuehead";
/*
以下，CSSのglobalインポート．
下記のようにCSSをJSでimportすると，すべてのコンポーネントのCSSに対し適用される．漏れが無くなるらしい．
*/
import "@/styles/base.scss";

Vue.config.productionTip = false;

new Vue({
    router: RootRouter,
    store: store,
    render: (h) => h(App),
}).$mount("#app");
