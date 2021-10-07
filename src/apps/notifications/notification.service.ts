/**
 * Data Model Interfaces
 */
import { ValidationError } from 'class-validator';
import isEmpty from 'lodash/isEmpty';

import validation from '../../config/validation';

import { Notifications } from './entity/Notifications';
import * as NotificationRepository from './notification.repository';

/**
 * Service Methods
 */
export const getAllNotification = async (userId: string): Promise<Notifications[]> => {
    let getAllNotification = await NotificationRepository.getAllNotification(userId);
    if (getAllNotification.length < 0) getAllNotification = [];
    return getAllNotification;
};

export const storeOrUpdateNotification = async (
    notificationData: Notifications
): Promise<Notifications | ValidationError[]> => {
    const notification = new Notifications();
    notification.id = isEmpty(notificationData.id) ? undefined : notificationData.id;
    notification.userId = notificationData.userId;
    notification.isRead = notificationData.isRead;
    notification.message = notificationData.message;

    const validateData = await validation(notification);
    if (validateData.length > 0) return validateData;

    return await NotificationRepository.storeOrUpdateNotification(notification);
};
