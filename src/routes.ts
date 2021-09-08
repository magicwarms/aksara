import express from "express";

import userRouter from "./apps/users/user.router";
import finetuneRouter from "./apps/finetune/finetune.router";
import toneRouter from "./apps/tones/tone.router";
import fromToRouter from "./apps/fromto/fromto.router";

import { verifyToken } from "./apps/middlewares";
/**
 * Router Definition
 */
const router = express.Router();
/**
 * Controller Definitions
 */
router.use("/users", userRouter);
router.use("/finetune", [verifyToken], finetuneRouter);
router.use("/tone", [verifyToken], toneRouter);
router.use("/fromto", [verifyToken], fromToRouter);

export default router;
