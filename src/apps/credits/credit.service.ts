/**
 * Data Model Interfaces
 */

import validation from "../../config/validation";

import * as CreditRepository from "./credit.repository";
import { Credit } from "./entity/Credit";
import { CreditTransaction } from "./entity/CreditTransaction";

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

export const storeCreditTransaction = async (data: CreditTransaction) => {
    const creditTrx = new CreditTransaction();
    creditTrx.userId = data.userId;
    creditTrx.usage = data.usage;
    creditTrx.completionId = data.completionId ? data.completionId : null;
    creditTrx.remainingCredits = data.remainingCredits;
    creditTrx.status = data.status;

    const validateData = await validation(creditTrx);
    if (validateData.length > 0) return validateData;

    return await CreditRepository.storeCreditTransaction(creditTrx);
};
