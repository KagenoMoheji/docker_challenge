# ReduxToolkitを用いたReduxの実装方法
### 基本ディレクトリ
```
├ sample-app/
    ├ src
        ├ main/
            ├ store/
                ├ index.ts
                ├ <状態名>/
                    ├ index.ts
                    ├ state.ts
                    ├ reducers.ts
                    ├ thunks.ts
                    ├ selectors.ts
```

### 各モジュールの説明とサンプルコード
##### `store/index.ts`
- storeオブジェクトを生成する，ReduxのRoot的なモジュール
- 各状態の`store/<状態名>/index.ts`を読み込んで，`configureStore()`のキー`reducer`に登録していく
```
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {sampleSlice} from "~/store/sample"; // 状態「sample」の読み込み
// 下記のstoreをmain.tsxでimportし，`<react-redux.Provider store={store}></react-redux.Provider>`で渡せばOK.
export const store = configureStore({
    reducer: {
        sample: sampleSlice.reducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// Thunksを呼ぶには`react-redux.useDispatch`より下記を使った方が良い．
export const useAppDispatch: () => AppDispatch = useDispatch;
```

##### `store/<状態名>/index.ts`
- 状態ごとのRoot的なモジュール
- state・reducers・thunks・selectorsを集約してexportする
- コンポーネント等からの状態ごとのimportはここから行うようにする
```
import {createSlice} from "@reduxjs/toolkit";
import {sampleInitState, SampleStateType} from "~/store/sample/state";
import {sampleReducers} from "~/store/sample/reducers";
export {sampleSelectors} from "~/store/sample/selectors";
export {sampleThunks} from "~/store/sample/thunks";
export const sampleSlice = createSlice({
    name: "sample",
    initialState: sampleInitState,
    reducers: sampleReducers,
});
// 以下でActionsを抽出
export const sampleActions = sampleSlice.actions;
// 状態の型の横流し
export {type SampleStateType};
```

##### `store/<状態名>/state.ts`
- 状態の型と初期値を定義する
```
export type SampleStateType = {
    count: number;
    control: {
        isLoading: boolean;
    };
};

export const sampleInitState: SampleStateType = {
    count: 0,
    control: {
        isLoading: false,
    },
};
```

##### `store/<状態名>/reducers.ts`
- 状態に対する同期処理を実装する
- 状態の更新(というより代入)はここで実装する
```
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
```

##### `store/<状態名>/thunks.ts`
- 状態に対する非同期処理(APIリクエスト処理の呼び出し等)を実装する
- 状態の更新はreducersからdispatchで呼ぶ
```
import {AppDispatch} from "~/store";
import {sampleActions} from "~/store/sample";
import {sleep} from "~/utils/sleep";

export const sampleThunks = {
    slowDecrement: (payload: {diff: number}) => {
        return async (dispatch: AppDispatch) => {
            dispatch(sampleActions.switchIsLoading({isLoading: true}));
            await sleep(2000);
            dispatch(sampleActions.decrement({diff: payload.diff}));
            dispatch(sampleActions.switchIsLoading({isLoading: false}));
        };
    },
};
```

##### `store/<状態名>/selectors.ts`
- 状態の読み取り処理を実装する
```
import {RootState} from "~/store";

export const sampleSelectors = {
    selectCount: () =>{
        return (state: RootState) => state.sample.count;
    },
    selectIsLoading: () =>{
        return (state: RootState) => state.sample.control.isLoading;
    },
};
```




