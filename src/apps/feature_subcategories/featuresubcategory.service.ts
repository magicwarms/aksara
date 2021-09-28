/**
 * Data Model Interfaces
 */
import { ValidationError } from 'class-validator';
import isEmpty from 'lodash/isEmpty';
import { UpdateResult } from 'typeorm';

import validation from '../../config/validation';
import { normalizeKey } from '../../utilities/helper';

import { FeatureSubCategory } from './entity/FeatureSubCategory';
import * as FeatureSubCategoryRepository from './featuresubcategory.repository';
import * as FeatureCategoryRepository from '../feature_categories/featurecategory.repository';
/**
 * Service Methods
 */
export const getAllFeatureSubCategories = async (
    isActive: boolean | null,
    featureId: string
): Promise<FeatureSubCategory[]> => {
    let getAllFeatureSubCategory = await FeatureSubCategoryRepository.getAllFeatureSubCategory(isActive, featureId);
    if (getAllFeatureSubCategory.length < 0) getAllFeatureSubCategory = [];
    return getAllFeatureSubCategory;
};

export const storeOrUpdateFeatureSubCategory = async (
    featureSubCategoryData: FeatureSubCategory
): Promise<FeatureSubCategory | ValidationError[] | string> => {
    const featureSubCategory = new FeatureSubCategory();

    const getFeatureCategoryData = await FeatureCategoryRepository.getFeatureCategory(
        featureSubCategoryData.featureCategoryId
    );
    if (isEmpty(getFeatureCategoryData)) return "Feature category data can't empty";

    featureSubCategory.id = isEmpty(featureSubCategoryData.id) ? undefined : featureSubCategoryData.id;
    featureSubCategory.key = normalizeKey(featureSubCategoryData.name.us);
    featureSubCategory.name = featureSubCategoryData.name;
    featureSubCategory.featureCategoryId = featureSubCategoryData.featureCategoryId;
    featureSubCategory.featureCategoryKey = getFeatureCategoryData?.key ?? '';
    featureSubCategory.isActive = featureSubCategoryData.isActive;

    const validateData = await validation(featureSubCategory);
    if (validateData.length > 0) return validateData;

    const storeOrUpdateFeatureSubCategory = await FeatureSubCategoryRepository.storeOrUpdateFeatureSubCategory(
        featureSubCategory
    );

    return storeOrUpdateFeatureSubCategory;
};

export const deleteFeatureSubCategory = async (id: string): Promise<UpdateResult> => {
    return await FeatureSubCategoryRepository.deleteFeatureSubCategory(id);
};
