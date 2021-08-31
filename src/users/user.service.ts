/**
 * Data Model Interfaces
 */
import bcrypt from "bcrypt";

import logger from "../config/logger";
import { User } from "./entity/User";
import * as UserRepository from "./user.repository";

/**
 * Service Methods
 */

export const findAllUser = async (): Promise<User[]> => {
    let getAllUser = await UserRepository.findAllUser();
    if (getAllUser.length < 0) getAllUser = [];
    return getAllUser;
};
export const findUser = async (id: string): Promise<User | null> => {
    const getUser = await UserRepository.findUser(id);
    return !getUser ? null : getUser;
};
export const updateOrStoreUser = async (userData: any): Promise<User | Error> => {
    const newUser: User = {
        id: userData.id === "" ? undefined : userData.id,
        email: userData.email,
        password: userData.password,
    };
    const updateOrStoreUser = await UserRepository.updateOrStoreUser(newUser);

    if (typeof newUser.id === "undefined") {
        bcrypt.hash(newUser.password, 12, async function (err: any, hash: string) {
            if (err) logger.error({ message: err });
            newUser.password = hash;
            newUser.id = updateOrStoreUser.id;
            const updatePassword = await UserRepository.changePasswordUser(newUser);
            if (!updatePassword) throw new Error("Store hash password error");
        });
    }
    return updateOrStoreUser;
};
export const deleteUser = async (id: string): Promise<any> => {
    return await UserRepository.deleteUser(id);
};

export const changePasswordUser = async (id: string, password: string): Promise<any> => {
    const hash = bcrypt.hashSync(password, 12);
    const updatePassword = await UserRepository.changePasswordUser({ id, password, hash });
    if (!updatePassword) throw new Error("Store hash password error");
    return updatePassword;
};
