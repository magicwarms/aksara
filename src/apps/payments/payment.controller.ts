import { NextFunction, Request, Response } from "express";

import * as PaymentService from "./payment.service";

export const getAllPaymentMethod = async (_req: Request, res: Response, _next: NextFunction) => {
    const paymentMethodsData = await PaymentService.getAllPaymentMethod();
    return res.status(200).json({
        success: true,
        data: paymentMethodsData,
        message: "Payment method data found",
    });
};

export const storeOrUpdatePaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentMethodId: string = req.body.id;
        const status: string = paymentMethodId ? "updated" : "saved";
        const storeOrUpdatePaymentMethod = await PaymentService.storeOrUpdatePaymentMethod(req.body);
        if (storeOrUpdatePaymentMethod instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storeOrUpdatePaymentMethod,
                message: `Validation error`,
            });
        }
        return res.status(200).json({
            success: true,
            data: storeOrUpdatePaymentMethod,
            message: `Payment method data successfully ${status}`,
        });
    } catch (err) {
        next(err);
    }
};

export const deletePaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentMethodId = req.body.id;
        if (!paymentMethodId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `Payment method ID is required`,
            });
        }
        const deletePaymentMethod = await PaymentService.deletePaymentMethod(paymentMethodId);
        if (!deletePaymentMethod.affected) {
            return res.status(200).json({
                success: false,
                data: null,
                message: "Payment method data not successfully deleted",
            });
        }
        return res.status(200).json({
            success: true,
            data: null,
            message: "Payment method data successfully deleted",
        });
    } catch (err) {
        next(err);
    }
};

export const storePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string = res.locals.userId;
        const userEmail: string = res.locals.email;
        const userFullname: string = res.locals.fullname;
        const storePayment = await PaymentService.storePayment(req.body, { userId, userEmail, userFullname });
        if (storePayment instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storePayment,
                message: `Validation error`,
            });
        }
        return res.status(200).json({
            success: true,
            data: { storePayment },
            message: `Payment data successfully saved`,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const processPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TO-DO
        // ini belum tahu kegunaan nya apa
        console.log("process BODY callback", req.body);
        return res.status(200).json({
            success: true,
            data: req.body,
            message: `Payment data successfully processed`,
        });
    } catch (err) {
        next(err);
    }
};

export const processReturnPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("process BODY return", req.body);
        await PaymentService.updateStatusPayment({
            reference: String(req.query.reference),
            resultCode: String(req.query.resultCode),
        });
        // TO-DO
        // ini harus nya redirect ke aksara frontend
        return res.redirect("http://www.google.com/");
    } catch (err) {
        next(err);
    }
};
