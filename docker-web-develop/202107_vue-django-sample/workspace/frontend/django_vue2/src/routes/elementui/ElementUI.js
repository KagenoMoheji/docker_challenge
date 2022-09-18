import ElementUI from "@/components/pages/elementui/ElementUI";
import ResponsiveElementUI1 from "@/components/pages/elementui/ResponsiveElementUI1";

export default [
    /*
    root以外のルーティングパスではスラッシュ付けたらダメっぽい…？
    */
    {
        path: "",
        name: "ElementUI",
        component: ElementUI,
    },
    {
        path: "responsive/1",
        name: "ResponsiveElementUI1",
        component: ResponsiveElementUI1,
    },
];
