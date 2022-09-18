import express, { Request, Response } from "express";
import * as tryController from "@express/main/controller/api_try";
const router = express.Router();

router.get("/:id", tryController.TryGetValidator, tryController.get);

export default router;
