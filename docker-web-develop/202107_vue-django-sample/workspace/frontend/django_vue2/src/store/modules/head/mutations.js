import state from "./state"

export default {
    updateUserAutorized: (state, userAuthorized) => {
        // ここでストアのemailを更新
        state.userInfo.email = userAuthorized.email;
    },
};