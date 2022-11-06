import { useState } from "react";
import reactLogo from "~/assets/svg/react.svg";
import styled from "styled-components";

export const SampleStyledComponent = (): JSX.Element => {
  const [count, setCount] = useState(0);

  return (
    <StyledScope className="comp-samplestyledcomponent">
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
          Edit <code>src/SampleStyledComponent.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </StyledScope>
  );
};

/*
[CSS in JSについて]
- MEMO
  - VueでのscopedCSSを参考にすると，各コンポーネントの最も親タグのclass名に対してのCSS変数を宣言して，子タグへはその親要素のCSSの中でSCSSでネストしていく書き方で良さげ．
    - ネストする子タグ個数を減らしたい場合は別コンポーネントに分ければ良い
    - デメリットとしては親タグ側で別コンポーネントとした子タグのスタイルを動的に変更できるかわからないこと．css propsでなんとかなるか検証が必要．
      - https://styled-components.com/docs/basics#passed-props
  - styled-componentsのその他参考リンク
    - https://tekrog.com/styled-components/
*/

// こっちの書き方だと，styled-componentのコンポーネントが余分に1層追加になっていて，通常のReactコンポーネントにpropsを渡したいときの邪魔者になりそう…
const StyledScope = styled.div`
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  &:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  &.react:hover {
    filter: drop-shadow(0 0 2em #61dafbaa);
  }
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}
.read-the-docs {
  color: #888;
}
`;
