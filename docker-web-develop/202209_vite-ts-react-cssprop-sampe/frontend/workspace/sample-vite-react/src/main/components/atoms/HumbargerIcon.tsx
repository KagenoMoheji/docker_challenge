import {css} from "styled-components/macro";

type HumbargerIconProps = {
  styles?: {[name: string]: string};
  classNames?: string;
};

export const HumbargerIcon = (props: HumbargerIconProps): JSX.Element => {
  return (
    <div className={`comp-humbargericon ${props.classNames === undefined ? "" : props.classNames}`} style={props.styles} css={scopedStyles.cssHumbargerIcon}>
      <span className="humb-icon-line humb-icon-line-1"></span>
      <span className="humb-icon-line humb-icon-line-2"></span>
      <span className="humb-icon-line humb-icon-line-3"></span>
    </div>
  );
};

const scopedStyles = {
  cssHumbargerIcon: css`
/* z-index: 100; */
/* width: 50px; / こっちでhumb-iconのサイズ決める． */
/* height: 50px; / こっちでhumb-iconのサイズ決める． */
cursor: pointer;
position: relative;
.humb-icon-line {
  position: absolute;
  width: 85%; /* なんか右にはみ出てたので少し短くする． */
  border: 2px solid #111;
  background-color: #111;
  transition: all 0.3s;
}
.humb-icon-line-1 {
  top: 25%;
}
.humb-icon-line-2 {
  top: 50%;
}
.humb-icon-line-3 {
  top: 75%;
}
&.humb-active {
  /* ハンバーガーメニューが開かれているときのスタイル */
  .humb-icon-line {
    border: 2px solid #111;
  }
  .humb-icon-line-1 {
    top: 50%;
    transform: rotate(45deg);
  }
  .humb-icon-line-2 {
    width: 0;
    border: none;
  }
  .humb-icon-line-3 {
    top: 50%;
    transform: rotate(-45deg);
  }
}
`,
};
