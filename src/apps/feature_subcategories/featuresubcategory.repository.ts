import { getRepository, UpdateResult } from 'typeorm';
import { FeatureSubCategory } from './entity/FeatureSubCategory';
/**
 * Repository Methods
 */

export const getAllFeatureSubCategory = async (
    isActive: boolean | null,
    featureCategoryId: string
): Promise<FeatureSubCategory[]> => {
    const whereQuery = isActive ? { where: { isActive, featureCategoryId } } : { where: { featureCategoryId } };
    return await getRepository(FeatureSubCategory).find(whereQuery);
};

export const storeOrUpdateFeatureSubCategory = async (data: FeatureSubCategory): Promise<FeatureSubCategory> => {
    return await getRepository(FeatureSubCategory).save(data);
};

export const deleteFeatureSubCategory = async (id: string): Promise<UpdateResult> => {
    return await getRepository(FeatureSubCategory).softDelete(id);
};
