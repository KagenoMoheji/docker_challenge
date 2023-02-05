import yaml from "js-yaml";
import {AppDispatch} from "~/store";
import {projectActions, ProjectType} from "~/store/project";
import {getProjects, getProject} from "~/api/projects";
import {getContributors} from "~/api/github";
import {getYyyymmdd} from "~/utils/dateFormat";
import {forwardPadding} from "~/utils/strFormat";
import {NotAsTheOnlyError} from "~/utils/exceptions/length";

export const projectThunks = {
  fetchProject: (year: string, id: string) => {
    return async (dispatch: AppDispatch) => {
      dispatch(projectActions.switchIsLoading({isLoading: true}));
      // MEMO: ここのPromiseをreturnしないと，コンポーネント側でcatchして`react-router-dom.useNavigate()`を動かすことができない．
      return await Promise.all([getProjects()])
        .then(async (res) => {
          const resProjects = res[0].data;
          const regpttn = new RegExp(`^${year}${forwardPadding("0", 3, id)}_.+.yml$`, "g");
          const idxes = resProjects
            .map((content: {name: string}, idx: number) => content.name.match(regpttn) !== null ? idx : -1)
            .filter((idx: number) => idx > -1);
          // console.log(idxes);
          if (idxes.length !== 1) {
            throw new NotAsTheOnlyError("Not found as the only project.");
          }
          const fname = resProjects[idxes[0]].name;
          return await Promise.all([getProject(fname)])
            .then(async (res) => {
              const resProject = res[0].data;
              const rawProject = yaml.load(decodeURIComponent(escape(atob(resProject.content)))) as ProjectType;
              // TODO: projectにおいて特定のキーが不足していたら「記事構文が不適切」エラーを表示
              const project: ProjectType = {
                creator: rawProject.creator,
                // 「A non-serializable value was detected in an action」の対策
                createDate: getYyyymmdd(rawProject.createDate, "yyyy-mm-dd"),
                updateDate: getYyyymmdd(rawProject.updateDate, "yyyy-mm-dd"),
                content: {
                  title: ("title" in rawProject.content)
                    ? rawProject.content.title
                    : "",
                  description: ("description" in rawProject.content)
                    ? rawProject.content.description
                    : "",
                  imageLinks: ("imageLinks" in rawProject.content)
                    ? rawProject.content.imageLinks
                    : [],
                  missions: ("missions" in rawProject.content)
                    ? rawProject.content.missions
                    : [],
                  processes: ("processes" in rawProject.content)
                    ? rawProject.content.processes
                    : [],
                  tools: ("tools" in rawProject.content)
                    ? rawProject.content.tools
                    : [],
                  githubRepoLink: ("githubRepoLink" in rawProject.content)
                    ? rawProject.content.githubRepoLink
                    : "",
                  tags: ("tags" in rawProject.content)
                    ? rawProject.content.tags
                    : [],
                  // 後で`githubRepoLink`がある場合にAPI取得するので，一旦初期値として空データを格納
                  contributors: [],
                },
              };
              if (project.content.githubRepoLink !== "") {
                return await Promise.all([getContributors(project.content.githubRepoLink)])
                  .then(async (res) => {
                    const resContribs = res[0].data;
                    project.content.contributors = (resContribs.length > 0)
                      ? resContribs.map(contrib => {
                        return {
                          name: contrib.login,
                          imageLink: contrib.avatar_url
                        };
                      })
                      : [];
                    dispatch(projectActions.setProject({project: project}));
                    dispatch(projectActions.switchIsLoading({isLoading: false}));
                  })
                  .catch((err) => {
                    throw err;
                  });
              } else {
                dispatch(projectActions.setProject({project: project}));
                dispatch(projectActions.switchIsLoading({isLoading: false}));
              }
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch((err) => {
          throw err;
        });
    };
  },
};
