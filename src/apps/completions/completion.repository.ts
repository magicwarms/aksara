import { getConnection, getRepository } from 'typeorm';
import { Completion } from './entity/Completion';
/**
 * Repository Methods
 */

export const getAllCompletion = async (userId: string): Promise<Completion[]> => {
    return await getRepository(Completion).find({
        where: { userId },
        cache: {
            id: `usercompletion-${userId}`,
            milliseconds: 300000
        }
    });
};

export const storeCompletion = async (completionData: Completion): Promise<Completion> => {
    getConnection().queryResultCache?.remove([`usercompletion-${completionData.userId}`]);
    const storeCompletionUser = await getConnection().transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.getRepository(Completion).save(completionData);
    });
    return storeCompletionUser;
};
