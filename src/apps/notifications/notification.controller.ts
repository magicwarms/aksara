import { Request, Response } from 'express';

import * as NotificationService from './notification.service';

export const getAllNotification = async (_req: Request, res: Response): Promise<Response> => {
    const userId: string = res.locals.userId;
    const getAllNotification = await NotificationService.getAllNotification(userId);
    return res.status(200).json({
        success: true,
        data: getAllNotification,
        message: getAllNotification.length > 0 ? 'Notification data found' : 'Notification data not found'
    });
};
