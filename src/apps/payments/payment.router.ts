/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as PaymentController from "./payment.controller";
import { verifyToken } from "../middlewares";
/**
 * Router Definition
 */
const paymentRouter = express.Router();
/**
 * Controller Definitions
 */
// PAYMENT METHOD ROUTERS
paymentRouter.get("/method", [verifyToken], PaymentController.getAllPaymentMethod);

// PAYMENT ROUTERS
paymentRouter.post("/pay", [verifyToken], PaymentController.storePayment);
paymentRouter.post("/process", PaymentController.processPayment);
paymentRouter.get("/return", PaymentController.processReturnPayment);
paymentRouter.get("/check", [verifyToken], PaymentController.checkTransaction);
paymentRouter.get("/history", [verifyToken], PaymentController.getAllPaymentHistory);

export default paymentRouter;
