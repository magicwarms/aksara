import { NextFunction, Request, Response } from "express";

import logger from "../../config/logger";
import * as UserService from "./user.service";

export const getAllUser = async (_req: Request, res: Response) => {
    const users = await UserService.getAllUser();
    return res.status(200).json({
        success: true,
        data: users,
        message: "Users data found",
    });
};

export const getUserProfile = async (_req: Request, res: Response) => {
    const userId = String(res.locals.userId);
    const getProfile = await UserService.getUserProfile(userId);
    return res.status(200).json({
        success: true,
        data: getProfile,
        message: !getProfile ? "User data not found" : "User data found",
    });
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.userId;
        const updateUserProfile = await UserService.updateUserProfile(userId, req.body);
        if (updateUserProfile instanceof Array) {
            return res.status(422).json({
                success: false,
                data: updateUserProfile,
                message: `Validation error`,
            });
        }
        return res.status(200).json({
            success: true,
            data: updateUserProfile,
            message: `User data successfully updated`,
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.id;
        if (!userId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `User ID is required`,
            });
        }
        const deleteUser = await UserService.deleteUser(userId);
        if (!deleteUser.affected) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "User data not successfully deleted",
            });
        }
        return res.status(200).json({
            success: true,
            data: null,
            message: "User data successfully deleted",
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const loginOrRegisterCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginOrRegisterCustomer = await UserService.loginOrRegisterCustomer(req.body);
        if (loginOrRegisterCustomer instanceof Array) {
            return res.status(422).json({
                success: false,
                data: loginOrRegisterCustomer,
                message: `Validation error`,
            });
        }
        return res.status(200).json({
            success: true,
            data: loginOrRegisterCustomer,
            message: `User authenticated`,
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};
