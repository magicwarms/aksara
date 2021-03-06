import { getRepository, UpdateResult } from 'typeorm';
import { FeatureCategory } from './entity/FeatureCategory';
/**
 * Repository Methods
 */

export const getAllFeatureCategory = async (
    isActive: boolean | null,
    featureId: string
): Promise<FeatureCategory[]> => {
    const whereQuery = isActive
        ? { where: { isActive, featureId } }
        : { where: { featureId }, relations: ['feature_subcategories'] };
    return await getRepository(FeatureCategory).find(whereQuery);
};

export const getFeatureCategory = async (featureCategoryId: string): Promise<FeatureCategory | undefined> => {
    return await getRepository(FeatureCategory).findOne(featureCategoryId);
};

export const storeOrUpdateFeatureCategory = async (data: FeatureCategory): Promise<FeatureCategory> => {
    return await getRepository(FeatureCategory).save(data);
};

export const deleteFeatureCategory = async (id: string): Promise<UpdateResult> => {
    return await getRepository(FeatureCategory).softDelete(id);
};
