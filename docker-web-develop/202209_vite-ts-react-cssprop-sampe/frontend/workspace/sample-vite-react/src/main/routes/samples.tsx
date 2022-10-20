import {useEffect} from "react";
import type {RouteObject} from "react-router-dom";
import {
  Outlet,
  // Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import * as CSSProp from "~/components/pages/AppOfCSSPropInStyledComponent"; // TODO: ほんとはこの`* as`によるnamed exportの無意味化は良くない
import * as StyledComponents from "~/components/pages/AppOfStyledComponent"; // TODO: ほんとはこの`* as`によるnamed exportの無意味化は良くない

export const SamplesRouteElement = (): JSX.Element => {
  /*
  `/samples`にアクセスしている前提でのルーティング前のPathチェックを行う．
  これにより，`/samples`でのアクセスで`<Outlet />`という空ページではなく404エラーページにリダイレクトさせるとか，認証必須ページへの遷移判定といった対応が可能になる．

  - Refs
    - https://blog.uhy.ooo/entry/2020-06-10/react-router-location/
    - https://zenn.dev/horisan/articles/2aeaf0bd3fb70f
  */
  const currPath = useLocation().pathname; // location.pathname
  const regpttn = /^\/samples\/.+$/;

  // 下記実装でも動くけど，`/errors`での件によりそちらの実装と合わせて後述の実装する
  // return currPath.match(regpttn) !== null
  //   ? <Outlet />
  //   : <Navigate to="/errors/404" />;

  const navigate = useNavigate();
  useEffect(() => {
    if (currPath.match(regpttn) === null) {
      // TODO: devモードでは`replace: false`，buildモードでは`replace: true`でブラウザバック有効になる・・・．いや逆になるなよ，なんで？
      navigate("/errors/404", {replace: true});
    }
    // ルーティングの無限ループを避けるため`useEffect()`の空の第2引数を許容
    // https://qiita.com/kobayang/items/88a104c0be28e16e65e8
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // TODO: このOutletをHeaderコンポーネントにして，Header内でOutlet使いたい
  return <Outlet />;
};

export const SamplesRoute: RouteObject[] = [
  {
    path: "cssprop",
    element: <CSSProp.App />,
  },
  {
    path: "styledcomponents",
    element: <StyledComponents.App />,
  },
];
