import { getConnection, getRepository } from "typeorm";
import { User } from "./entity/User";

const cacheDuration = 300000;
/**
 * Repository Methods
 */

export const findAllUser = async () => {
    return await getRepository(User).find({ cache: cacheDuration });
};

export const findUser = async (id: String) => {
    return await getRepository(User).findOne({
        where: { id },
        cache: {
            id: `user-${id}`,
            milliseconds: cacheDuration,
        },
    });
};

export const storeUser = async (user: User): Promise<User> => {
    const storeUser = await getConnection().transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.getRepository(User).save(user);
    });
    return storeUser;
};

export const deleteUser = async (id: string) => {
    return await getRepository(User).softDelete(id);
};

export const checkEmailExist = async (email: string) => {
    return await getRepository(User).findOne({
        where: { email },
    });
};
