/**
 * Data Model Interfaces
 */

import { ValidationError } from 'class-validator';
import { isEmpty } from 'lodash';
import validation from '../../config/validation';

import * as CreditRepository from './credit.repository';
import { Credit } from './entity/Credit';
import { CreditTransaction } from './entity/CreditTransaction';

/**
 * Service Methods
 */
export const getCreditUser = async (userId: string): Promise<Credit | undefined> => {
    const getCreditUserData = await CreditRepository.getCreditUser(userId);
    if (isEmpty(getCreditUserData)) throw new Error("Credit user can't empty");
    return getCreditUserData;
};

export const storeOrUpdateCreditUser = async (data: Credit): Promise<Credit | ValidationError[]> => {
    const credit = new Credit();
    credit.userId = data.userId;
    credit.credit = data.credit;

    const validateData = await validation(credit);
    if (validateData.length > 0) return validateData;

    return await CreditRepository.storeOrUpdateCreditUser(credit);
};

export const storeCreditTransaction = async (
    data: CreditTransaction
): Promise<CreditTransaction | ValidationError[]> => {
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
