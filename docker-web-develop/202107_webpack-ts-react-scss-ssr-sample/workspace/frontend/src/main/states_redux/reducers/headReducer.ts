import { HeadState } from "~/states_redux/types";
import { updateHeadAction, HeadAction } from "~/states_redux/actions";

const initialState: HeadState = {
    title: "SampleReactApp",
    description: "説明だよ説明だよ",
};

export const headReducer = (
    state: HeadState = initialState,
    action: HeadAction
): HeadState => {
    switch (action.type) {
        case updateHeadAction(action.payload).type: // CHECK: 前は引数無しにしてたけど，undefined(～?)の兼ね合いを考慮した結果，引数必須ルールを実現するために，引数ありに変更した．
            return {
                // TODO: actionまたはaction.payloadがundefinedかでupdateHead()を呼ばないようにしたら解決できるか検証
                ...state,
                ...updateHead(action.payload), // CHECK: Pythonのように連想配列を複数引数に展開して渡すことができなかったので，Stateを型に指定して連想配列をそのまま渡す形にした．
            };
        default:
            return state;
    }
};

export const updateHead = (state: HeadState): HeadState => {
    return {
        title: state.title,
        description: state.description,
    };
};
