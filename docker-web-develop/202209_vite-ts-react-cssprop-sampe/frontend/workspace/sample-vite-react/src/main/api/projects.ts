import axios, {AxiosResponse} from "axios";

export const getProjects = async (): Promise<AxiosResponse<any, any>> => {
  return await axios.get(
    "https://api.github.com/repos/hello-deaf-world/test/contents/articles_project",
    {}
  );
};

export const getProject = async (fname: string): Promise<AxiosResponse<any, any>> => {
  return await axios.get(
    `https://api.github.com/repos/hello-deaf-world/test/contents/articles_project/${fname}`,
    {}
  );
};
