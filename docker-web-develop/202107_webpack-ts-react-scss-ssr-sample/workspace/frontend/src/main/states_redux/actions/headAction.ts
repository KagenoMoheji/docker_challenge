import { HeadState } from "~/states_redux/types";

export interface HeadAction {
    type: string;
    payload: HeadState; // CHECK: (※1)前回のクローン有りカウンターにしても，「payloadが不要，またはpayloadはStateの値全て必要」のいずれかになると思ったので，Stateの変数を1つずつ指定することをやめて，State自体を型に指定することにした．また，この方法の注意として，State全体の更新になるので，Stateを持つ1つComponentの更新においてそれが持つ全Stateが更新されるものと考える必要があり，Componentの粒度を高める意識を持たなければならない．
}
export type HeadActionCreator = (
    state: HeadState // CHECH: ※1に同じ
) => HeadAction;

export const updateHeadAction: HeadActionCreator = (state: HeadState) => ({
    type: "HEADMETA",
    payload: {
        title: state !== undefined ? state.title : "", // CHECK: ※1に同じ // state=undefinedになってるらしい…初回は初期値だけでpayloadが無いからかな？
        description: state !== undefined ? state.description : "",
    },
});
