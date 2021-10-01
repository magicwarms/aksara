/**
 * Data Model Interfaces
 */
import { ValidationError } from 'class-validator';
import isEmpty from 'lodash/isEmpty';
import jwt from 'jsonwebtoken';

import validation from '../../config/validation';
import { JWT_SECRET } from '../../config/jwtsecret';

import { User } from './entity/User';
import * as UserRepository from './user.repository';
import { storeOrUpdateCreditUser } from '../credits/credit.service';

import { UserAuthentification } from './user.inteface';
import { Roles } from './user.enum';
import { UpdateResult } from 'typeorm';

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

export const deleteUser = async (id: string): Promise<UpdateResult> => {
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
        const userId = storeUser?.id ?? '';
        if (isEmpty(userId)) throw new Error("User ID can't empty");
        // initiate credit user
        storeOrUpdateCreditUser({ userId, credit: 0 });
    }
    const userId: string | undefined = isEmpty(checkEmailExist) ? storeUser?.id : checkEmailExist?.id;
    const email: string | undefined = isEmpty(checkEmailExist) ? storeUser?.email : checkEmailExist?.email;
    const roleUser: Roles | undefined = isEmpty(checkEmailExist) ? storeUser?.role : checkEmailExist?.role;

    const fullname: string = isEmpty(checkEmailExist)
        ? `${storeUser?.firstname} ${storeUser?.lastname}`
        : `${checkEmailExist?.firstname} ${checkEmailExist?.lastname}`;

    const generatedToken: string = jwt.sign(
        {
            id: userId,
            email,
            role: roleUser,
            fullname
        },
        JWT_SECRET,
        { expiresIn: '30 days', algorithm: 'HS512' }
    );
    return {
        tokenType: 'Bearer',
        expiresIn: '30 days',
        token: generatedToken,
        role: roleUser as Roles,
        id: userId,
        email
    };
};

export const logoutUser = async (userId: string): Promise<void> => {
    return await UserRepository.logoutUser(userId);
};
