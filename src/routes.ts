import express from "express";

import userRouter from "./apps/users/user.router";
import finetuneRouter from "./apps/finetune/finetune.router";
import toneRouter from "./apps/tones/tone.router";
import fromToRouter from "./apps/fromto/fromto.router";
import featureRouter from "./apps/features/feature.router";
import featureCategoryRouter from "./apps/feature_categories/featurecategory.router";
import featureSubCategoryRouter from "./apps/feature_subcategories/featuresubcategory.router";
import completionRouter from "./apps/completions/completion.router";
import paymentRouter from "./apps/payments/payment.router";

import { verifyToken, verifyAdminAccess } from "./apps/middlewares";
/**
 * Router Definition
 */
const router = express.Router();
/**
 * Controller Definitions
 */

router.use("/finetune", [verifyToken, verifyAdminAccess], finetuneRouter);
router.use("/tone", [verifyToken], toneRouter);
router.use("/fromto", [verifyToken], fromToRouter);
router.use("/feature", [verifyToken], featureRouter);
router.use("/feature-category", [verifyToken], featureCategoryRouter);
router.use("/feature-subcategory", [verifyToken], featureSubCategoryRouter);

router.use("/user", userRouter);
router.use("/completion", [verifyToken], completionRouter);
router.use("/payment", [verifyToken], paymentRouter);

export default router;
