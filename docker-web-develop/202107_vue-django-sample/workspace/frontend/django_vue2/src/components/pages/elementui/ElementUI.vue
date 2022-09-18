<template>
    <div class="comp-elementui">
        <div class="flex-mid tbltool">
            <el-select v-model="searchCols" placeholder="検索カラム" multiple>
                <el-option
                    v-for="item in getVisibleColDefs()"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                ></el-option>
            </el-select>
            <el-input
                v-model="searchWord"
                placeholder="検索ワード"
                size="normal"
                clearable
            ></el-input>
        </div>
        <div class="flex-mid">
            <!--
            - v-bindにsyncをつけると，その値が変わるたびに依存(親)コンポネントで再描画をしてくれるっぽい？
                - https://itoka.hatenadiary.com/entry/2021/05/06/005644
            - pager-countは5以上の奇数でないとconsoleで警告出るらしい
                - https://github.com/ElemeFE/element/issues/14055#issuecomment-473916594
            -->
            <el-pagination
                v-bind:current-page.sync="currentPageNum"
                v-bind:page-sizes="pageSizes"
                v-bind:page-size.sync="pageSize"
                v-bind:pager-count="4"
                layout="total, sizes, prev, pager, next, jumper"
                v-bind:total="fetchedData.length"
            ></el-pagination>
        </div>
        <div class="flex-mid">
            <!--
            - computedの場合は括弧付けず引数を渡さないルールらしい．つまりdataの変数へはthisでアクセスする．
            - computedは同じcomputedの関数を互いに呼び出すのではなく，dataの変数を順次アクセスすることで逐次的に実行される関係であることを意識する必要がある？
                - https://stackoverflow.com/questions/41173998/is-it-possible-to-use-the-computed-properties-to-compute-another-properties-in-v
                - https://stackoverflow.com/questions/34551850/vue-js-computed-property-not-working
                - https://stackoverflow.com/questions/40522634/can-i-pass-parameters-in-computed-properties-in-vue-js
            getTblDataInPage
            -->
            <el-table
                v-bind:data="
                    getTblDataInPage(
                        filterTblData(fetchedData, searchWord, searchCols),
                        pageSize,
                        currentPageNum
                    )
                "
                border
                stripe
            >
                <!--
                (*1)テーブルをカラムの描写から自動でやらせるなら下記が良い．
                ただしカラムの中に子要素を作らない場合のみ．
                <el-table-column v-for="col in defTblData"
                    v-bind:prop="col.label"
                    v-bind:key="col.label"
                    v-bind:label="col.label"
                    v-bind:width="col.width">
                </el-table-column>
                -->
                <el-table-column prop="name" label="Name">
                    <template v-slot:default="table">
                        <template v-if="table.row.link">
                            <!--
                            linkカラムは，それが列を持たずに，ここのリンク化に用いる．
                            componentタグを使うと，動的にタグを分岐指定できる．
                            -->
                            <component
                                v-bind:is="
                                    isInternalLink(table.row.link)
                                        ? 'router-link'
                                        : 'a'
                                "
                                v-bind:to="
                                    isInternalLink(table.row.link)
                                        ? table.row.link
                                        : ''
                                "
                                v-bind:href="
                                    isInternalLink(table.row.link)
                                        ? ''
                                        : table.row.link
                                "
                            >
                                {{ table.row.name }}
                            </component>
                        </template>
                        <template v-else>
                            {{ table.row.name }}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="Description"
                    min-width="150"
                ></el-table-column>
            </el-table>
        </div>
        <div class="flex-mid">
            <!--
            - v-bindにsyncをつけると，その値が変わるたびに依存(親)コンポネントで再描画をしてくれるっぽい？
                - https://itoka.hatenadiary.com/entry/2021/05/06/005644
            - pager-countは5以上の奇数でないとconsoleで警告出るらしい
                - https://github.com/ElemeFE/element/issues/14055#issuecomment-473916594

            TODO: pagerのレスポンシブ対応
            -->
            <el-pagination
                v-bind:current-page.sync="currentPageNum"
                v-bind:page-sizes="pageSizes"
                v-bind:page-size.sync="pageSize"
                v-bind:pager-count="4"
                layout="total, sizes, prev, pager, next, jumper"
                v-bind:total="fetchedData.length"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
