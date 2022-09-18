import express, { Request, Response, NextFunction } from "express";
import tryRouter from "@express/main/routes/api_try";
const router = express.Router();

router.use("/try", tryRouter);

export default router;
