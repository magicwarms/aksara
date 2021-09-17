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
import { checkStatusCode, setNanoId, setStatusMessageRedirect } from "../../utilities/helper";
import axios from "axios";
import { responsePayment, transactionData } from "./payment.interface";
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

const requestTransactionDuitKu = async (data: transactionData) => {
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
        data,
    });
    if (requestTrxDuitku.status !== 200) {
        throw new Error("Payment error");
    }
    return requestTrxDuitku.data;
};

export const storePayment = async (
    paymentData: Payment,
    user: { userId: string; userEmail: string; userFullname: string }
): Promise<Payment | ValidationError[] | responsePayment> => {
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
    const orderDescription = `Payment for purchase ${paymentData.credits} credits`;
    const fullnameSplit = user.userFullname.split(" ");

    const transactionData: transactionData = {
        merchantCode,
        paymentAmount: grandtotalPayment,
        merchantOrderId: transactionCode,
        productDetails: orderDescription,
        email: user.userEmail,
        paymentMethod: paymentData.paymentMethod.toUpperCase(),
        customerVaName: user.userFullname,
        itemDetails: [
            {
                name: orderDescription,
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

    const paymentRequest = await requestTransactionDuitKu(transactionData);
    const payment = new Payment();
    payment.userId = user.userId;
    payment.transactionCode = transactionCode;
    payment.paymentMethod = paymentData.paymentMethod.toUpperCase();
    payment.amountCreditPrice = paymentData.amountCreditPrice;
    payment.orderDescription = orderDescription;
    payment.itemDetails = transactionData.itemDetails;
    payment.referenceDuitKuId = paymentRequest.reference;
    payment.credits = paymentData.credits;
    payment.status = paymentRequest.statusCode;
    payment.statusMessage = paymentRequest.statusMessage;
    payment.grandtotal = grandtotalPayment;

    const validateData = await validation(payment);
    if (validateData.length > 0) return validateData;

    const storePayment = await PaymentRepository.storePayment(payment);
    if (!storePayment) throw new Error("Store payment data error");
    return paymentRequest;
};

export const updateStatusPayment = async (updateStatusPayment: {
    reference: string;
    resultCode: string;
}): Promise<UpdateResult> => {
    // TO-DO
    // sebelum simpen payment status cek dulu referenceDuitKuId nya ada apa enggak di DB
    // kalo gak ada keluarin error
    const paymentUpdate = new Payment();
    paymentUpdate.referenceDuitKuId = updateStatusPayment.reference;
    const checkStatus = checkStatusCode(updateStatusPayment.resultCode);
    if (checkStatus === "ERROR") throw new Error("Status code unidentified");
    paymentUpdate.status = checkStatus;
    paymentUpdate.statusMessage = setStatusMessageRedirect(checkStatus);

    // TO-DO
    // kalau berhasil bayar tambahin ke credits table

    return await PaymentRepository.updateStatusPayment(paymentUpdate);
};
