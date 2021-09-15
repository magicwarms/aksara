/**
 * Required External Modules and Interfaces
 */
import express from "express";
import { verifyAdminAccess } from "../middlewares";
import * as FromToController from "./fromto.controller";
/**
 * Router Definition
 */
const fromToRouter = express.Router();
/**
 * Controller Definitions
 */

fromToRouter.get("/", FromToController.getAllFromTo);
fromToRouter.post("/store-update", [verifyAdminAccess], FromToController.storeOrUpdateFromTo);
fromToRouter.delete("/delete", [verifyAdminAccess], FromToController.deleteFromTo);

export default fromToRouter;
