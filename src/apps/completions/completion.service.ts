/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";

import validation from "../../config/validation";

import { Completion } from "./entity/Completion";
import * as CompletionRepository from "./completion.repository";

/**
 * Service Methods
 */
export const getAllCompletion = async (userId: string): Promise<Completion[]> => {
    let getAllCompletion = await CompletionRepository.getAllCompletion(userId);
    if (getAllCompletion.length < 0) getAllCompletion = [];
    return getAllCompletion;
};

export const storeCompletion = async (completionData: Completion): Promise<Completion | ValidationError[]> => {
    const completion = new Completion();
    completion.prompt = completionData.prompt;
    completion.language = completionData.language;
    completion.results = completionData.results;
    completion.userId = completionData.userId;
    completion.feature = completionData.feature;
    completion.tones = completionData.tones;
    completion.from = completionData.from;
    completion.to = completionData.to;
    completion.theme = completionData.theme;
    completion.brief = completionData.brief;
    completion.count = completionData.count;
    completion.tokenUsage = completionData.tokenUsage;

    const validateData = await validation(completion);
    if (validateData.length > 0) return validateData;

    const storeCompletion = await CompletionRepository.storeCompletion(completion);

    return storeCompletion;
};
