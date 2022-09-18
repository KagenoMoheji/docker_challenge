import { createStore } from "redux";

import { allReducers } from "~/states_redux/reducers";

export const allStores = createStore(allReducers);
