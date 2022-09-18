<template>
    <div class="comp-sidehumbargermenu">
        <div class="humb-trigger" v-on:click="switchIsHumbOpen()">
            <div class="humb-icon" :class="{ 'humb-open': isHumbOpen }">
                <span class="humb-icon-line humb-icon-line-1"></span>
                <span class="humb-icon-line humb-icon-line-2"></span>
                <span class="humb-icon-line humb-icon-line-3"></span>
            </div>
        </div>
        <div class="humb-content" :class="{ 'humb-open': isHumbOpen }">
            <el-menu mode="vertical">
                <el-submenu index="1">
                    <template slot="title">account name</template>
                    <el-menu-item index="1-1">settings</el-menu-item>
                </el-submenu>
                <el-menu-item index="2">
                    <router-link to="/">Top</router-link>
                </el-menu-item>
                <el-menu-item index="3">
                    <router-link to="/sample">Sample</router-link>
                </el-menu-item>
                <el-menu-item index="4">
                    <router-link to="/elementui">ElementUI</router-link>
                </el-menu-item>
            </el-menu>
        </div>
    </div>
</template>

<script>
export default {
    name: "SideHumbargerMenu",
    data() {
        return {
            isHumbOpen: false,
        };
    },
    mounted() {
        document.body.addEventListener(
            "click",
            this.onListenClickBody.bind(this),
            true
        );
    },
    methods: {
        switchIsHumbOpen() {
            // WARNING: アロー関数だとdataプロパティを読み込めなくなるらしい…
            this.isHumbOpen = !this.isHumbOpen;
        },
        onListenClickBody(eve) {
            if (!this.$el.contains(eve.target)) {
                // 本コンポーネント(ハンバーガーメニュー)以外クリックされたらハンバーガーメニューを閉じる
                if (this.isHumbOpen) {
                    this.switchIsHumbOpen();
                }
            }
        },
    },
};
</script>

<style scoped lang="scss">
.comp-sidehumbargermenu {
    .humb-trigger {
        width: 50px; // こっちでhumb-iconのサイズ決める．正直各場所変だけどこっちじゃないとうまく行かない…
        height: 50px; // こっちでhumb-iconのサイズ決める．正直各場所変だけどこっちじゃないとうまく行かない…
        position: relative;
        left: 85%; // これで右端からどれくらい左に寄せるか微調整
        transform: translateX(-100%);
        color: #ccc;
        z-index: 500;
        .humb-icon {
            cursor: pointer;
            .humb-icon-line {
                position: absolute;
                width: 100%;
                border: 2px solid #bbb;
                background-color: #bbb;
                transition: all 0.3s;
            }
            .humb-icon-line-1 {
                top: 25%;
            }
            .humb-icon-line-2 {
                top: 50%;
            }
            .humb-icon-line-3 {
                top: 75%;
            }
            &.humb-open {
                // ハンバーガーメニューが開かれている時のスタイル
                .humb-icon-line {
                    border: 2px solid #ddd;
                    background: #ddd;
                }
                .humb-icon-line-1 {
                    top: 50%;
                    transform: rotate(45deg);
                }
                .humb-icon-line-2 {
                    width: 0;
                    border: none;
                }
                .humb-icon-line-3 {
                    top: 50%;
                    transform: rotate(-45deg);
                }
            }
        }
    }
    /deep/ .humb-content {
        position: fixed;
        top: 0;
        right: -100%; // デフォルトでは右側にオーバーで隠す
        padding: 90px 0 0 0; // topはヘッダの高さに合わせる
        width: 300px;
        height: 100%;
        z-index: 499;
        transition: all 0.6s;
        overflow-y: auto;
        background-color: #545c64;
        * {
            // 子要素以下全てに対する共通スタイル
            // WARNING: カレント要素に「/deep/」をつけないとelementui系タグに適用されない場合もある
            color: #ddd;
        }
        .el-menu {
            border: none; // el-menuでデフォルトで描画される右線を消す
        }
        .el-menu-item,
        .el-submenu {
            background-color: #545c64;
        }
        .el-menu-item:hover,
        .el-submenu__title:hover {
            background-color: darken(#545c64, 10%);
        }
        &.humb-open {
            // class属性でand条件
            right: 0;
        }
    }
    @media screen and (max-width: 760px) {
        .humb-content {
            width: 100%;
        }
    }
}
</style>
