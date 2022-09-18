import { Request, Response } from "express";

export const resStatusErr404 = (res: Response): Response => {
    return res.sendStatus(404);
};
