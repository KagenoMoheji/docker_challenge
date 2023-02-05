// import type {ReactElement, JSXElementConstructor} from "react";
import type {RouteObject} from "react-router-dom";
import {
  BrowserRouter,
  useRoutes,
  Navigate,
  // Outlet,
} from "react-router-dom";
import {SamplesRouteElement, SamplesRoute} from "~/routes/samples";
import {ErrorsRouteElement, ErrorsRoute} from "~/routes/errors";
// import {ProjectsRouteElement, ProjectsRoute} from "~/routes/projects";
import {ProjectArticle} from "~/components/pages/ProjectArticle";
import {CompSandboxRouteElement, CompSandboxRoute} from "~/routes/compsandbox";
import {Header} from "~/components/organisms/Header";
import {Footer} from "~/components/organisms/Footer";
import {Top} from "~/components/pages/Top/Top";
/*
- Refs
  - https://www.webopixel.net/javascript/1773.html
  - https://yoheiko.com/blog/react%E3%81%A7%E8%A4%87%E6%95%B0%E3%81%AE%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%9C%E3%82%8B%E6%96%B9%E6%B3%95/
  - https://reacttraining.com/blog/react-router-v6-pre/#object-based-routes
*/

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Top />,
    // children: [
    //   // children内のルーティングは，elementで指定したコンポーネント内でOutletを呼び出す形でページ切り替えするもの．つまりページ全体を切り替える場合はchildrenにすべきではない．
    //   {
    //     path: "samples",
    //     children: SamplesRoute,
    //   },
    //   {
    //     caseSensitive: false,
    //     path: "errors",
    //     children: ErrorsRoute,
    //   },
    // ],
  },
  {
    path: "/samples",
    // Outletを呼ぶコンポーネントをchildrenの親ルートのelementで指定しないとchildrenのコンポーネントを描画できない．
    element: <SamplesRouteElement />,
    children: SamplesRoute,
  },
  // {
  //   path: "/projects",
  //   element: <ProjectsRouteElement />,
  //   children: ProjectsRoute,
  // },
  {
    path: "/projects/:year/:id",
    element: <ProjectArticle />,
  },
  {
    path: "/errors",
    element: <ErrorsRouteElement />,
    children: ErrorsRoute,
  },
  {
    // コンポーネント実装用ルーティング
    path: "/compsandbox",
    element: <CompSandboxRouteElement />,
    children: CompSandboxRoute,
  },
  {
    // 存在しないルーティングされたら404画面へリダイレクト
    // `replace = false`で2回ブラウザバックで戻れる
    // TODO: 本当は`replace = false`で2回ブラウザバックで戻れる仕様のはずだが，devではfalse，prodではtrueにしないとブラウザバックしない．バグか？
    path: "*",
    element: <Navigate to="/errors/404" replace={!(process.env.NODE_ENV === "development")} />,
  },
];

export const App = (): JSX.Element => {
  // const Router = (): ReactElement<any, string | JSXElementConstructor<any>> | null => useRoutes(routes); // any型で怒られるのでJSX.Element型でぼかす．
  const Router = (): JSX.Element => useRoutes(routes) as JSX.Element;
  const currPath = location.pathname;
  const regpttn = /^\/compsandbox\/.+$/;
  return process.env.NODE_ENV === "development" && currPath.match(regpttn) === null
    ? (
      <BrowserRouter>
        <Header />
        <Router />
        <Footer />
      </BrowserRouter>
    )
    : (
      // コンポーネント実装用ルーティングコンポーネント
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    );
};



// import {
//   BrowserRouter,
//   Navigate,
//   Routes,
//   Route,
// } from "react-router-dom";
// import {App} from "~/components/pages/App/App";
// import {SamplesRouteElement} from "~/routes/samples";
// import * as CSSProp from "~/components/pages/AppOfCSSPropInStyledComponent";
// import * as StyledComponents from "~/components/pages/AppOfStyledComponent";
// import {ErrorsRouteElement} from "~/routes/errors";
// import {Error404} from "~/components/pages/Error404";
// export const Root = (): JSX.Element => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="samples" element={<SamplesRouteElement />}>
//           <Route path="cssprop" element={<CSSProp.App />} />
//           <Route path="styledcomponent" element={<StyledComponents.App />} />
//         </Route>
//         <Route path="errors" element={<ErrorsRouteElement />}>
//           <Route path="404" element={<Error404 />} />
//         </Route>
//         <Route path="*" element={<Navigate to="/errors/404" replace={false} />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };
