/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import isEmpty from "lodash/isEmpty";
import { UpdateResult } from "typeorm";

import validation from "../../config/validation";

import { PaymentMethod } from "./entity/PaymentMethod";
import * as PaymentRepository from "./payment.repository";

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
