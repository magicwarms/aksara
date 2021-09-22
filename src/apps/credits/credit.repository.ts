import { getConnection, getRepository } from "typeorm";
import { Credit } from "./entity/Credit";
import { CreditTransaction } from "./entity/CreditTransaction";
/**
 * Repository Methods
 */

export const getCreditUser = async (userId: string) => {
    return await getRepository(Credit).findOne({ where: { userId } });
};

export const storeOrUpdateCreditUser = async (data: Credit) => {
    const storeOrUpdateCreditUser = await getConnection().transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.getRepository(Credit).save(data);
    });
    return storeOrUpdateCreditUser;
};

export const storeCreditTransaction = async (data: CreditTransaction) => {
    const storeCreditTransaction = await getConnection().transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.getRepository(CreditTransaction).save(data);
    });
    return storeCreditTransaction;
};
