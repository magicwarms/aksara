import express from "express";

import userRouter from "./users/user.router";
import finetuneRouter from "./finetune/finetune.router";
/**
 * Router Definition
 */
const router = express.Router();
/**
 * Controller Definitions
 */
router.use("/users", userRouter);
router.use("/finetune", finetuneRouter);

export default router;
