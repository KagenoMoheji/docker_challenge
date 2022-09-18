import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { App } from "~/components/App";
import { allStores } from "~/states_redux/stores";

ReactDOM.render(
    <Provider store={allStores}>
        <App />
    </Provider>,
    document.getElementById("root")
);
