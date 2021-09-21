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
import { checkStatusCode, setNanoId, setStatusMessageCallback } from "../../utilities/helper";
import axios from "axios";
import { responsePayment, transactionData } from "./payment.interface";
import { Md5 } from "ts-md5/dist/md5";
import paymentConfig from "../../config/payment";
import { StatusCode, StatusMessage } from "./payment.enum";
import { storeOrUpdateCreditUser } from "../credits/credit.service";

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
    const endpoint: string = paymentConfig.endpointRequestTransaction;
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

const checkTransactionDuitKu = async (data: { merchantCode: string; merchantOrderId: string; signature: string }) => {
    const endpoint: string = paymentConfig.endpointCheckTransaction;
    const checkTrxDuitku = await axios({
        url: endpoint,
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        data,
    });
    if (checkTrxDuitku.status !== 200) {
        throw new Error("Check status payment error");
    }
    return checkTrxDuitku.data;
};

export const storePayment = async (
    paymentData: Payment,
    user: { userId: string; userEmail: string; userFullname: string }
): Promise<Payment | ValidationError[] | responsePayment> => {
    const transactionCode = `ORDER-${setNanoId()}`;

    const merchantCodeData: string = paymentConfig.merchantCode;
    const merchantKeyData: string = paymentConfig.merchantKey;

    const returnUrl: string = paymentConfig.returnUrl;
    const callbackUrl: string = paymentConfig.callbackUrl;

    const grandtotalPayment = Number(paymentData.grandtotal);
    const orderDescription = `Payment for purchase ${paymentData.credits} credits`;
    const fullnameSplit = user.userFullname.split(" ");

    const paymentMethodCodeName = paymentData.paymentMethod.name.toUpperCase();
    const getPaymentMethodCodeName = await PaymentRepository.getPaymentPaymentMethodByCodeName(paymentMethodCodeName);
    if (isEmpty(getPaymentMethodCodeName)) throw new Error("Payment code name not found");

    const transactionData: transactionData = {
        merchantCode: merchantCodeData,
        paymentAmount: grandtotalPayment,
        merchantOrderId: transactionCode,
        productDetails: orderDescription,
        email: user.userEmail,
        paymentMethod: getPaymentMethodCodeName!.name,
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
        signature: Md5.hashStr(`${merchantCodeData}${transactionCode}${grandtotalPayment}${merchantKeyData}`),
        expiryPeriod: 1, // in minutes
    };

    const paymentRequest = await requestTransactionDuitKu(transactionData);

    const payment = new Payment();
    payment.userId = user.userId;
    payment.transactionCode = transactionCode;
    payment.paymentMethod = { name: getPaymentMethodCodeName!.name, fullname: getPaymentMethodCodeName!.fullname };
    payment.amountCreditPrice = paymentData.amountCreditPrice;
    payment.orderDescription = orderDescription;
    payment.itemDetails = transactionData.itemDetails;
    payment.referenceDuitKuId = paymentRequest.reference;
    payment.credits = paymentData.credits;
    payment.status = StatusCode.PROCESS;
    payment.statusMessage = StatusMessage.PROCESS;
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
    const checkReferenceId = await PaymentRepository.getPaymentByReferenceId(updateStatusPayment.reference);
    if (isEmpty(checkReferenceId)) throw new Error("Reference code not found");

    const paymentUpdate = new Payment();
    paymentUpdate.referenceDuitKuId = updateStatusPayment.reference;
    const checkStatus = checkStatusCode(updateStatusPayment.resultCode);
    if (checkStatus === "ERROR") throw new Error("Status code unidentified");
    paymentUpdate.status = checkStatus;
    const checkStatusMessage = setStatusMessageCallback(checkStatus);
    if (checkStatusMessage === "ERROR") throw new Error("Status message unidentified");
    paymentUpdate.statusMessage = checkStatusMessage;
    const updateStatusPaymentData = await PaymentRepository.updateStatusPayment(paymentUpdate);

    if (updateStatusPaymentData.affected) {
        if (checkStatus === "00") {
            // TO-DO
            // TEST LAGI INI NANTI
            const setCreditUser = await storeOrUpdateCreditUser({
                userId: checkReferenceId?.userId!,
                credit: checkReferenceId?.credits!,
            });
            if (setCreditUser) {
                //TO-DO
                // simpan transaksi credits disini
            }
        }
    }

    return;
};

export const checkTransaction = async (transactionCode: string): Promise<UpdateResult> => {
    const merchantCodeData: string = paymentConfig.merchantCode;
    const merchantKeyData: string = paymentConfig.merchantKey;

    const data = {
        merchantCode: merchantCodeData,
        merchantOrderId: transactionCode,
        signature: Md5.hashStr(`${merchantCodeData}${transactionCode}${merchantKeyData}`),
    };
    return await checkTransactionDuitKu(data);
};
