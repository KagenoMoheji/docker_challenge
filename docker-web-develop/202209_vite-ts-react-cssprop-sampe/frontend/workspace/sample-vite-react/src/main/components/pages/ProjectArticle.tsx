import {useMemo} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {AiOutlineLoading} from "react-icons/ai";
import {useAppDispatch} from "~/store";
import {projectSelectors, projectThunks} from "~/store/project";
import {typeOf} from "~/utils/typeCheck";
import {AxiosError} from "axios";
import {Carousel} from "~/components/organisms/Carousel";
import {Processes} from "~/components/organisms/Processes";
import {CircleImgTiles} from "~/components/organisms/CircleImgTiles";
import {Tags} from "~/components/organisms/Tags";

type URLParams = {
  year: string;
  id: string;
};

export const ProjectArticle = (): JSX.Element => {
  const params = useParams() as URLParams;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useSelector(projectSelectors.selectIsLoading());
  const project = useSelector(projectSelectors.selectProject());
  useMemo(() => {
    dispatch(projectThunks.fetchProject(params.year, params.id))
      .catch((err) => {
        console.error(err);
        if (typeOf(err, AxiosError)) {
          switch (err.response.status) {
            case 404:
              navigate("/errors/404", {replace: !(process.env.NODE_ENV === "development")});
              break;
            default:
              navigate("/errors/500", {replace: !(process.env.NODE_ENV === "development")});
          }
        } else {
          /*
          下記例外も500エラーに含める．
          - NotAsTheOnlyError
          */
          navigate("/errors/500", {replace: !(process.env.NODE_ENV === "development")});
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if(isLoading || !((project instanceof Object) && !(project instanceof Array))) {
    return (
      <div className="w-full h-full">
        <h1>
          <AiOutlineLoading className="animate-spin" />
          Loading...
        </h1>
      </div>
    );
  }
  const imgs = [];
  for (let i = 0; i < project.content.imageLinks.length; i++) {
    imgs.push({
      original: project.content.imageLinks[i],
      thumbnail: project.content.imageLinks[i],
    });
  }
  return (
    <div className="comp-projectarticle">
      <div className="flex flex-col items-center">
        <div className="w-[90%] flex flex-col">
          <div className="w-full my-[10px] flex flex-col">
            <div><h1>Project名</h1></div>
            {
              (imgs.length > 0)
                ? (
                  <div>
                    <Carousel imgs={imgs} imgH="400px" />
                  </div>
                )
                : ""
            }
          </div>
          {
            (project.content.missions.length > 0)
              ? (
                <div className="w-full my-[10px] flex flex-col">
                  <div><h1>Mission</h1></div>
                  <div>
                    <Processes processes={project.content.missions} />
                  </div>
                </div>
              )
              : ""
          }
          {
            (project.content.processes.length > 0)
              ? (
                <div className="w-full my-[10px] flex flex-col">
                  <div><h1>Process</h1></div>
                  <div>
                    <Processes processes={project.content.processes} />
                  </div>
                </div>
              )
              : ""
          }
          {
            (project.content.tools.length > 0)
              ? (
                <div className="w-full my-[10px] flex flex-col">
                  <div><h1>Tools</h1></div>
                  <div>
                    <CircleImgTiles imgTiles={project.content.tools} />
                  </div>
                </div>
              )
              : ""
          }
          <div className="w-full my-[10px] flex flex-col">
            <div><h1>Contributors</h1></div>
            {
              (project.content.contributors.length > 0)
                ? (
                  <div>
                    <CircleImgTiles imgTiles={project.content.contributors} />
                  </div>
                )
                : <div className="ml-[10px]">No contributor.</div>
            }
          </div>
          <div className="w-full my-[10px] flex flex-col">
            <div><h1>Tags</h1></div>
            {
              (project.content.tags.length > 0)
                ? (
                  <div>
                    <Tags tags={project.content.tags} />
                  </div>
                )
                : <div className="ml-[10px]">No tag.</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
