<template>
    <div class="comp-app">
        <!-- <el-menu v-bind:default-active="activeIndex" mode="horizontal" router>
            <!-
            el-menuにてrouterオブジェクト忘れないように！！
            indexはel-menuの下部バーの場所を示してる．
            ->
            <el-menu-item index="HelloVue" v-bind:route="{ name: 'HelloVue' }">
                HelloVue
            </el-menu-item>
            <el-menu-item index="Sample" v-bind:route="{ name: 'Sample' }">
                Sample
            </el-menu-item>
            <el-menu-item
                index="ElementUI"
                v-bind:route="{ name: 'ElementUI' }"
            >
                ElementUI
            </el-menu-item>
        </el-menu> -->
        <el-menu v-bind:default-active="activeIndex" mode="horizontal" router>
            <el-row class="nav">
                <el-col class="nav-btn-frame fixedW flex-mid">
                    <el-menu-item
                        index="HelloVue"
                        v-bind:route="{ name: 'HelloVue' }"
                    >
                        HelloVue
                    </el-menu-item>
                </el-col>
                <el-col class="nav-btn-frame fixedW flex-mid">
                    <el-menu-item
                        index="Sample"
                        v-bind:route="{ name: 'Sample' }"
                    >
                        Sample
                    </el-menu-item>
                </el-col>
                <el-col class="nav-btn-frame fixedW flex-mid">
                    <el-menu-item
                        index="ElementUI"
                        v-bind:route="{ name: 'ElementUI' }"
                    >
                        ElementUI
                    </el-menu-item>
                </el-col>
                <el-col class="flexW"></el-col>
                <el-col class="account-menu fixedW">
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            <span class="account-menu-name flexW">
                                ユーザ名ほげふが
                            </span>
                            <span class="account-menu-icon fixedW">
                                <i
                                    class="el-icon-arrow-down el-icon--right"
                                ></i>
                            </span>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>ユーザ設定</el-dropdown-item>
                            <el-dropdown-item>ログアウト</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-menu>
        <div>※ヘッダーはElementUIでできています．</div>
        <!-- 下記でルータに応じた子コンポネントが描画される -->
        <router-view />
    </div>
</template>

<script>
/*
- Refs
    - ハンバーガーメニュー
        - https://codesandbox.io/s/jvlj79k825?file=/index.js
*/
// VueコンポーネントにおいてNamedExportは使えず，DefaultExportでないと動かないらしい．
export default {
    name: "App",
    data() {
        return {
            // マウントが終わってないうちでは，"this.$route.name"はundefinedになっている懸念
            activeIndex: this.$route.name,
        };
    },
    // mounted() {
    //     // マウント完了後に読み込まれたページを属性"route.name"でアクティブ化
    //     this.activeIndex = this.$route.name;
    // },
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
.comp-app {
    .nav {
        display: flex;
        flex-direction: row;
        .nav-btn-frame {
            /*
            - .nav-btn-frame.fixedWでもOK
            - .el-colの場合，.fixedWを付与された.el-col自身においてwidthを指定する仕様．
                - なぜなら.el-colには":span=24"がデフォルトで付与されて幅を勝手に付けてしまうから．
            - el接頭語がない普通のclass属性の場合はel要素で指定されたものであっても"/deep/"無しで実装すべきらしい？
            */
            width: 100px;
        }
        .account-menu {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 0 10px 0 0;
            width: 250px;
            /deep/ .el-dropdown-link {
                // TODO ユーザ名と三角あいこんを分離させて，三角アイコンを中央配置
                display: flex;
                flex-direction: row;
                .account-menu-icon.fixedW {
                    width: 50px;
                }
            }
        }
    }
}
</style>
