// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callObjectToString = (v: any): string => {
  /*
  "[object <クラス名>]"の形で取得する．
  - Refs
    - https://qiita.com/south37/items/c8d20a069fcbfe4fce85#%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%81%AEclass%E3%82%92%E7%94%A8%E3%81%84%E3%81%9F%E5%88%A4%E5%AE%9A
  */
  return Object.prototype.toString.call(v);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const typeOf = (ins: any, type: any): boolean => {
  /*
  ins(instance)の型がtypeにマッチするか．
  - Refs
    - https://qiita.com/south37/items/c8d20a069fcbfe4fce85#constructor%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3%E3%82%92%E7%94%A8%E3%81%84%E3%81%9F%E5%88%A4%E5%AE%9A
  */
  return ins.constructor === type;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isAssocArray = (obj: any): boolean => {
  /*
  連想配列であるかチェックする．
  */
  return (obj instanceof Object) && !(obj instanceof Array);
};
