/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as FeatureCategoryController from "./featurecategory.controller";
/**
 * Router Definition
 */
const featureCategoryRouter = express.Router();
/**
 * Controller Definitions
 */

featureCategoryRouter.get("/", FeatureCategoryController.getAllFeatureCategories);
featureCategoryRouter.post("/store-update", FeatureCategoryController.storeOrUpdateFeatureCategory);
featureCategoryRouter.delete("/delete", FeatureCategoryController.deleteFeatureCategory);

export default featureCategoryRouter;
