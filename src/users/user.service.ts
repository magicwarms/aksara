/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import validation from "../config/validation";
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

export const updateOrStoreUser = async (userData: User): Promise<User | ValidationError[]> => {
    const user = new User();
    user.id = userData.id !== "" ? userData.id : undefined;
    user.email = userData.email;
    user.firstname = userData.firstname;
    user.lastname = userData.lastname;
    user.profilePicture = userData.profilePicture;
    user.country = userData.country;

    const validateData = await validation(user);
    if (validateData.length > 0) return validateData;

    const updateOrStoreUser = await UserRepository.updateOrStoreUser(user);

    return updateOrStoreUser;
};

export const deleteUser = async (id: string): Promise<any> => {
    return await UserRepository.deleteUser(id);
};
