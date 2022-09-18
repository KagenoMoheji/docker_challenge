import React from "react";
import ReactDOM from "react-dom/client";
// import App from "~/App";
import App from "~/App_withCSSPropOfStyledComponent";
// import App from "./App_withStyledComponent";
import "~/index.scss"; // cssからscssに変更した

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
