/**
 * Required External Modules and Interfaces
 */
import express from "express";
import { verifyAdminAccess } from "../middlewares";
import * as ToneController from "./tone.controller";
/**
 * Router Definition
 */
const toneRouter = express.Router();
/**
 * Controller Definitions
 */

toneRouter.get("/", ToneController.getAllTone);
toneRouter.post("/store-update", [verifyAdminAccess], ToneController.storeOrUpdateTone);
toneRouter.delete("/delete", [verifyAdminAccess], ToneController.deleteTone);

export default toneRouter;
