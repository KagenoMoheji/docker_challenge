<template>
    <div class="comp-responsiveelementui1">
        <el-row class="menu-btns flex-mid">
            <el-col :span="8" class="flex-mid">
                <el-button type="primary">
                    <i class="el-icon-document-add"></i>
                    申請書作成
                </el-button>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="8" class="flex-mid">
                <el-button type="primary">
                    <i class="el-icon-document-copy"></i>
                    申請書一覧
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "ResponsiveElementUI1",
};
</script>

<style scoped lang="scss">
.comp-responsiveelementui1 {
    margin: 60px 0;
    .menu-btns {
        display: flex;
        flex-direction: row;
        /deep/ .el-button {
            width: 500px;
            font-size: 20px;
            padding: 50px 0;
        }
    }
    @media screen and (max-width: 760px) {
        .menu-btns {
            flex-direction: column;
            /deep/ .el-col {
                width: 100%;
                margin: 10px 0;
            }
            /deep/ .el-button {
                width: 90%;
            }
        }
    }
}
</style>
