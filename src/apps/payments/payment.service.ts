/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import isEmpty from "lodash/isEmpty";
import { UpdateResult } from "typeorm";

import validation from "../../config/validation";

import { PaymentMethod } from "./entity/PaymentMethod";
import { Payment } from "./entity/Payment";
import * as PaymentRepository from "./payment.repository";
import { setNanoId } from "../../utilities/helper";
import axios from "axios";
import { transactionData } from "./payment.interface";
import { Md5 } from "ts-md5/dist/md5";

/**
 * Service Methods
 */
export const getAllPaymentMethod = async (): Promise<PaymentMethod[]> => {
    let getAllPaymentMethod = await PaymentRepository.getAllPaymentMethod();
    if (getAllPaymentMethod.length < 0) getAllPaymentMethod = [];
    return getAllPaymentMethod;
};

export const storeOrUpdatePaymentMethod = async (
    paymentMethodData: PaymentMethod
): Promise<PaymentMethod | ValidationError[]> => {
    const paymentMethod = new PaymentMethod();
    paymentMethod.id = isEmpty(paymentMethodData.id) ? undefined : paymentMethodData.id;
    paymentMethod.name = paymentMethodData.name.toUpperCase();
    paymentMethod.fullname = paymentMethodData.fullname;
    paymentMethod.isActive = paymentMethodData.isActive;

    const validateData = await validation(paymentMethod);
    if (validateData.length > 0) return validateData;

    const storeOrUpdatePaymentMethod = await PaymentRepository.storeOrUpdatePaymentMethod(paymentMethod);

    return storeOrUpdatePaymentMethod;
};

export const deletePaymentMethod = async (id: string): Promise<UpdateResult> => {
    return await PaymentRepository.deletePaymentMethod(id);
};

const requestTransactionDuitKu = async (trxData: transactionData) => {
    const endpoint =
        process.env.NODE_ENV === "production"
            ? process.env.DUITKU_API_ENDPOINT_REQUEST_TRANSACTION_PROD
            : process.env.DUITKU_API_ENDPOINT_REQUEST_TRANSACTION_DEV;

    const requestTrxDuitku = await axios({
        url: endpoint,
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        data: { trxData },
    });

    return requestTrxDuitku;
};

export const storePayment = async (
    paymentData: Payment,
    user: { userId: string; userEmail: string; userFullname: string }
): Promise<Payment | ValidationError[] | null> => {
    const transactionCode = `ORDER-${setNanoId()}`;
    const merchantCode: string | undefined =
        process.env.NODE_ENV === "production"
            ? process.env.MERCHANT_CODE_DUITKU_PROD
            : process.env.MERCHANT_CODE_DUITKU_DEV;

    const merchantKey: string | undefined =
        process.env.NODE_ENV === "production"
            ? process.env.MERCHANT_KEY_DUITKU_PROD
            : process.env.MERCHANT_KEY_DUITKU_DEV;

    const returnUrl: string | undefined =
        process.env.NODE_ENV === "production" ? process.env.RETURN_URL_DUITKU_PROD : process.env.RETURN_URL_DUITKU_DEV;

    const callbackUrl: string | undefined =
        process.env.NODE_ENV === "production"
            ? process.env.CALLBACK_URL_DUITKU_PROD
            : process.env.CALLBACK_URL_DUITKU_DEV;

    const grandtotalPayment = Number(paymentData.grandtotal);
    const orderDetail = `Payment for ${paymentData.itemDetails.feature} → ${paymentData.itemDetails.featureCategory} → ${paymentData.itemDetails.featureSubCategory}`;
    const fullnameSplit = user.userFullname.split(" ");

    const transactionData: transactionData = {
        merchantCode,
        paymentAmount: grandtotalPayment,
        merchantOrderId: transactionCode,
        productDetails: orderDetail,
        email: user.userEmail,
        paymentMethod: paymentData.paymentMethod.toUpperCase(),
        customerVaName: user.userFullname,
        itemDetails: [
            {
                name: orderDetail,
                quantity: paymentData.credits,
                price: Number(paymentData.amountCreditPrice),
            },
        ],
        customerDetail: {
            firstName: fullnameSplit[0],
            lastName: fullnameSplit[1],
            email: user.userEmail,
        },
        returnUrl,
        callbackUrl,
        signature: Md5.hashStr(`${merchantCode}${transactionCode}${grandtotalPayment}${merchantKey}`),
        expiryPeriod: 60, // in minutes
    };

    const paymentProcess = await requestTransactionDuitKu(transactionData);
    console.log(paymentProcess);
    // const payment = new Payment();
    // payment.userId = user.userId;
    // payment.transactionCode = transactionCode;
    // payment.paymentMethod = paymentData.paymentMethod.toUpperCase();
    // payment.amountCreditPrice = paymentData.amountCreditPrice;
    // payment.orderDetail = orderDetail;
    // payment.itemDetails = paymentData.itemDetails;
    // payment.referenceDuitKuId = paymentData.referenceDuitKuId;
    // payment.status = paymentData.status;

    // const validateData = await validation(payment);
    // if (validateData.length > 0) return validateData;

    // const storePayment = await PaymentRepository.storePayment(payment);

    return null;
};
