<template>
    <div class="comp-hellovue">
        <!--
        静的ファイルのパスは，"~{alias}/..."で書かないといけないらしい？
        https://b.0218.jp/20180331003845.html
        -->
        <img alt="Vue logo" src="~@/assets/logo.png" />
        <HelloWorld msg="Welcome to Your Vue.js App" />
        <!-- 属性における"$router"にthisは不要 -->
        <button
            class="reset-btn"
            type="button"
            @click="$router.push('/Sample')"
        >
            Go to Sample
        </button>
    </div>
</template>

<script>
import HelloWorld from "@/components/organisms/HelloWorld.vue";

// VueコンポーネントにおいてNamedExportは使えず，DefaultExportでないと動かないらしい．
export default {
    name: "HelloVue",
    components: {
        HelloWorld,
    },
};
</script>

<style scoped lang="scss">
.comp-hellovue {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
