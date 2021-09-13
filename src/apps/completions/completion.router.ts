/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as CompletionController from "./completion.controller";
/**
 * Router Definition
 */
const completionRouter = express.Router();
/**
 * Controller Definitions
 */

completionRouter.get("/history", CompletionController.getAllCompletion);
completionRouter.post("/store", CompletionController.storeCompletion);

export default completionRouter;
