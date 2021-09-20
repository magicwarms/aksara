/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as PaymentController from "./payment.controller";
import { verifyAdminAccess, verifyToken } from "../middlewares";
/**
 * Router Definition
 */
const paymentRouter = express.Router();
/**
 * Controller Definitions
 */
// PAYMENT METHOD ROUTERS
paymentRouter.get("/method", [verifyToken], PaymentController.getAllPaymentMethod);
paymentRouter.post(
    "/method/store-update",
    [verifyToken, verifyAdminAccess],
    PaymentController.storeOrUpdatePaymentMethod
);
paymentRouter.delete("/method/delete", [verifyToken, verifyAdminAccess], PaymentController.deletePaymentMethod);

// PAYMENT ROUTERS
paymentRouter.post("/pay", [verifyToken], PaymentController.storePayment);
paymentRouter.post("/process", PaymentController.processPayment);
paymentRouter.get("/return", PaymentController.processReturnPayment);
paymentRouter.get("/check", [verifyToken], PaymentController.checkTransaction);

export default paymentRouter;
