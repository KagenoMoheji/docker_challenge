import { createApp } from "vue";
// import ElementUI from "element-ui";
// import locale from "element-ui/lib/locale/lang/ja";
import App from "@/App.vue";
import RootRouter from "@/routes/Root";
/*
以下，CSSのglobalインポート．
下記のようにCSSをJSでimportすると，すべてのコンポーネントのCSSに対し適用される．漏れが無くなるらしい．
*/
import "@/styles/base.css";
// import "element-ui/lib/theme-chalk/index.css";

const app = createApp(App);
// app.use(ElementUI, { locale });
app.use(RootRouter);
app.mount("#app");
