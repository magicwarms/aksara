import { getConnection, getRepository } from "typeorm";
import { User } from "./entity/User";
import validation from "../config/validation";

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

export const updateOrStoreUser = async (data: User) => {
    const user = new User();
    user.id = data.id;
    user.email = data.email;
    if (typeof data.id === "undefined") user.password = data.password;
    await validation(user);
    if (data.id !== "") getConnection().queryResultCache?.remove([`user-${data.id}`]);
    return await getRepository(User).save(user);
};

export const changePasswordUser = async (data: any) => {
    const user = new User();
    user.id = data.id;
    user.password = data.password;
    await validation(user);
    user.password = data.hash;

    return await getRepository(User).save(user);
};

export const deleteUser = async (id: string) => {
    return await getRepository(User).softDelete(id);
};
