import { NextFunction, Request, Response } from 'express';
import { queryFindNotificationData } from './notification.interface';

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

export const deleteNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const notificationId = req.body.id;
        if (!notificationId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `Notification ID is required`
            });
        }
        const deleteNotification = await NotificationService.deleteNotification(notificationId);
        if (!deleteNotification.affected) {
            return res.status(200).json({
                success: true,
                data: null,
                message: 'Notification data not successfully deleted'
            });
        }
        return res.status(200).json({
            success: true,
            data: null,
            message: 'Notification data successfully deleted'
        });
    } catch (err) {
        next(err);
    }
};

export const updateReadNotification = async (
    req: Request<unknown, unknown, unknown, queryFindNotificationData>,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const notificationId: string = req.query.id;
        const isRead: boolean = req.query.isRead;
        const updateReadNotification = await NotificationService.updateReadNotification({ notificationId, isRead });
        if (updateReadNotification instanceof Array) {
            return res.status(422).json({
                success: false,
                data: updateReadNotification,
                message: `Validation error`
            });
        }
        return res.status(200).json({
            success: true,
            data: updateReadNotification,
            message: `Notification data has been successfully updated`
        });
    } catch (err) {
        next(err);
    }
};
