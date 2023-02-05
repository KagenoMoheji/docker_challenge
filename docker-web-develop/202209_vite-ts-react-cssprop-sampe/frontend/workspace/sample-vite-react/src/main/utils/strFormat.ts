export const forwardPadding = (padding: string, length: number, text: string): string => {
  /*
  指定文字数のうち前方を指定文字で埋めて返す．
  - Args
    - padding:String: 埋める文字
    - lengh:int: 文字数
    - text:String: 右詰めする文字列
  */
  length = length >= 0 ? length : -length;
  return  (String(padding).repeat(length) + text).slice(-length);
};
