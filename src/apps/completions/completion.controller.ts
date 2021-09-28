import { NextFunction, Request, Response } from 'express';

import * as CompletionService from './completion.service';

export const getAllCompletion = async (_req: Request, res: Response): Promise<Response> => {
    const userId: string = res.locals.userId;
    const userCompletions = await CompletionService.getAllCompletion(userId);
    return res.status(200).json({
        success: true,
        data: userCompletions,
        message: userCompletions.length > 0 ? 'Completion data found' : 'Completion data not found'
    });
};

export const storeCompletion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const userId: string = res.locals.userId;
        const storeCompletion = await CompletionService.storeCompletion(req.body, userId);
        if (storeCompletion instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storeCompletion,
                message: `Validation error`
            });
        }
        return res.status(200).json({
            success: true,
            data: typeof storeCompletion === 'string' ? {} : storeCompletion,
            message: typeof storeCompletion === 'string' ? storeCompletion : `Completion has been saved`
        });
    } catch (err) {
        next(err);
    }
};
