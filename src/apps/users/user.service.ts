/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import isEmpty from "lodash/isEmpty";
import jwt from "jsonwebtoken";

import validation from "../../config/validation";
import { JWT_SECRET } from "../../config/jwtsecret";

import { User } from "./entity/User";
import * as UserRepository from "./user.repository";

import { UserAuthentification } from "./user.inteface";
import { Roles } from "./user.enum";

/**
 * Service Methods
 */
export const getAllUser = async (): Promise<User[]> => {
    let getAllUser = await UserRepository.getAllUser();
    if (getAllUser.length < 0) getAllUser = [];
    return getAllUser;
};

export const getUserProfile = async (id: string): Promise<User | null> => {
    const getUser = await UserRepository.getUserProfile(id);
    return !getUser ? null : getUser;
};

export const updateUserProfile = async (userId: string, userData: User): Promise<User | ValidationError[]> => {
    const user = new User();
    user.id = userId;
    user.firstname = userData.firstname;
    user.lastname = userData.lastname;
    user.country = userData.country;

    const validateData = await validation(user);
    if (validateData.length > 0) return validateData;

    const updateUserProfile = await UserRepository.storeOrUpdateUser(user);

    return updateUserProfile;
};

export const deleteUser = async (id: string) => {
    return await UserRepository.deleteUser(id);
};

export const loginOrRegisterCustomer = async (
    customerData: User
): Promise<User | ValidationError[] | UserAuthentification> => {
    const checkEmailExist = await UserRepository.checkEmailExist(customerData.email);
    let storeUser;
    if (isEmpty(checkEmailExist)) {
        const user = new User();
        user.email = customerData.email;
        user.firstname = customerData.firstname;
        user.lastname = customerData.lastname;
        user.profilePicture = customerData.profilePicture;
        user.country = customerData.country;
        user.role = customerData.role;

        const validateData = await validation(user);
        if (validateData.length > 0) return validateData;

        storeUser = await UserRepository.storeOrUpdateUser(user);
    }
    let userId: string = isEmpty(checkEmailExist) ? storeUser?.id! : checkEmailExist?.id!;
    let roleUser: Roles = isEmpty(checkEmailExist) ? storeUser?.role! : checkEmailExist?.role!;
    const generatedToken: string = jwt.sign(
        {
            id: userId,
            role: roleUser,
        },
        JWT_SECRET,
        { expiresIn: "30 days", algorithm: "HS512" }
    );
    return {
        tokenType: "Bearer",
        expiresIn: "30 days",
        token: generatedToken,
        role: roleUser,
        id: userId,
    };
};
