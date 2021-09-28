import { getConnection, getRepository, UpdateResult } from "typeorm";
import { User } from "./entity/User";

const cacheDuration = 300000;
/**
 * Repository Methods
 */

export const getAllUser = async () => {
    return await getRepository(User).find({
        cache: {
            id: `alluser`,
            milliseconds: cacheDuration,
        },
    });
};

export const getUserProfile = async (id: string) => {
    return await getRepository(User).findOne({
        where: { id },
        cache: {
            id: `user-${id}`,
            milliseconds: cacheDuration,
        },
    });
};

export const storeOrUpdateUser = async (user: User): Promise<User> => {
    if (user.id !== "" || typeof user.id !== undefined) getConnection().queryResultCache?.remove([`user-${user.id}`]);

    const storeUser = await getConnection().transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.getRepository(User).save(user);
    });
    return storeUser;
};

export const deleteUser = async (id: string): Promise<UpdateResult> => {
    return await getRepository(User).softDelete(id);
};

export const checkEmailExist = async (email: string) => {
    return await getRepository(User).findOne({
        where: { email },
    });
};

export const logoutUser = async (userId: string) => {
    return await getConnection().queryResultCache?.remove([`user-${userId}`]);
};
