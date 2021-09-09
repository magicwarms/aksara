/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as FeatureController from "./feature.controller";
/**
 * Router Definition
 */
const featureRouter = express.Router();
/**
 * Controller Definitions
 */

featureRouter.get("/", FeatureController.getAllFeature);
featureRouter.post("/store-update", FeatureController.storeOrUpdateFeature);
featureRouter.delete("/delete", FeatureController.deleteFeature);

export default featureRouter;
