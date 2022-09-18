/*
"routes/"はルーティングのみ記載．
ルートパスからの値を受け取って処理し，ページ遷移またはレスポンス送信する処理は"controllers/"に記述する．
こちらで用意したモジュール(ファイル)は，基本的に"controllers/"でも同期させる．
- 参考
    - https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/routes
*/
import express, { Request, Response } from "express";
import * as rootController from "@express/main/controller/root";
import apiRouter from "@express/main/routes/api";
import { resStatusErr404 } from "@express/main/errhandle/errhandle_status";
import { resApiErr404 } from "@express/main/errhandle/errhandle_json";
const router = express.Router();

router.get("/", rootController.get);

router.use("/api", apiRouter);

/*
その他リクエストに対する404エラー応答
*/
// router.use((req, res) => {
//     resStatusErr404(res);
// });
router.use((req, res) => {
    resApiErr404(res, { errors: [{ errCode: 404 }] });
});

export default router;
