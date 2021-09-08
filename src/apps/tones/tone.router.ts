/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as ToneController from "./tone.controller";
/**
 * Router Definition
 */
const toneRouter = express.Router();
/**
 * Controller Definitions
 */

toneRouter.get("/", ToneController.getAllTone);
toneRouter.post("/store-update", ToneController.storeOrUpdateTone);
toneRouter.delete("/delete", ToneController.deleteTone);

export default toneRouter;
