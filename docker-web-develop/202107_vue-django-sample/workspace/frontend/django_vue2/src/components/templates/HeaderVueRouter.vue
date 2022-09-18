<template>
    <div class="tmpl-headervuerouter">
        <Header />
        <router-view />
    </div>
</template>

<script>
import Header from "@/components/organisms/Header";
export default {
    name: "HeaderVueRouter",
    components: {
        Header,
    },
    head: {
        title() {
            return {
                inner: this.getHead.title,
            };
        },
        meta() {
            return this.getHead.meta;
        },
    },
    computed: {
        getHead() {
            return this.$store.getters["head/head"];
        },
    },
};
</script>
