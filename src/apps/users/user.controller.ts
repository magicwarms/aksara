import { NextFunction, Request, Response } from "express";

import logger from "../../config/logger";
import * as UserService from "./user.service";

export const findAllUser = async (_req: Request, res: Response) => {
    // console.log(res.locals);
    const users = await UserService.findAllUser();
    return res.status(200).json({
        success: true,
        data: users,
        message: "Users data found",
    });
};

export const findUser = async (req: Request, res: Response) => {
    const userId = String(req.query.id);
    if (userId === null) {
        return res.status(422).json({
            success: false,
            data: null,
            message: "User ID is required",
        });
    }
    const findUser = await UserService.findUser(userId);
    return res.status(200).json({
        success: true,
        data: findUser,
        message: !findUser ? "User data not found" : "User data found",
    });
};

// export const updateOrStoreUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userId = req.body.id;
//         let status = !userId ? "saved" : "updated";
//         const updateOrStoreUser = await UserService.updateOrStoreUser(req.body);
//         if (updateOrStoreUser instanceof Array) {
//             return res.status(422).json({
//                 success: false,
//                 data: updateOrStoreUser,
//                 message: `Validation error`,
//             });
//         }
//         return res.status(200).json({
//             success: true,
//             data: updateOrStoreUser,
//             message: `User data successfully ${status}`,
//         });
//     } catch (err) {
//         logger.error(err);
//         next(err);
//     }
// };

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
