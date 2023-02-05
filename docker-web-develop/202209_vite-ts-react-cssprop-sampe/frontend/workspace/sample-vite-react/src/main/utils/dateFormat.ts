import {typeOf} from "~/utils/typeCheck";
import {forwardPadding} from "~/utils/strFormat";

export const getYyyymmdd = (_dt: string | Date, pattern = "yyyy/mm/dd"): string => {
  /*
  0埋めされた"yyyy"(year)・"mm"(month)・"dd"(date)をpattern通りに配置して返す．
  */
  let dt = null;
  if (typeOf(_dt, Date)) {
    dt = _dt as Date;
  } else {
    dt = new Date(_dt);
  }
  return pattern
    .replace("yyyy", forwardPadding("0", 4, dt.getFullYear().toString())) // ("0000" + dt.getFullYear()).slice(-4)
    .replace("mm", forwardPadding("0", 2, (dt.getMonth() + 1).toString())) // ("00" + (dt.getMonth() + 1)).slice(-2)
    .replace("dd", forwardPadding("0", 2, dt.getDate().toString())); // ("00" + dt.getDate()).slice(-2)
};

export const getHhmmss = (_dt: string | Date, pattern = "hh:mm:ss"): string => {
  /*
  0埋めされた"hh"(hour)・"mm"(minute)・"ss"(second)をpattern通りに配置して返す．
  */
  let dt = null;
  if (typeOf(_dt, Date)) {
    dt = _dt as Date;
  } else {
    dt = new Date(_dt);
  }
  return pattern
    .replace("hh", forwardPadding("0", 2, dt.getHours().toString())) // ("00" + dt.getHours()).slice(-2)
    .replace("mm", forwardPadding("0", 2, dt.getMinutes().toString())) // ("00" + (dt.getMinutes())).slice(-2)
    .replace("ss", forwardPadding("0", 2, dt.getSeconds().toString())); // ("00" + dt.getSeconds()).slice(-2)
};
