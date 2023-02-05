import {Link} from "react-router-dom";
import {css} from "styled-components/macro";

export type TagsPropsType = {
  tags: string[];
};

export const Tags = (props: TagsPropsType): JSX.Element => {
  const compTags: JSX.Element[] = [];
  for (let i = 0; i < props.tags.length; i++) {
    const tag = props.tags[i];
    compTags.push(
      // aタグに`transform:rotate`が効かないようなのでdivで囲んだ．またtailwindcssの.rotateが使いづらかったので，csspropを使用した．
      <div className="mx-[5px] my-[10px] rotate-10">
        <Link to={`/projects?tag=${tag}`} className="reset-a" key={i}>
          <span className="bg-sky-600 text-[#eee] before:content-['●'] before:text-[16px] before:mr-[5px] p-[5px] rounded-tl-[15px] rounded-bl-[15px]">
            {tag}
          </span>
        </Link>
      </div>
    );
  }
  return (
    <div className="comp-tags" css={scopedStyles.cssTags()}>
      <div className="flex flex-row flex-wrap">
        {compTags}
      </div>
    </div>
  );
};

const scopedStyles = {
  cssTags: () => css`
.rotate-10 {
  transform: rotate(10deg);
}
`,
};
