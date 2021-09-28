import { getConnection } from 'typeorm';
import { Credit } from './entity/Credit';
import { CreditTransaction } from './entity/CreditTransaction';
/**
 * Repository Methods
 */

export const getCreditUser = async (userId: string): Promise<Credit | undefined> => {
    const getCreditUser = await getConnection().transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager
            .getRepository(Credit)
            .createQueryBuilder('credit')
            .setLock('pessimistic_read')
            .where({ userId })
            .getOne();
    });
    return getCreditUser;
};

export const storeOrUpdateCreditUser = async (data: Credit): Promise<Credit> => {
    const storeOrUpdateCreditUser = await getConnection().transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.getRepository(Credit).save(data);
    });
    return storeOrUpdateCreditUser;
};

export const storeCreditTransaction = async (data: CreditTransaction): Promise<CreditTransaction> => {
    const storeCreditTransaction = await getConnection().transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.getRepository(CreditTransaction).save(data);
    });
    return storeCreditTransaction;
};
