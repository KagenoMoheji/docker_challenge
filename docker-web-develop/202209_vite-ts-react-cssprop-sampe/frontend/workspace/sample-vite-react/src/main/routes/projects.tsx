import {useEffect} from "react";
import type {RouteObject} from "react-router-dom";
import {
  Outlet,
  // Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
// import {ProjectArticle} from "~/components/pages/ProjectArticle";

export const ProjectsRouteElement = (): JSX.Element => {
  /*
  `/samples`にアクセスしている前提でのルーティング前のPathチェックを行う．
  これにより，`/samples`でのアクセスで`<Outlet />`という空ページではなく404エラーページにリダイレクトさせるとか，認証必須ページへの遷移判定といった対応が可能になる．
  */
  const currPath = useLocation().pathname; // location.pathname
  const regpttn = /^\/projects\/.+$/;

  const navigate = useNavigate();
  useEffect(() => {
    if (currPath.match(regpttn) === null) {
      // TODO: 本当は`replace = false`で2回ブラウザバックで戻れる仕様のはずだが，devではfalse，prodではtrueにしないとブラウザバックしない．バグか？
      navigate("/errors/404", {replace: !(process.env.NODE_ENV === "development")});
    }
    // ルーティングの無限ループを避けるため`useEffect()`の空の第2引数を許容
    // https://qiita.com/kobayang/items/88a104c0be28e16e65e8
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Outlet />;
};

export const ProjectsRoute: RouteObject[] = [
  // {
  //   path: "/",
  //   element: <Projects />,
  // },
  // {
  //   // TODO: 外部化してここでマッチングさせるのがコード的にきれいだが，なぜかマッチングしない．
  //   path: ":year/:id",
  //   element: <ProjectArticle />,
  // },
];
