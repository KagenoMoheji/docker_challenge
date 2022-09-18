/*
types/declarations.d.ts置いたらエラーでなくなった
https://stackoverflow.com/a/41946697/15842506

"import * as xxx fron ~"と"import xxx from ~"は別物．後者の方が中身の実体伴う．
https://stackoverflow.com/a/48578475/15842506
*/
import styleTest1 from "~/styles/test1.scss";
import styleTest2 from "~/styles/test2.scss";

export const styles = {
    styleTest1,
    styleTest2,
};
