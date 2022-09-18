import state from "@/store/modules/head/state";
import actions from "@/store/modules/head/actions";
import mutations from "@/store/modules/head/mutations";
import getters from "@/store/modules/head/getters";

/*
- Refs
    - https://www.npmjs.com/package/vue-head
    - https://qiita.com/DaisukeNishi/items/62270ec742daaeab4fad
*/

export default {
    namespaced: true,
    state: state,
    actions: actions,
    mutations: mutations,
    getters: getters,
};
