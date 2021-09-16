/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as PaymentController from "./payment.controller";
import { verifyAdminAccess } from "../middlewares";
/**
 * Router Definition
 */
const paymentRouter = express.Router();
/**
 * Controller Definitions
 */
// PAYMENT METHOD ROUTERS
paymentRouter.get("/method", PaymentController.getAllPaymentMethod);
paymentRouter.post("/method/store-update", [verifyAdminAccess], PaymentController.storeOrUpdatePaymentMethod);
paymentRouter.delete("/method/delete", [verifyAdminAccess], PaymentController.deletePaymentMethod);

export default paymentRouter;
