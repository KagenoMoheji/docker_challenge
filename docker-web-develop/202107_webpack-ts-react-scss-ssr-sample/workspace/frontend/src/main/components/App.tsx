import React from "react";
import ReactDOM from "react-dom";
/*
- CSS-Modulesの基礎？
    - [css-loader](https://webpack.js.org/loaders/css-loader/)
    - [localIdentName option moved in css-loader configuration](https://github.com/rails/webpacker/issues/2197)
        - 従来のlocalIdentNameはmodulesの中に移動したらしい．
    - [CSS Modules やっていき](https://chaika.hatenablog.com/entry/2020/10/27/083000)
- CSS-Modulesで複数classを属性に付与する方法
    - https://stackoverflow.com/questions/33949469/using-css-modules-how-do-i-define-more-than-one-style-name/33949534
*/
// import "~/styles/test1.scss"; // この場合，classNameには文字列のclassを指定する必要があるかも．
// import styleTest1 from "~/styles/test1.scss"; // classNameちゃんと与えられてる
import { styles } from "~/styles"; // classNameがundefinedになる…

export class App extends React.Component {
    render(): JSX.Element {
        console.log(styles);
        return (
            <div>
                <div className={`${styles.styleTest2.a}`}>aaaa</div>
                {/* <div className="a">aaaa</div> */}
            </div>
        );
    }
}
