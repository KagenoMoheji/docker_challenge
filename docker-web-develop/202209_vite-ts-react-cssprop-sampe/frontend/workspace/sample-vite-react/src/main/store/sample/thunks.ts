import {AppDispatch} from "~/store"; // 「import {Dispatch} from "@reduxjs/toolkit";」とどっちを使うべきか，合っているのか不明
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
