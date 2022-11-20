/*
reduxと使う方法と@reduxjs/toolkitを使う方法がある．

以下，公式非推奨になったreduxを使う方法．2021年までこちらが標準だったはずだが公式的に非推奨になったらしい．
- Usage
  - コンポーネントからの呼び出し方
    ```
    import {connect} from "react-redux";
    import {Dispatch, Action} from "redux";
    const mapState2Props = (state: ArticleProps) => ({
      article: state.article,
    });
    const mapDispatch2Props = (dispatch: Dispatch>) => ({
        fetchArticle: () => dispatch(fetchArticleAction()),
    });
    // 下記でArticleコンポーネントとStoreを接続
    export const ConnArticle = connect(mapState2Props, mapDispatch2Props)(Article);
    ```
    - 上記コードをコンポーネントファイル内で実装し，コンポーネントのPropsとStoreを接続して呼び出す．
      - stateの取得: `this.props.article`
      - reducerの実行: `this.props.fetchArticle()`
      - ただし上記はClassComponentで実装したものなのでFunctionalComponentで機能するか要検証
- Refs
  - https://www.shadowmoheji.ml/article.php?link=d29
    - もへじの記事メモ
*/
// import {combineReducers, createStore} from "redux";
// import {sampleReducers} from "~/store/sample";
// // 下記のstoreをmain.tsxでimportし，`<react-redux.Provider store={store}></react-redux.Provider>`で渡せばOK.
// export const store = createStore(
//   combineReducers({
//     sample: sampleReducers,
//   })
// );



/*
以下，@reduxjs/toolkitを使う方法．20221112時点では公式はこちらを推奨．
- Usage
  - コンポーネントからの呼び出し方
    ```
    import {useDispatch, useSelector} from "react-redux";
    import {articleActions} from "~/store/article/index";
    ```
- Refs
  - https://www.webopixel.net/javascript/1601.html
  - https://zenn.dev/engstt/articles/293e7420c93a18#redux%E9%96%A2%E9%80%A3%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB
  - https://nomurabbit.hatenablog.jp/entry/20220122/1642834857
  - https://www.cyokodog.net/blog/redux-tookit/
  - https://reffect.co.jp/react/redux-toolkit#Redux_Thunk-2
    - VuexとReduxの概念を比較すると「Vuex.Actions=Redux.Thunks」・「Vuex.Mutations=Redux.Reducers」になるかも．
      - Thunksは内外のSlicersのAction(・Thunks)を呼び出して組み合わせることができる(非同期)関数．
    - useDispatch()による呼び出しについて
      - ReduxのReducerの呼び出しはActionsを指名して経由する
      - Thunkの呼び出しはその関数自体を指名する
*/
import {configureStore} from "@reduxjs/toolkit";
import {sampleSlice} from "~/store/sample";
// 下記のstoreをmain.tsxでimportし，`<react-redux.Provider store={store}></react-redux.Provider>`で渡せばOK.
export const store = configureStore({
  reducer: {
    sample: sampleSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
