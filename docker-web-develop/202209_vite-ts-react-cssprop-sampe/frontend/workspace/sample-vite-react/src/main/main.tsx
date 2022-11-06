import React from "react";
import ReactDOM from "react-dom/client";
import "~/styles/base.scss";

import {App} from "~/routes";
// import {ApolloProvider} from "@apollo/client";
// import {client} from "~/plugins/@apollo/client/ApolloClient";
// import {worker} from "~~/mock_graphql/msw-graphql/browser";

/*
[我流実装ルール的な]
- `export default`は使わない
  - import側で名前変えられるから辿りづらく・探しづらくなってしまう
- 各Reactコンポーネントのトップのクラス名に`comp-{コンポーネント名}`または`tmpl-{テンプレート名}`を記述
*/

// if(process.env.NODE_ENV === "development"){
//   // 開発モードの場合にMSWを有効化
//   await worker.start({
//     serviceWorker:{
//       url: "/mockServiceWorker.js"
//     }
//   });
// }

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <ApolloProvider client={client}> */}
    <App />
    {/* </ApolloProvider> */}
  </React.StrictMode>
);
