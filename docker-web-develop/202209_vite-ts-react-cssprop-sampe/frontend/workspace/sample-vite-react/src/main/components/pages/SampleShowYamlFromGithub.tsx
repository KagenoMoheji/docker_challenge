/*
- Refs
  - yamlをjavascriptでパースする方法
    - そもそもyamlを採用する理由：改行の書く手間が小さい
  - https://maku77.github.io/nodejs/io/yaml.html
*/
import yaml from "js-yaml";
import {useState, useEffect, useMemo} from "react";
import axios from "axios";
import {useQueryStrings} from "~/utils/reacthooks/react-router-dom";

type Article = {
  creator: string;
  createDate: string;
  updateDate: string;
  content: {
    mission: string;
    processes: Array<{
      process: string;
      detail?: string;
    }>;
    tools: string[];
  };
};

export const SampleShowYamlFromGithub = (): JSX.Element => {
  const [ymlArticle, setYmlArticle] = useState<string>("");
  const qstrs = useQueryStrings();
  // useEffect(() => {
  //   axios.get("https://api.github.com/repos/KagenoMoheji/test/contents/hoge.yml", {})
  //     .then((res) => {
  //       setYmlArticle(decodeURIComponent(escape(atob(res.data.content))));
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);
  // MEMO: useEffectよりuseMemoを使った方が処理回数を抑えられる？？
  useMemo(() => {
    axios.get("https://api.github.com/repos/KagenoMoheji/test/contents/hoge.yml", {})
      .then((res) => {
        setYmlArticle(decodeURIComponent(escape(atob(res.data.content))));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(ymlArticle);
  console.log(qstrs.get("key"));
  /*
  - Refs
    - https://zenn.dev/team_zenn/articles/yaml-type-spec
      - YAMLの型仕様およびjs-yamlにおけるtimestampの解析仕様について
  */
  const article = yaml.load(ymlArticle) as Article;
  console.log(article);
  if ((article instanceof Object && !(article instanceof Array)) && ("createDate" in article)) {
    console.log(Object.prototype.toString.call(article.createDate));
  }
  return (
    <div className="comp-sampleshowyamlfromgithub">
      <div className="break-words" dangerouslySetInnerHTML={{__html: ((article instanceof Object && !(article instanceof Array)) && ("content" in article)) ? article.content.mission.replace(/(\r\n|\n|\r)/g, "<br>") : ""}} />
    </div>
  );
};
