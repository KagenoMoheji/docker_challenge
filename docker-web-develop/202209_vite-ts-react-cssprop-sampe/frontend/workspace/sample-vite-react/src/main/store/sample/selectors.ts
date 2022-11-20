import {RootState} from "~/store";

export const sampleSelectors = {
  selectCount: () =>{
    return (state: RootState) => state.sample.count;
  },
  selectIsLoading: () =>{
    return (state: RootState) => state.sample.control.isLoading;
  },
};
