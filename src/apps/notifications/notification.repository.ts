import { getRepository, UpdateResult } from 'typeorm';
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

export const deleteNotification = async (id: string): Promise<UpdateResult> => {
    return await getRepository(Notifications).softDelete(id);
};
