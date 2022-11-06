/*
addEventListener()やremoveEventListener()の引数の型定義．そのまま引用している．
- WARNING
  - 最初は上の連想配列の形で型定義したが，JavaScriptでは引数に連想配列のスプレッド構文を渡す仕様がなかった．
  - 代わりに下の「[key, value]の配列」で型定義し，引数にはvalueのみ抽出した配列をスプレッド構文で渡す方法を取る．
*/
// export type ParamEventListener = {
//   type: string;
//   listener: (eve: MouseEvent) => any;
//   options?: boolean | AddEventListenerOptions | undefined;
// };
export type ParamEventListener = [
  ["type", string],
  ["listener", (eve: MouseEvent) => any],
  ["options", boolean | AddEventListenerOptions | EventListenerOptions | undefined]?,
];
