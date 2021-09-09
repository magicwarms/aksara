import express from "express";

import userRouter from "./apps/users/user.router";
import finetuneRouter from "./apps/finetune/finetune.router";
import toneRouter from "./apps/tones/tone.router";
import fromToRouter from "./apps/fromto/fromto.router";
import themeRouter from "./apps/themes/theme.router";
import featureRouter from "./apps/features/feature.router";

import { verifyToken, verifyAdminAccess } from "./apps/middlewares";
/**
 * Router Definition
 */
const router = express.Router();
/**
 * Controller Definitions
 */
router.use("/users", userRouter);
router.use("/finetune", [verifyToken, verifyAdminAccess], finetuneRouter);
router.use("/tone", [verifyToken, verifyAdminAccess], toneRouter);
router.use("/fromto", [verifyToken, verifyAdminAccess], fromToRouter);
router.use("/theme", [verifyToken, verifyAdminAccess], themeRouter);
router.use("/feature", [verifyToken, verifyAdminAccess], featureRouter);

export default router;
