import React from "react";
import {AiOutlineCloseCircle} from "react-icons/ai";
import * as BoxIcons from "react-icons/bi";
import * as SimpleIcons from "react-icons/si";
import * as DevIcons from "react-icons/di";
import {css} from "styled-components/macro";
import {ImgTileType} from "~/store/project";

export type CircleImgTilesPropsType = {
  imgTiles: ImgTileType[];
  imgW?: string;
  imgJustify?: string;
};

export const CircleImgTiles = (props: CircleImgTilesPropsType): JSX.Element => {
  props = {
    ...{
      // デフォルト値
      imgTiles: [],
      imgW: "60px",
      imgJustify: "start",
    },
    // 下記で上書き
    ...props
  };
  const compImgTiles: JSX.Element[] = [];
  for (let i = 0; i < props.imgTiles.length; i++) {
    const imgTile: ImgTileType = props.imgTiles[i];
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    let compImg = <AiOutlineCloseCircle className="rounded-full" />;
    if (imgTile.imageLink.startsWith("ReactIcons/")) {
      const iconInfo = imgTile.imageLink.split("/");
      if (iconInfo.length === 3) {
        if (iconInfo[1] === "SimpleIcons") {
          if (iconInfo[2] in SimpleIcons) {
            compImg = React.createElement(
              // TODO: 下記の構文エラー出てるが動く．赤波線消せないものか．
              SimpleIcons[iconInfo[2]],
              {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                className: "rounded-full"
              }
            );
          }
        } else if (iconInfo[1] === "DevIcons") {
          if (iconInfo[2] in DevIcons) {
            compImg = React.createElement(
              // TODO: 下記の構文エラー出てるが動く．赤波線消せないものか．
              DevIcons[iconInfo[2]],
              {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                className: "rounded-full"
              }
            );
          }
        } else if (iconInfo[1] === "BoxIcons") {
          // 主に`BiUserCircle`用
          if (iconInfo[2] in BoxIcons) {
            compImg = React.createElement(
              // TODO: 下記の構文エラー出てるが動く．赤波線消せないものか．
              BoxIcons[iconInfo[2]],
              {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                className: "rounded-full"
              }
            );
          }
        }
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      compImg = <img src={imgTile.imageLink} className={"rounded-full"} />;
    }
    compImgTiles.push(
      <div key={i} className="group mx-[10px] mb-[10px] flex flex-col items-center relative">
        <div>{compImg}</div>
        <div className="hidden group-hover:block z-5 absolute top-[60%] w-[100px] text-center bg-white bg-opacity-80 break-words">
          {imgTile.name}
        </div>
      </div>
    );
  }
  return (
    <div className="comp-circleimgtiles" css={scopedStyles.cssCircleImgTiles(props.imgW)}>
      {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
      <div className={`flex flex-row flex-wrap justify-${props.imgJustify}`}>
        {compImgTiles}
      </div>
    </div>
  );
};

const scopedStyles = {
  cssCircleImgTiles: (imgW?: string) => css`
div {
  img {
    // MEMO: tailwindcssでの"w-[\${props.imgW}]"より反映されやすい
    width: ${imgW};
  }
  svg {
    // MEMO: tailwindcssでの"text-[\${props.imgW}]"より反映されやすい
    font-size: ${imgW};
  }
}
`,
};
