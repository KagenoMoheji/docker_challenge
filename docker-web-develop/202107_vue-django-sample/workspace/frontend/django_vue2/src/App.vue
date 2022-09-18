<template>
    <div class="comp-app">
        <HeaderVueRouter />
    </div>
</template>

<script>
/*
- Refs
    - ハンバーガーメニュー
        - https://codesandbox.io/s/jvlj79k825?file=/index.js
*/

import HeaderVueRouter from "@/components/templates/HeaderVueRouter";
// VueコンポーネントにおいてNamedExportは使えず，DefaultExportでないと動かないらしい．
export default {
    name: "App",
    components: {
        HeaderVueRouter,
    },
};
</script>

<!--
<style src="@/styles/base.css">
/*
初期化CSSについて，ここのように親コンポーネントでglobalに宣言しても良いし，
各コンポーネントにおいてscopedで同じsrc指定をするのも良い．
今回のglobalでのCSSの導入は，main.jsでのimportを使う．
https://newbedev.com/css-vue-3-import-css-in-component-code-example
*/
</style>
-->
