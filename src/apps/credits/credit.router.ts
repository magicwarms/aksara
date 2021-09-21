/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as CreditController from "./credit.controller";
/**
 * Router Definition
 */
const creditRouter = express.Router();
/**
 * Controller Definitions
 */
creditRouter.get("/", CreditController.getCreditUser);

export default creditRouter;
