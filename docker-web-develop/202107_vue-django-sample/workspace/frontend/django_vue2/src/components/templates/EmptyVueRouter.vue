<template>
    <div class="templ-emptyvuerouter">
        <!-- 下記でルータに応じた子コンポネントが描画される -->
        <router-view />
    </div>
</template>

<script>
export default {
    name: "EmptyVueRouter",
};
</script>
