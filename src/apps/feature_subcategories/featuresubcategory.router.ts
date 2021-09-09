/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as FeatureSubCategoryController from "./featuresubcategory.controller";
/**
 * Router Definition
 */
const featureSubCategoryRouter = express.Router();
/**
 * Controller Definitions
 */

featureSubCategoryRouter.get("/", FeatureSubCategoryController.getAllFeatureSubCategories);
featureSubCategoryRouter.post("/store-update", FeatureSubCategoryController.storeOrUpdateFeatureSubCategory);
featureSubCategoryRouter.delete("/delete", FeatureSubCategoryController.deleteFeatureSubCategory);

export default featureSubCategoryRouter;
