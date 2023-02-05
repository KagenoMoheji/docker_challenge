import {PayloadAction} from "@reduxjs/toolkit";
import {ProjectStateType, ProjectType} from "~/store/project";

export const projectReducers = {
  setProject: (state: ProjectStateType, action: PayloadAction<{project: ProjectType}>) => {
    state.project = action.payload.project;
  },
  switchIsLoading: (state: ProjectStateType, action: PayloadAction<{isLoading: boolean}>) => {
    state.control.isLoading = action.payload.isLoading;
  },
};
// 詳細な処理を実装する場合，以下にprivateな関数として実装(テストするためにexportしてpublicにしても良い)．
