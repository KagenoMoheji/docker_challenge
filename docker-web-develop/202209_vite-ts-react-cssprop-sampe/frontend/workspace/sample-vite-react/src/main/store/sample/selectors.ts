import {RootState} from "~/store";

export const sampleSelectors = {
  selectCount: () =>{
    return (state: RootState) => state.sample.count;
  },
};
