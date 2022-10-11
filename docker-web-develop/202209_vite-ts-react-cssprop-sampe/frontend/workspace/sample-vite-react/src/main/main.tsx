import React from "react";
import ReactDOM from "react-dom/client";
import "~/index.scss"; // cssからscssに変更した
import {Root} from "~/routes"; // ReactRouterDOMの実装時に追加

/*
[我流実装ルール的な]
- `export default`は使わない
  - import側で名前変えられるから辿りづらく・探しづらくなってしまう
- 各Reactコンポーネントのトップのクラス名に`comp-{コンポーネント名}`または`tmpl-{テンプレート名}`を記述
*/

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <App /> */}
    <Root />
  </React.StrictMode>
);
