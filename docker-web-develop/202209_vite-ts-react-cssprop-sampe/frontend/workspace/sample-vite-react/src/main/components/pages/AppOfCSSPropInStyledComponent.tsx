import { useState } from "react";
import reactLogo from "~/assets/svg/react.svg";
// import { css } "styled-components"; // cssはmacroとbabelを併用しないといけないらしくこれは使えないっぽい．
import { css } from "styled-components/macro";

export function App(): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <div className="comp-app-cssprop" css={scopedStyles.cssApp}>
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
        {/* tailwindcssを適用してみる */}
        <p className="text-blue-300">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

/*
[CSS in JSについて]
- MEMO
  - https://zenn.dev/sotszk/articles/0d0dcfe3d2dc10
    - 個人的にstyled-componentsよりcss function(css props？)の方がjsxオンリーのコンポーネントとしてのタグとの区別がついて分かりやすそう．例えばpropsを関数型コンポーネントにわたす必要あるのかCSSの方に渡す必要あるのかとか．
    - とはいえ「-components」が付くほどだからコンポーネントとして扱わないといけないのは仕方ないことなのだろうか…
  - https://stackoverflow.com/a/70648218/15842506
    - css propsて1つのCSS変数しか指定できないの？
    - 複数classを指定して各classで実装したスタイルを組み合わせることを，CSS変数(というよりclass名相当の関数名が正しいか)における変数埋め込みで実現して，ただ1つcss propsで渡せるのCSS変数を作らないといけない？大変じゃね？
      - https://qiita.com/282Haniwa/items/7248bed02a1b5b66579f#css%E3%82%92%E3%83%9E%E3%83%BC%E3%82%B8%E3%81%99%E3%82%8B
        - これEmotionのだけど，styled-componentsのcss propsでも配列として複数渡せるかな？
    - CSS変数を別のCSS変数にimportの上で埋め込むとき，import時に変数名変えられて埋め込み依存わからなくなってしまわない？
      - CSS変数名を`css<class名>`的な命名ルールを設けることで，「.css<class名>」でアプリディレクトリ内検索して埋め込み依存を調べることはできそうか…？
  - VueでのscopedCSSを参考にすると，各コンポーネントの最も親タグのclass名に対してのCSS変数を宣言して，子タグへはその親要素のCSSの中でSCSSでネストしていく書き方で良さげ．
    - ネストする子タグ個数を減らしたい場合は別コンポーネントに分ければ良い
    - デメリットとしては親タグ側で別コンポーネントとした子タグのスタイルを動的に変更できるかわからないこと．css propsでなんとかなるか検証が必要．
      - https://styled-components.com/docs/basics#passed-props
*/
const scopedStyles = {
  cssApp: css`
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
`,
};
