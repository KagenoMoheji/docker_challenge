import {useEffect} from "react";
import type {RouteObject} from "react-router-dom";
import {
  Outlet,
  // Navigate,
  useNavigate,
} from "react-router-dom";
import {Header} from "~/components/organisms/Header";
import {HeaderWithMemo} from "~/components/organisms/HeaderWithMemo";
import {Header as Header2} from "~/components/organisms/Header2ドロップダウンの開け閉じの方法が違う";

export const CompSandboxRouteElement = (): JSX.Element => {
  /*
  `/compsandbox`にアクセスしている前提でのルーティング前のPathチェックを行う．
  これにより，`/compsandbox`でのアクセスで`<Outlet />`という空ページではなく404エラーページにリダイレクトさせるとか，認証必須ページへの遷移判定といった対応が可能になる．
  */
  const currPath = location.pathname;
  const regpttn = /^\/compsandbox\/.+$/;

  const navigate = useNavigate();
  useEffect(() => {
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

export const CompSandboxRoute: RouteObject[] = [
  /*
  実装中のコンポーネントの見た目を確認したい時に，ここにルーティングを追加していく
  */
  {
    path: "Header",
    element: <Header />,
  },
  {
    path: "Header2",
    element: <Header2 />,
  },
  {
    path: "HeaderWithMemo",
    element: <HeaderWithMemo />,
  },
];
