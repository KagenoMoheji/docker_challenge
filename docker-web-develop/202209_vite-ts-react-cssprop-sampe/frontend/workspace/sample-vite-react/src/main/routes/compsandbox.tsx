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
import {Processes} from "~/components/organisms/Processes";
import {Carousel} from "~/components/organisms/Carousel";
import {CircleImgTiles} from "~/components/organisms/CircleImgTiles";
import {Footer} from "~/components/organisms/Footer";
import {ProjectArticle} from "~/components/pages/ProjectArticle";

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
  {
    path: "Processes",
    element: <Processes processes={[
      {
        process: "process1",
        status: "completed",
        detail: "完了した"
      },
      {
        process: "process2",
        status: "ongoing",
        detail: "実施中実施中実施中実施中実施中\n実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中実施中"
      },
      {
        process: "process3",
        status: "untouched",
      },
    ]} />,
  },
  {
    path: "Carousel",
    element: <Carousel imgs={[
      {
        original: "https://avatars.githubusercontent.com/u/37401955?v=4",
        thumbnail: "https://avatars.githubusercontent.com/u/37401955?v=4",
      },
    ]} />,
  },
  {
    path: "CircleImgTiles",
    element: <CircleImgTiles imgTiles={[
      {
        name: "Github",
        imageLink: "ReactIcons/DevIcons/DiGithubBadge",
      },
      {
        name: "KagenoMoheji",
        imageLink: "https://avatars.githubusercontent.com/u/37401955?v=4",
      },
      {
        name: "IconLoadError",
        imageLink: "ReactIcons/DevIcons/GithubBadge",
      },
    ]} />,
  },
  {
    path: "Footer",
    element: <Footer />,
  },
  {
    path: "ProjectArticle/:year/:id",
    element: <ProjectArticle />,
  },
];
