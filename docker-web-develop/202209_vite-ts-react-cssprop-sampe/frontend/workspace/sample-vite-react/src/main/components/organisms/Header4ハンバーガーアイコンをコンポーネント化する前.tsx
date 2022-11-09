import {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {css} from "styled-components/macro";
// import {FaChevronDown} from "react-icons/fa";
import {DropdownArrow} from "~/components/atoms/DropdownArrow";

export const Header = (): JSX.Element => {
  const refHumb = useRef<HTMLDivElement>(null);
  const [humbActive, setHumbActive] = useState<string>("");
  const [dropdownActive, setDropdownActive] = useState<string>("");
  const onClickHumb = (eve: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    // console.log(eve);
    // console.log(humbActive);
    if (humbActive === "humb-active") {
      setDropdownActive("");
      setHumbActive("");
    } else {
      setHumbActive("humb-active");
    }
  };
  const onClickDropdown = (eve: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    // console.log(eve);
    // console.log(dropdownActive);
    if (dropdownActive === "dropdown-active") {
      setDropdownActive("");
    } else {
      setDropdownActive("dropdown-active");
    }
  };
  const onClickOutofHumb = (eve: MouseEvent): void => {
    const elClicked = eve.target as HTMLElement;
    // console.log(eve.target);
    // console.log(elClicked);
    // console.log(refHumb);
    // console.log(refHumb.current.contains(eve.target)); // こっちだとエラー出る
    // console.log(refHumb.current.contains(elClicked));
    if (refHumb.current !== null && !refHumb.current.contains(elClicked)) {
      setDropdownActive("");
      setHumbActive("");
    }
  };
  useEffect(() => {
    document.addEventListener("click", onClickOutofHumb);
    return () => {
      document.removeEventListener("click", onClickOutofHumb);
    };
  }, []);
  return (
    <div className="comp-header" css={scopedStyles.cssHeader}>
      {/*
      - MEMO
        - tailwindcssの.containerに関して
          - 使うと幅いっぱいに広がらない．左右余白ありになる．
          - 使うなら最上の親コンポーネントで設定するのが良いのでは？
      */}
      <nav className="h-[80px] bg-gray-300">
        {/*
        - TODO
          - もしかすると下記タグのclassをnavに統合して良いかも
        - MEMO
          - 下記タグの高さ指定かつ.items-stretchと子要素のh-fullは，ナビメニュータイルのタグ全体のリンク化のために必要．
        */}
        <div className="h-full flex flex-row justify-between items-center">
          <div className="h-full flex flex-row items-center">
            {/* ロゴ */}
            <Link to="/" className="reset-a">
              {/*
              - MEMO
                - 親のaタグに対して.reset-aを使っておりこれ以上の上書きCSS適用できないので下記タグで上書きCSSを記述
                  - これは.reset-btnを使った場合にも適用すべし
              */}
              <h1 className="text-blue-700">
                Logo
              </h1>
            </Link>
          </div>
          {/*
          - MEMO
            - 下記タグの.mdx:relativeは，スマホ版にした時にナビメニューをコンテンツの画面幅いっぱいの表示にするため．
          */}
          <div className="h-full mdx:relative z-50" ref={refHumb}>
            {/*
            - TODO
              - ハンバーガーサイドメニューのコンポーネント化
            */}
            <div className="humb-trigger h-full mdn:hidden flex justify-end items-center" onClick={eve => onClickHumb(eve)}>
              {/*
              ハンバーガーアイコン
              ※スマホ版以外の時は非表示

              - TODO
                - ハンバーガーメニューアイコンのtailwindcss化
              */}
              <div className={`humb-icon h-full ${humbActive}`}>
                <span className="humb-icon-line humb-icon-line-1"></span>
                <span className="humb-icon-line humb-icon-line-2"></span>
                <span className="humb-icon-line humb-icon-line-3"></span>
              </div>
            </div>
            {/*
            - MEMO
              - 下記タグの.mdx:h-autoは，スマホ版にした時にナビメニューのコンテンツが上にずれることを解消するため．
              - 下記タグの.mdx:w-[100vw]は，スマホ版にした時にナビメニューのコンテンツを画面幅いっぱいにするため．
              - 下記タグにおいてサイドバーの非表示時は.mdx:w-0.mdx:overflow-hidden，表示時(下記タグに.humb-activeが付与された時)は.mdx:w-[100vw].mdx:overflow-visibleに切り替える．
            */}
            {/*
            - MEMO-OLD
              - 下記タグにおいてサイドバーの非表示時は.mdx:fixed.mdx:right-[-100vw]，表示時(下記タグに.humb-activeが付与された時)は.mdx:absolute.mdx:right-0に切り替える．
              - 上記の実装よりスマートな実装があったのでこちらは一旦メモとしてコメントアウト
            <div className="humb-content h-full mdx:h-auto mdx:fixed mdx:top-full mdx:right-[-100vw] mdx:w-[100vw] mdx:bg-gray-300 mdx:transition-all mdx:[&.humb-active]:absolute mdx:[&.humb-active]:right-0">
            */}
            {/* <div className="humb-active humb-content h-full mdx:h-auto mdx:fixed mdx:top-full mdx:right-[-100vw] mdx:w-[100vw] mdx:bg-gray-300 mdx:transition-all mdx:[&.humb-active]:absolute mdx:[&.humb-active]:right-0"> */}
            <div className={`humb-content h-full mdx:h-auto mdx:absolute mdx:top-full mdx:right-0 mdx:w-0 mdx:overflow-hidden mdx:bg-gray-300 mdx:transition-all mdx:[&.humb-active]:w-[100vw] mdx:[&.humb-active]:overflow-visible ${humbActive}`}>
              {/* ナビメニュー */}
              <ul className="list-none h-full flex flex-col mdn:flex-row justify-center items-center"> {/* mdx:flex-col */}
                <li className="h-full relative flex flex-row items-center px-4 hover:bg-gray-500 hover:text-gray-100 mdx:w-full mdx:h-14 mdx:px-0">
                  <div className="mdx:px-16">Projects</div>
                  {/*
                  - MEMO
                    - 親タグで高さとrelativeを指定しておきしつつ子タグ内のaタグに.h-full.absolute.top-0.left-0.w-full.h-fullを付与することで，子タグ全体をリンク化できる．
                      - この方法はbuttonタグでも適用可能．
                  */}
                  <Link to="/projects" className="absolute top-0 left-0 w-full h-full" />
                </li>
                <li className="h-full relative flex flex-row items-center px-4 hover:bg-gray-500 hover:text-gray-100 mdx:w-full mdx:h-14 mdx:px-0">
                  <div className="mdx:px-16">Articles</div>
                  <Link to="/articles" className="absolute top-0 left-0 w-full h-full" />
                </li>
                <li className="h-full relative flex flex-row items-center px-4 hover:bg-gray-500 hover:text-gray-100 mdx:w-full mdx:h-14 mdx:px-0">
                  <div className="mdx:px-16">About</div>
                  <Link to="/about" className="absolute top-0 left-0 w-full h-full" />
                </li>
                {/*
                - MEMO
                  - 下記タグの.relativeはドロップダウンのコンテンツ用．
                  - 下記タグの.px-0が無いとドロップダウンのコンテンツが右にはみ出てしまう
                - TODO
                  - 下記タグのgroupを.group/nav-samplesとしたかったが動かなかった…．更なる親タグで.groupを使うことになったときの衝突に備えて動かせるようにしておきたい．
                */}
                <li className="group h-full relative px-4 hover:bg-gray-500 mdx:w-full mdx:h-14 mdx:px-0">
                  {/*
                  - TODO
                    - ドロップダウンのコンポーネント化
                  */}
                  <div className="dropdown-trigger h-full flex flex-row items-center mdx:px-16" onClick={eve => onClickDropdown(eve)}>
                    <div className="area-button h-full relative flex flex-row items-center group-hover:text-gray-100">
                      <div className="flex flex-row justify-between items-center">
                        <div>Samples</div>
                        <div className="flex flex-row items-center ml-2.5">
                          <DropdownArrow classNames="h-7" />
                          {/*
                          こっちでも一応同じになる．
                          <FaChevronDown className="h-7" />
                          */}
                        </div>
                      </div>
                      <button className="reset-btn absolute top-0 left-0 w-full h-full"></button>
                    </div>
                  </div>
                  {/* <div className="dropdown-content z-100 bg-gray-300 w-80 mdn:absolute mdn:top-full mdn:right-0 mdn:group-hover:block hidden break-words mdx:w-full mdx:[&.dropdown-active]:block"> */}
                  <div className={`dropdown-content z-100 bg-gray-300 w-80 mdn:absolute mdn:top-full mdn:right-0 h-0 overflow-hidden break-words mdx:w-full mdn:group-hover:h-auto mdn:group-hover:overflow-visible mdx:[&.dropdown-active]:h-auto mdx:[&.dropdown-active]:overflow-visible ${dropdownActive}`}>
                    <ul className="list-none">
                      <li className="px-4 py-4 relative flex flex-row items-center hover:bg-gray-500 hover:text-gray-100">
                        <div className="mdx:px-20">SampleCSSPropOfStyledComponentaaaaaaaaaaa</div>
                        <Link to="/samples/cssprop" className="absolute top-0 left-0 w-full h-full" />
                      </li>
                      <li className="px-4 py-4 relative flex flex-row items-center hover:bg-gray-500 hover:text-gray-100">
                        <div className="mdx:px-20">SampleStyledComponent</div>
                        <Link to="/samples/styledcomponents" className="absolute top-0 left-0 w-full h-full" />
                      </li>
                      <li className="px-4 py-4 relative flex flex-row items-center hover:bg-gray-500 hover:text-gray-100">
                        <div className="mdx:px-20">SampleApolloClient</div>
                        <Link to="/samples/apolloclient" className="absolute top-0 left-0 w-full h-full" />
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

const scopedStyles = {
  cssHeader: css`
.humb-trigger {
  z-index: 100;
  .humb-icon {
    width: 50px; /* こっちでhumb-iconのサイズ決める． */
    height: 50px; /* こっちでhumb-iconのサイズ決める． */
    cursor: pointer;
    position: relative;
    .humb-icon-line {
      position: absolute;
      width: 85%; /* なんか右にはみ出てたので少し短くする． */
      border: 2px solid #111;
      background-color: #111;
      transition: all 0.3s;
    }
    .humb-icon-line-1 {
      top: 25%;
    }
    .humb-icon-line-2 {
      top: 50%;
    }
    .humb-icon-line-3 {
      top: 75%;
    }
    &.humb-active {
      /* ハンバーガーメニューが開かれているときのスタイル */
      .humb-icon-line {
        border: 2px solid #111;
      }
      .humb-icon-line-1 {
        top: 50%;
        transform: rotate(45deg);
      }
      .humb-icon-line-2 {
        width: 0;
        border: none;
      }
      .humb-icon-line-3 {
        top: 50%;
        transform: rotate(-45deg);
      }
    }
  }
}
`,
};


