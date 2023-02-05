/*
- MEMO
  - カスタム例外の定義は関数ではなくクラスでやった方が「Expected an error object to be thrown.」と出ないのでeslint的に良さげ．
*/
export class NotAsTheOnlyError extends Error {
  /*
  [Usage]
  - redux-toolkitの状態「記事」の該当する単一の記事のインデックスを検索するthunksにおいて，レスポンスのインデックスが単一でなかった場合に例外を投げ，そのthunks関数を呼び出したコンポーネント側で例外を拾って例外ページに飛ばす．
  */
  constructor(msg = "The length is not 1.") {
    super(msg);
    this.name = "NOT_AS_THE_ONLY_ERROR";
    this.message = msg;
  }
}
