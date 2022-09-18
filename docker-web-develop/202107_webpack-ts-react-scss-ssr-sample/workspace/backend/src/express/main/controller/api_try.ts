import { Request, Response } from "express";
import { param, query, body, validationResult } from "express-validator";
import { resApiErr422 } from "@express/main/errhandle/errhandle_json";

// ==========================================================
// 下記はRequestの代わりに使用する．
// しかし型名の多様化による管理の大変さがある上，ここで定義したものはRequestの標準キー外の拡張キーになってしまうので違う．
// https://qiita.com/manten120/items/aa87e6af01a0cb87109e#%E6%96%B9%E6%B3%952-request%E5%9E%8B%E3%82%92%E7%B6%99%E6%89%BF%E3%81%97%E3%81%A6%E6%96%B0%E3%81%97%E3%81%84%E5%9E%8B%E3%82%92%E4%BD%9C%E3%82%8B
// export interface TryGetRequest extends Request {
//     reqbody: {
//         id: number;
//     };
//     query: {
//         username: string;
//     };
// }
// -----------------------------------------------------------
// 下記はジェネリックに使用する．
// https://blog-mk2.d-yama7.com/2020/03/20200314_express-reqres-generics/
// Request<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = qs.ParsedQs, Locals extends Record<string, any> = Record<string, any>>

interface TryGetRequest {
    id: number;
}
interface TryGetQuery {
    username: string;
}
export const TryGetValidator = [
    param("id").not().isEmpty().isInt(),
    query("username").not().isEmpty().isString(),
];
export const get = (
    req: Request<TryGetRequest, unknown, unknown, TryGetQuery>,
    res: Response
): Response => {
    // リクエストパラメータの判定
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        // res.send()をreturnしないと，「Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client」といった感じで直後に空レスポンス投げていると怒られてしまう．
        // https://casualdevelopers.com/tech-tips/how-to-fix-the-error-of-cannot-set-headers-after-they-are-sent-to-the-client/
        return resApiErr422(res, { errors: errs.array() });
    }

    const msg = `[id: ${req.params.id}] ${req.query.username}さん，こんにちは`;
    return res.status(200).send({
        msg: msg,
    });
};
