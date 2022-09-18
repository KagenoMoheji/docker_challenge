<template>
    <div class="comp-header">
        <div class="apptititle fixedW">アプリ名</div>
        <div class="flexW"></div>
        <div class="humbmenu fixedW"><SideHumbargerMenu /></div>
    </div>
</template>

<script>
import SideHumbargerMenu from "@/components/organisms/SideHumbargerMenu";
export default {
    name: "Header",
    components: {
        SideHumbargerMenu,
    },
};
</script>

<style scoped lang="scss">
.comp-header {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 90px;
    background-color: #fff;
    z-index: 100;

    display: flex;
    flex-direction: row;
    align-items: center;
    .apptitle {
        width: 300px;
    }
    .humbmenu {
        width: 100px;
    }
}
</style>
