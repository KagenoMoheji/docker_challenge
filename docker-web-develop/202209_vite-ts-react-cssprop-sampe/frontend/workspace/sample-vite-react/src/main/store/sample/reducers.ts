/*
以下，公式非推奨になったreduxを使う方法．
- Refs
  - https://www.shadowmoheji.ml/article.php?link=d29
    - もへじの記事メモ
*/
// import {SampleStateType, sampleInitState} from "~/store/sample/state";
// import {
//   incrementAction,
//   decrementAction,
//   SampleActionReturn,
// } from "~/store/sample/actions";
// export const articuleReducers = (
//   state: SampleStateType = sampleInitState,
//   action: SampleActionReturn
// ): SampleStateType => {
//   switch (action.type) {
//     case incrementAction().type:
//       // ここでstateを更新し，stateを返す処理(返すまでいかなくても良いかもしれないが記憶曖昧)
//     default:
//       return state;
//   }
// };
// // 詳細な処理を実装する場合，以下にprivateな関数として実装(テストするためにexportしてpublicにしても良い)．



/*
以下，@reduxjs/toolkitを使う方法．
*/
import {PayloadAction} from "@reduxjs/toolkit";
import {SampleStateType} from "~/store/sample/state";

export const sampleReducers = {
  increment: (state: SampleStateType, action: PayloadAction<{diff: number}>) => {
    state.count += action.payload.diff;
  },
  decrement: (state: SampleStateType, action: PayloadAction<{diff: number}>) => {
    state.count -= action.payload.diff;
  },
  switchIsLoading: (state: SampleStateType, action: PayloadAction<{isLoading: boolean}>) => {
    state.control.isLoading = action.payload.isLoading;
  },
};
