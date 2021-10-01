import { NextFunction, Request, Response } from 'express';
import { isEmpty } from 'lodash';
import { StatusMessage } from './payment.enum';
import { queryCheckTrxPayment, queryGetAllPaymentHistory, queryGetAllPaymentMethod } from './payment.interface';

import * as PaymentService from './payment.service';

export const getAllPaymentMethod = async (
    req: Request<unknown, unknown, unknown, queryGetAllPaymentMethod>,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    if (isEmpty(req.query.amount)) {
        return res.status(422).json({
            success: false,
            data: null,
            message: `Payment amount is required`
        });
    }
    try {
        const amount: number = req.query.amount;
        const paymentMethodsData = await PaymentService.getAllPaymentMethod(amount);
        return res.status(200).json({
            success: true,
            data: paymentMethodsData.paymentFee,
            message: 'Payment method data found'
        });
    } catch (err) {
        next(err);
    }
};

export const getAllPaymentHistory = async (
    req: Request<unknown, unknown, unknown, queryGetAllPaymentHistory>,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    const paymentStatus: StatusMessage | undefined = req.query.status;
    const userId: string = res.locals.userId;
    try {
        const paymentHistory = await PaymentService.getAllPaymentHistory({ paymentStatus, userId });
        return res.status(200).json({
            success: true,
            data: paymentHistory,
            message: paymentHistory.length > 0 ? 'Payment history data found' : 'Payment history data not found'
        });
    } catch (err) {
        next(err);
    }
};

export const storePayment = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
        const userId: string = res.locals.userId;
        const userEmail: string = res.locals.email;
        const userFullname: string = res.locals.fullname;
        const storePayment = await PaymentService.storePayment(req.body, { userId, userEmail, userFullname });
        if (storePayment instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storePayment,
                message: `Validation error`
            });
        }
        return res.status(200).json({
            success: true,
            data: { storePayment },
            message: `Payment data has been saved`
        });
    } catch (err) {
        next(err);
    }
};

export const processPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        // ini untuk bayar pakai virtual account hanya dikirim transaksi sukses saja
        // gak berjalan jika masih localhost
        const processPaymentData = await PaymentService.updatePaymentStatus({
            reference: String(req.body.reference),
            resultCode: String(req.body.resultCode)
        });
        return res.status(200).json({
            success: true,
            data: typeof processPaymentData === 'string' ? {} : processPaymentData,
            message: typeof processPaymentData === 'string' ? processPaymentData : `Payment data has been processed`
        });
    } catch (err) {
        next(err);
    }
};

export const processReturnPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        console.log('process BODY return', req.query);
        // dimatikan dulu sebentar karna masih bingung
        // just info ini untuk redirect after payment
        // hanya redirect after payment
        // await PaymentService.updateStatusPayment({
        //     reference: String(req.query.reference),
        //     resultCode: String(req.query.resultCode),
        // });
        // TO-DO
        // ini harus nya redirect ke aksara frontend
        return res.redirect('http://www.google.com/');
    } catch (err) {
        next(err);
    }
};

export const checkTransaction = async (
    req: Request<unknown, unknown, unknown, queryCheckTrxPayment>,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const transactionCode: string = req.query.transactionCode;
        if (!transactionCode) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `Transaction code is required`
            });
        }
        const checkTransaction = await PaymentService.checkTransaction(transactionCode);
        return res.status(200).json({
            success: true,
            data: typeof checkTransaction === 'string' ? {} : checkTransaction,
            message: typeof checkTransaction === 'string' ? checkTransaction : `Payment status successfully found`
        });
    } catch (err) {
        next(err);
    }
};
