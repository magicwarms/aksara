import { getConnection, getRepository } from "typeorm";
import { Completion } from "./entity/Completion";
/**
 * Repository Methods
 */

export const getAllCompletion = async (userId: string) => {
    return await getRepository(Completion).find({ where: { userId } });
};

export const storeCompletion = async (completionData: Completion): Promise<Completion> => {
    const storeCompletionUser = await getConnection().transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.getRepository(Completion).save(completionData);
    });
    return storeCompletionUser;
};
