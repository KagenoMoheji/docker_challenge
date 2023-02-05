import axios, {AxiosResponse} from "axios";

export type ContributorType = {
  login: string;
  avatar_url: string;
};

export const getContributors = async (githubRepoLink: string): Promise<AxiosResponse<ContributorType[], any>> => {
  const splittedLink = githubRepoLink.split("/");
  // `<ユーザ・組織名>/<レポジトリ名>`を抽出
  const repoPath = `${splittedLink[splittedLink.length - 2]}/${splittedLink[splittedLink.length - 1]}`;
  return await axios.get(
    `https://api.github.com/repos/${repoPath}/contributors`,
    {}
  );
};
