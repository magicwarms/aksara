/**
 * Data Model Interfaces
 */

import validation from "../../config/validation";

import * as CreditRepository from "./credit.repository";
import { Credit } from "./entity/Credit";

/**
 * Service Methods
 */
export const getCreditUser = async (userId: string): Promise<Credit | undefined> => {
    return await CreditRepository.getCreditUser(userId);
};

export const storeOrUpdateCreditUser = async (data: Credit) => {
    const credit = new Credit();
    credit.userId = data.userId;
    credit.credit = data.credit;

    const validateData = await validation(credit);
    if (validateData.length > 0) return validateData;

    return await CreditRepository.storeOrUpdateCreditUser(credit);
};
