/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as FromToController from "./fromto.controller";
/**
 * Router Definition
 */
const fromToRouter = express.Router();
/**
 * Controller Definitions
 */

fromToRouter.get("/", FromToController.getAllFromTo);
fromToRouter.post("/store-update", FromToController.storeOrUpdateFromTo);
fromToRouter.delete("/delete", FromToController.deleteFromTo);

export default fromToRouter;
