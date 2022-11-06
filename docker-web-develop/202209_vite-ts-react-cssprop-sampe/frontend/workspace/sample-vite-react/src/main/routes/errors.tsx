import {useEffect} from "react";
import type {RouteObject} from "react-router-dom";
import {
  Outlet,
  // Navigate,
  useNavigate,
} from "react-router-dom";
import {Error404} from "~/components/pages/Error404";

export const ErrorsRouteElement = (): JSX.Element => {
  /*
  `/errors`にアクセスしている前提でのルーティング前のPathチェックを行う．
  これにより，`/errors`でのアクセスで`<Outlet />`という空ページではなく404エラーページにリダイレクトさせるとか，認証必須ページへの遷移判定といった対応が可能になる．

  - Refs
    - https://blog.uhy.ooo/entry/2020-06-10/react-router-location/
    - https://zenn.dev/horisan/articles/2aeaf0bd3fb70f
  */
  const currPath = location.pathname;
  const regpttn = /^\/errors\/.+$/;

  /*
  下記の(自分のPath配下へのリダイレクトする)実装だと`useEffect()`での無限ループが発生してしまうらしい．
  たぶん下記参照リンクの説明が原因．
  - Refs
    - https://zukucode.com/2021/06/react-useeffect-loop.html
    - https://qiita.com/kobayang/items/88a104c0be28e16e65e8
    - http://watanabeyu.blogspot.com/2019/09/eslintreact-hooksexhaustive-deps.html
    - https://zenn.dev/mackay/articles/1e8fcce329336d
  */
  // return currPath.match(regpttn) !== null
  //   ? <Outlet />
  //   : <Navigate to="/errors/404" />;

  const navigate = useNavigate();
  useEffect(() => {
    /*
    `navigate()`は`useEffect()`の中で使わないと「You should call navigate() in a React.useEffect(), not when your component is first rendered」と怒られて機能しない．
    */
    if (currPath.match(regpttn) === null) {
      // TODO: 本当は`replace = false`で2回ブラウザバックで戻れる仕様のはずだが，devではfalse，prodではtrueにしないとブラウザバックしない．バグか？
      navigate("/errors/404", {replace: (process.env.NODE_ENV === "development")});
    }
    // ルーティングの無限ループを避けるため`useEffect()`の空の第2引数を許容
    // https://qiita.com/kobayang/items/88a104c0be28e16e65e8
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Outlet />;
};

export const ErrorsRoute: RouteObject[] = [
  {
    path: "404",
    element: <Error404 />,
  },
];
