import { NextFunction, Request, Response } from "express";

import logger from "../../config/logger";
import * as CompletionService from "./completion.service";

export const getAllCompletion = async (_req: Request, res: Response, _next: NextFunction) => {
    const userId: string = res.locals.userId;
    const userCompletions = await CompletionService.getAllCompletion(userId);
    return res.status(200).json({
        success: true,
        data: userCompletions,
        message: "Completion data found",
    });
};

export const storeCompletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string = res.locals.userId;
        const storeCompletion = await CompletionService.storeCompletion(req.body, userId);
        if (storeCompletion instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storeCompletion,
                message: `Validation error`,
            });
        }
        return res.status(200).json({
            success: true,
            data: storeCompletion,
            message: `Completion successfully saved`,
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};
