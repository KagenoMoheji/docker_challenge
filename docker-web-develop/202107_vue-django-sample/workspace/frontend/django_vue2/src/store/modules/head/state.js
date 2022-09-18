export default {
    /*
    stateの構成は基本的にvue-headのheadプロパティの構成に倣う．
    - Refs
        - https://www.npmjs.com/package/vue-head#examples-new-syntax
    */
    userInfo: {
        // ログインユーザのメアドをストアで管理
        email: "",
    },
    head: {
        title: "アプリ名",
        meta: [
            {
                charset: "utf-8",
            },
            {
                name: "description",
                content: "説明(仮)",
            },
            {
                name: "viewport",
                content:
                    "width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0",
            },
            //    {
            //        property: "og:title",
            //        content: "",
            //    },
            //    {
            //        property: "og:description",
            //        content: "",
            //    },
            //    {
            //        property: "og:image",
            //        content: "",
            //    },
            //    {
            //        name: "twitter:card",
            //        content: "summary_large_image",
            //    },
            //    {
            //        name: "twitter:creator",
            //        content: "",
            //    },
        ],
        link: [
            //    {
            //        // 基本的にここで指定して変更しない
            //        rel: "icon",
            //        href: "",
            //        type: "",
            //        sizes: "",
            //    },
        ],
        scripts: [],
        style: [],
    },
};
