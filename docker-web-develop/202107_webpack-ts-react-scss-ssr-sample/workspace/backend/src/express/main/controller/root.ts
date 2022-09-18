/*
"actions/"はパスに対する処理と，遷移先・メッセージ・処理結果をパスへ返すことのみ記載(もはやlogic部分)．
あと，RequestとResponseの型もこちらで定義する．
ルーティングは"routes/"に記述する．
こちらで用意したモジュール(ファイル)は，基本的に"routes/"でも同期させる．
したがって，個人的に「"routes/"+"actions"="controller/"」の認識．
- 参考
    - https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/routes
*/
import { Request, Response } from "express";

export const get = (req: Request, res: Response): Response => {
    const msg = "Hello, Root!";
    return res.status(200).send({
        msg: msg,
    });
};
