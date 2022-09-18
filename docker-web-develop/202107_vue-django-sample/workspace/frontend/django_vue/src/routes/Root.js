import { createRouter, createWebHistory } from "vue-router";
import HelloVue from "@/components/pages/HelloVue";
import Auth from "@/components/pages/Auth";
import Sample from "@/components/pages/sample/Sample";
import SampleRouter from "@/routes/sample/Sample";

export default createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "HelloVue",
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
    ],
});

// コンポーネントではないので，NamedExportが使える．
// ただ，1ファイルに付き1つのexportしかしなさそうなので，NamedExportの必要性を感じない．
// 下記の場合，import側では"import { RootRouter }"としないといけない．
// export const RootRouter = createRouter({
//     history: createWebHistory(process.env.BASE_URL), // TODO: なにこれ？
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
