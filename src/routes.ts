import express from "express";

import userRouter from "./apps/users/user.router";
import finetuneRouter from "./apps/finetune/finetune.router";

import verifyToken from "./apps/middlewares";
/**
 * Router Definition
 */
const router = express.Router();
/**
 * Controller Definitions
 */
router.use("/users", userRouter);
router.use("/finetune", [verifyToken], finetuneRouter);

export default router;
