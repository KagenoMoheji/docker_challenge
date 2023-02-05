import {createSlice} from "@reduxjs/toolkit";
import {
  projectInitState, ProjectStateType,
  ProjectType, ImgTileType, ProcessType
} from "~/store/project/state";
import {projectReducers} from "~/store/project/reducers";
export {projectSelectors} from "~/store/project/selectors";
export {projectThunks} from "~/store/project/thunks";

export const projectSlice = createSlice({
  name: "project",
  initialState: projectInitState,
  reducers: projectReducers,
});
// 以下でActionsを抽出
export const projectActions = projectSlice.actions;
// 状態の型の横流し
export {type ProjectStateType};
export {type ProjectType, type ImgTileType, type ProcessType};
