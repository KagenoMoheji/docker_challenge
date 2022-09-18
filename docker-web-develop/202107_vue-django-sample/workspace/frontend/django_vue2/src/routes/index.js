import Vue from "vue";
import VueRouter from "vue-router";
import EmptyVueRouter from "@/components/templates/EmptyVueRouter";
import HelloVue from "@/components/pages/HelloVue";
import Auth from "@/components/pages/Auth";
import Sample from "@/components/pages/sample/Sample";
import SampleRouter from "@/routes/sample/Sample";
import ElementUIRouter from "@/routes/elementui/ElementUI";

// 下記をしとかないと，Vueアプリ構成要素全体に対してVueRouterを伝搬させられない
Vue.use(VueRouter);

export default new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        /*
        rootのルーティングパスではスラッシュが無いとダメ．
        */
        {
            path: "/",
            name: "HelloVue", // このnameが，"v-bind:route"で使われる
            component: HelloVue,
        },
        {
            path: "/auth",
            name: "Auth",
            component: Auth,
        },
        {
            path: "/sample",
            name: "Sample",
            component: Sample,
            children: SampleRouter,
        },
        {
            /*
            - 共通テンプレートを使ってサブパスのコンポーネントを描写する方法
                - https://jsfiddle.net/yyx990803/L7hscd8h/
            */
            path: "/elementui",
            name: "ElementUIRoot",
            component: EmptyVueRouter,
            children: ElementUIRouter,
        },
    ],
});

// コンポーネントではないので，NamedExportが使える．
// ただ，1ファイルに付き1つのexportしかしなさそうなので，NamedExportの必要性を感じない．
// 下記の場合，import側では"import { RootRouter }"としないといけない．
// export const RootRouter = new VueRouter({
//     mode: history, // TODO: なにこれ？
//     base: process.env.BASE_URL, // TODO: なにこれ？
//     routes: [
//         {
//             path: "/",
//             name: "HelloVue",
//             component: HelloVue,
//         },
//         {
//             path: "/auth",
//             name: "Auth",
//             component: Auth,
//         },
//         {
//             path: "/sample",
//             name: "Sample",
//             component: Sample,
//             children: SampleRouter,
//         },
//     ],
// });
