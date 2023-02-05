import {RootState} from "~/store";

export const projectSelectors = {
  selectProject: (/* インデックスとか */) => {
    return (state: RootState) => state.project.project;
  },
  selectIsLoading: () =>{
    return (state: RootState) => state.project.control.isLoading;
  },
};
