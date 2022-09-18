<template>
    <v-app>
        <router-view />
    </v-app>
</template>

<script>
// VueコンポーネントにおいてNamedExportは使えず，DefaultExportでないと動かないらしい．
export default {
    name: "App",
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
<style lang="scss">
/*
マウントする#appタグ以下全コンポーネントに対して適用するCSS．
*/
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    // color: #2c3e50;
    // margin-top: 60px;
}
</style>