/*
- Refs
    - テーブル，インクリメントサーチ
        - https://element.eleme.io/#/en-US/component/table#table-with-custom-header1
        - https://stackoverflow.com/a/58265293/15842506
            - インクリメントサーチの関数分離
        - https://stackoverflow.com/a/57689697/15842506
            - リンク化
        - https://stackoverflow.com/a/47666385/15842506
            - ネストされたデータとテーブル
        - https://codepen.io/reijnemans/pen/dyoaxGv
            - ページネーション
    - プルダウン式マルチセレクトボックス
        - https://element.eleme.io/#/en-US/component/select#basic-multiple-select
        - https://stackoverflow.com/questions/49407161/vuejs-use-function-in-v-for
*/
export default {
    name: "ElementUI",
    created() {
        /*
        Vueインスタンスが生成されたとき，つまりDOM描画前に実行する処理．
        */
        // fetchedDataの件数かさ増しのためのダミーデータ
        for (let i = 1; i <= 50; i++) {
            this.fetchedData.push({
                name: `hoge${i}`,
                description: `ほげ${i}`,
            });
        }
    },
    mounted() {
        /*
        DOM描画後に実行する処理．
        */
        /*
        CSSフレームワークでデフォルトでDOM描画されるところに，再描画させる
        */
        // el-paginationに対する変更
        this.rerenderElPagination();
    },
    data() {
        return {
            searchWord: "",
            searchCols: [],
            currentPageNum: 1,
            pageSizes: [10, 25, 50, 100],
            pageSize: 10,
            defTblData: [
                {
                    label: "name",
                    // width: "20%", // (*1)の時に使う
                    colVisible: true,
                },
                {
                    label: "description",
                    // width: "60%", // (*1)の時に使う
                    colVisible: true,
                },
                {
                    label: "link",
                    // width: "20%", // (*1)の時に使う
                    colVisible: false,
                },
            ],
            fetchedData: [
                {
                    name: "ResponsiveRow2ColumnButtons",
                    description: "レスポンシブに横・縦並び切り替えるボタン一覧",
                    link: "/elementui/responsive/1",
                },
                {
                    name: "hoge",
                    description: "",
                    link: "https://router.vuejs.org/ja/api/",
                },
            ],
        };
    },
    methods: {
        filterTblData(tblData, query, cols) {
            /*
            検索ワード・検索対象カラムでlistのインクリメンタルサーチする
            */
            if (cols.length === 0) {
                // 何も選択されていないときは，カラム可視化されるすべてのデータ定義を検索対象にする
                // カラム可視化されないデータ定義は検索対象外の制約にする
                cols = this.getVisibleColDefs().map((d) => d.label);
            }
            return tblData.filter(
                (d) =>
                    !query ||
                    cols.some((col) =>
                        d[col].toLowerCase().includes(query.toLowerCase())
                    )
            );
        },
        getVisibleColDefs() {
            /*
            テーブルのカラムとして可視化されるテーブルデータ定義を取得．
            可視化させないデータ定義は例えばリンク化に使うとかの系統．
            */
            return this.defTblData.filter((d) => d.colVisible);
        },
        getTblDataInPage(tblData, pageSize, currentPageNum) {
            return tblData.slice(
                pageSize * currentPageNum - pageSize,
                pageSize * currentPageNum
            );
        },
        rerenderElPagination() {
            /*
            このコンポーネントにおける.el-pagination共通に対する変更
            */
            [...document.querySelectorAll(".el-pagination")].map(
                (elPagination) => {
                    /*
                    .el-pagination__totalに対する変更
                    */
                    const elPaginationTotalSpans = [
                        ...elPagination.querySelectorAll(
                            ".el-pagination__total"
                        ),
                    ];
                    // console.log(elPaginationTotalSpans);
                    if (elPaginationTotalSpans.length > 0) {
                        elPaginationTotalSpans.map((elPaginationTotalSpan) => {
                            // console.log(elPaginationTotalSpan);
                            // console.log(elPaginationTotalSpan.innerHtml); // undefined
                            // console.log(elPaginationTotalSpan.innerText);
                            // console.log(elPaginationTotalSpan.textContent);
                            elPaginationTotalSpan.innerText = `全${this.fetchedData.length}件`;
                        });
                    }
                }
            );
        },
        isInternalLink(path) {
            /*
            Path(URL)が内部リンクであるか判定
            - https://hafilog.com/nuxt-link-and-atag
            */
            return !/^https?:\/\//.test(path);
        },
    },
};
</script>

<style scoped lang="scss">
.comp-elementui {
    .tbltool {
        display: flex;
        flex-direction: row;
        /deep/ .el-select {
            // テーブルの列幅に合わせる
            width: 54%;
        }
    }
    @media screen and (max-width: 760px) {
        .tbltool {
            flex-direction: column;
            /deep/ .el-select {
                width: 100%;
            }
            /deep/ .el-input {
                width: 100%;
            }
        }
    }

    /deep/ .el-table {
        width: 100%;
    }
    /deep/ .el-table thead th {
        color: #fff;
        background: #aaa;
    }
}
</style>
