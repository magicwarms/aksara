import { getConnection, getRepository, UpdateResult } from 'typeorm';
import { Favorite } from './entity/Favorite';
/**
 * Repository Methods
 */

export const getAllFavorite = async (userId: string): Promise<Favorite[]> => {
    return await getRepository(Favorite).find({
        where: { userId },
        relations: ['completion'],
        cache: {
            id: `userfavorites-${userId}`,
            milliseconds: 300000
        }
    });
};

export const storeOrUpdateFavorite = async (data: Favorite): Promise<Favorite> => {
    getConnection().queryResultCache?.remove([`userfavorites-${data.userId}`]);
    return await getRepository(Favorite).save(data);
};

export const deleteFavorite = async (id: string, userId: string): Promise<UpdateResult> => {
    getConnection().queryResultCache?.remove([`userfavorites-${userId}`]);
    return await getRepository(Favorite).softDelete(id);
};
