import {Outlet} from "react-router-dom";
import {Header} from "~/components/organisms/Header";

export const HeaderRouter = (): JSX.Element => {
  return (
    <div className="templ-headerrouter">
      <Header />
      <Outlet />
    </div>
  );
};
