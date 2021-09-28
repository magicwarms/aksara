import { Request, Response } from 'express';

import * as CreditService from './credit.service';

export const getCreditUser = async (_req: Request, res: Response): Promise<Response> => {
    const userId = res.locals.userId;
    const tones = await CreditService.getCreditUser(userId);
    return res.status(200).json({
        success: true,
        data: tones,
        message: 'Credit user data found'
    });
};
