import { getRepository } from 'typeorm';
import { Notifications } from './entity/Notifications';
/**
 * Repository Methods
 */

export const getAllNotification = async (userId: string): Promise<Notifications[]> => {
    return await getRepository(Notifications).find({
        where: { userId },
        select: ['id', 'userId', 'isRead', 'message', 'createdDate']
    });
};

export const storeOrUpdateNotification = async (data: Notifications): Promise<Notifications> => {
    return await getRepository(Notifications).save(data);
};
