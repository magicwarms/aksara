import { getRepository, UpdateResult } from "typeorm";
import { Feature } from "./entity/Feature";
/**
 * Repository Methods
 */

export const getAllFeature = async (isActive: boolean | null) => {
    const whereQuery = isActive ? { where: { isActive } } : undefined;
    return await getRepository(Feature).find(whereQuery);
};

export const getFeature = async (featureId: string) => {
    return await getRepository(Feature).findOne(featureId);
};

export const storeOrUpdateFeature = async (data: Feature) => {
    return await getRepository(Feature).save(data);
};

export const deleteFeature = async (id: string): Promise<UpdateResult> => {
    return await getRepository(Feature).softDelete(id);
};
