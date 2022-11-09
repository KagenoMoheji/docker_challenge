import {SVGProps} from "~/types/svg";

/*
【SVGをCSS反映できるようにしたまま外部importする方法】
1. svgソースをそのまま返すReactコンポーネントとしてexport
  - SVGPropsという，styleとclassを受け取るpropsを引数に追加し，svgタグのclassNameとstyleに追記．
2. svgの呼び出し側で下記のようにimportし，タグとして埋め込み，(tailwindcssの)classやstyleを指定してsvgのCSSを上書きする．
  ```
  import DropdownArrow from "~/components/atoms/DropdownArrow";
  <DropdownArrow className="text-blue-700" style={{"width": "30px"}} />
  ```

- Refs
  - https://github.com/boopathi/react-svg-loader/issues/197#issuecomment-349713752
  - https://fontawesome.com/search?q=chevron-down&o=r
    - 今回のsvgはこちらから．
    - 同じ形のものが他にも下記にある
      - https://react-icons.github.io/react-icons/search?q=chevrondown
  - https://icooon-mono.com/12585-%E3%83%A1%E3%83%8B%E3%83%A5%E3%83%BC%E3%81%AE%E7%84%A1%E6%96%99%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B35/
  - https://iconbox.fun/%E3%83%8F%E3%83%B3%E3%83%90%E3%83%BC%E3%82%AC%E3%83%BC%E3%83%A1%E3%83%8B%E3%83%A5%E3%83%BC%E3%81%AE%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3/
  - https://fontawesome.com/search?q=hamburger&o=r
  - https://react-icons.github.io/react-icons/search?q=hamb
*/

export const DropdownArrow = (props: SVGProps): JSX.Element => {
  return <svg className={props.classNames} style={props.styles} aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>;
};
