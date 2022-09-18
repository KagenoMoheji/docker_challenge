import { Request, Response } from "express";
import { ValidationError } from "express-validator";

interface APIErrResBody {
    errors:
        | [
              {
                  [key: string]: string | number;
              }
          ]
        | ValidationError[];
}

export const resApiErr404 = (res: Response, body: APIErrResBody): Response => {
    res.header("Content-Type", "application/json");
    return res.status(404).json(body);
};

export const resApiErr422 = (res: Response, body: APIErrResBody): Response => {
    res.header("Content-Type", "application/json");
    return res.status(422).json(body);
};
