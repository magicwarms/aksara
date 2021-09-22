/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import isEmpty from "lodash/isEmpty";
import { UpdateResult } from "typeorm";
import crypto from "crypto";

import validation from "../../config/validation";

// import { PaymentMethod } from "./entity/PaymentMethod";
import { Payment } from "./entity/Payment";
import * as PaymentRepository from "./payment.repository";
import { checkStatusCode, currentFormattedDateTime, setNanoId, setStatusMessageCallback } from "../../utilities/helper";
import axios from "axios";
import { responsePayment, responsePaymentStatus, transactionData } from "./payment.interface";
import { Md5 } from "ts-md5/dist/md5";
import paymentConfig from "../../config/payment";
import { StatusCode, StatusMessage } from "./payment.enum";
import { storeOrUpdateCreditUser, storeCreditTransaction, getCreditUser } from "../credits/credit.service";
import { StatusHistory } from "../credits/credit.enum";

/**
 * Service Methods
 */

const getAllPaymentMethodDuitku = async (amount: number) => {
    const endpoint: string = paymentConfig.endpointGetPaymentMethodUrl;
    const datetime = currentFormattedDateTime();
    const hashString = `${paymentConfig.merchantCode}${Number(amount)}${datetime}${paymentConfig.merchantKey}`;
    const getPaymentMethodDuitku = await axios({
        url: endpoint,
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            merchantcode: paymentConfig.merchantCode,
            amount: Number(amount),
            datetime,
            signature: crypto.createHash("sha256").update(hashString, "utf-8").digest("hex"),
        },
    });

    if (getPaymentMethodDuitku.status !== 200) throw new Error("get all payment method error");
    return getPaymentMethodDuitku.data;
};

export const getAllPaymentMethod = async (amount: number): Promise<any | Error> => {
    let getAllPaymentMethod = await getAllPaymentMethodDuitku(amount);
    if (getAllPaymentMethod.length < 0) getAllPaymentMethod = [];
    return getAllPaymentMethod;
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

    const grandtotalPayment = Number(paymentData.amountCreditPrice);
    const orderDescription = `Payment for purchase ${paymentData.credits} credits`;
    const fullnameSplit = user.userFullname.split(" ");

    const transactionData: transactionData = {
        merchantCode: merchantCodeData,
        paymentAmount: grandtotalPayment,
        merchantOrderId: transactionCode,
        productDetails: orderDescription,
        email: user.userEmail,
        paymentMethod: paymentData.payment.paymentMethod,
        customerVaName: user.userFullname,
        itemDetails: [
            {
                name: orderDescription,
                quantity: Number(paymentData.credits),
                price: grandtotalPayment,
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
        expiryPeriod: 60, // in minutes
    };

    const paymentRequest = await requestTransactionDuitKu(transactionData);

    const payment = new Payment();
    payment.userId = user.userId;
    payment.transactionCode = transactionCode;
    payment.payment = {
        paymentMethod: paymentData.payment.paymentMethod,
        paymentName: paymentData.payment.paymentName,
    };
    payment.amountCreditPrice = paymentData.amountCreditPrice;
    payment.orderDescription = orderDescription;
    payment.itemDetails = transactionData.itemDetails;
    payment.referenceDuitKuId = paymentRequest.reference;
    payment.credits = paymentData.credits;
    payment.status = StatusCode.FAILED_PENDING;
    payment.statusMessage = StatusMessage.FAILED_PENDING;
    payment.fee = paymentData.fee;
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
    if (checkReferenceId?.status === "00") throw new Error("This transaction has been successfully completed");

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
            //get credit user first
            const getCredit = await getCreditUser(checkReferenceId?.userId!);
            const setCreditUser = await storeOrUpdateCreditUser({
                userId: checkReferenceId?.userId!,
                credit: Number(checkReferenceId?.credits!) + Number(getCredit?.credit),
            });
            if (setCreditUser) {
                const storeCreditTrx = {
                    userId: checkReferenceId?.userId!,
                    usage: 0,
                    completionId: null,
                    remainingCredits: checkReferenceId?.credits!,
                    status: StatusHistory.ADDED,
                };
                storeCreditTransaction(storeCreditTrx);
            }
            // TO-DO
            // kirim notifikasi nanti disini wak
        }
    }

    return updateStatusPaymentData;
};

export const checkTransaction = async (transactionCode: string): Promise<responsePaymentStatus> => {
    const merchantCodeData: string = paymentConfig.merchantCode;
    const merchantKeyData: string = paymentConfig.merchantKey;

    const data = {
        merchantCode: merchantCodeData,
        merchantOrderId: transactionCode,
        signature: Md5.hashStr(`${merchantCodeData}${transactionCode}${merchantKeyData}`),
    };
    const checkStatusPayment = await checkTransactionDuitKu(data);
    await updateStatusPayment({ reference: checkStatusPayment.reference, resultCode: checkStatusPayment.statusCode });
    return checkStatusPayment;
};
