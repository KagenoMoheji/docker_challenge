import { combineReducers } from "redux";

import { headReducer } from "~/states_redux/reducers/headReducer";

export const allReducers = combineReducers({
    haed: headReducer,
});
