/*
以下，公式非推奨になったreduxを使う方法．
- Refs
  - https://www.shadowmoheji.ml/article.php?link=d29
    - もへじの記事メモ
*/
// export * from "~/store/sample/state";
// export * from "~/store/sample/actions";
// export * from "~/store/sample/reducers";




/*
以下，@reduxjs/toolkitを使う方法．
*/
import {createSlice} from "@reduxjs/toolkit";
import {sampleInitState} from "~/store/sample/state";
import {sampleReducers} from "~/store/sample/reducers";
export {sampleSelectors} from "~/store/sample/selectors";
// 個人的にSliceの意味がわからんので，データ値ごとを格納するStore総括の意味でStoreにした方がわかり易くないか？
export const sampleSlice = createSlice({
  name: "sample",
  initialState: sampleInitState,
  reducers: sampleReducers,
});
// 以下でActionsを抽出
export const sampleActions = sampleSlice.actions;
