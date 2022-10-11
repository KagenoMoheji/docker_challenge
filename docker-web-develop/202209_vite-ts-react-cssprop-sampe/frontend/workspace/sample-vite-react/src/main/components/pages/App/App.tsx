import { useState } from "react";
import reactLogo from "~/assets/svg/react.svg";
import "~/components/pages/App/App.scss";

export function App(): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <div className="comp-app">
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          {/*
          vite.config.tsのbaseで設定したPathが適用されてくれないので，一旦手動で「`/`=>`./`」の変更する．
          …と思ったがreact-routerを使い始めたら`/`じゃないと表示できなくなった．ルーティングのルートってことなんだろうが…．
          */}
          <img src="/svg/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}
