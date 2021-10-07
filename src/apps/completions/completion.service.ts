/**
 * Data Model Interfaces
 */
import { ValidationError } from 'class-validator';

import validation from '../../config/validation';

import { Completion } from './entity/Completion';
import * as CompletionRepository from './completion.repository';
import { getCreditUser, storeCreditTransaction, storeOrUpdateCreditUser } from '../credits/credit.service';
import { StatusHistory } from '../credits/credit.enum';
import { storeNotification } from '../notifications/notification.service';

/**
 * Service Methods
 */
export const getAllCompletion = async (userId: string): Promise<Completion[]> => {
    let getAllCompletion: Completion[] = await CompletionRepository.getAllCompletion(userId);
    if (getAllCompletion.length < 0) return [];
    getAllCompletion = getAllCompletion.map((item) => {
        return {
            ...item,
            count: Number(item.count),
            tokenUsage: Number(item.tokenUsage)
        };
    });
    return getAllCompletion;
};

export const storeCompletion = async (
    completionData: Completion,
    userId: string
): Promise<Completion | ValidationError[] | string> => {
    //get credit user first
    const getUserCredit = await getCreditUser(userId);
    if (!getUserCredit) return 'Something went wrong! user credit not found';
    const userCredit = getUserCredit?.credit;
    const tokenUsage = Number(completionData.tokenUsage);
    if (userCredit < tokenUsage) return "You don't have enough tokens";

    const completion = new Completion();
    completion.prompt = completionData.prompt;
    completion.language = completionData.language;
    completion.results = completionData.results;
    completion.userId = userId;
    completion.feature = completionData.feature;
    completion.tones = completionData.tones;
    completion.from = completionData.from;
    completion.to = completionData.to;
    completion.theme = completionData.theme;
    completion.brief = completionData.brief;
    completion.count = Number(completionData.count);
    completion.tokenUsage = tokenUsage;

    const validateData = await validation(completion);
    if (validateData.length > 0) return validateData;

    const storeCompletion = await CompletionRepository.storeCompletion(completion);
    if (storeCompletion) {
        // kurangin credit disini
        const remainingCredits: number = userCredit - tokenUsage;
        const storeCreditTrx = {
            userId: userId,
            usage: tokenUsage,
            completionId: storeCompletion.id,
            remainingCredits,
            status: StatusHistory.USED
        };
        Promise.all([
            storeCreditTransaction(storeCreditTrx),
            storeOrUpdateCreditUser({ userId, credit: remainingCredits }),
            storeNotification({
                userId,
                message: `You have used your credit of ${tokenUsage} in this prompt ${storeCompletion.prompt} on ${storeCompletion.createdDate}`,
                isRead: false
            })
        ]);
    }
    return storeCompletion;
};
