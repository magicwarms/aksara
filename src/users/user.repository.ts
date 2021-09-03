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

export const updateOrStoreUser = async (user: User): Promise<User> => {
    const savedData = await getConnection().transaction(async (transactionalEntityManager) => {
        if (user.id !== "") getConnection().queryResultCache?.remove([`user-${user.id}`]);
        return await transactionalEntityManager.getRepository(User).save(user);
    });
    return savedData;
};

export const deleteUser = async (id: string) => {
    return await getRepository(User).softDelete(id);
};
