/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import isEmpty from "lodash/isEmpty";
import { UpdateResult } from "typeorm";

import validation from "../../config/validation";

import { FeatureCategory } from "./entity/FeatureCategory";
import * as FeatureCategoryRepository from "./featurecategory.repository";

/**
 * Service Methods
 */
export const getAllFeatureCategories = async (
    isActive: boolean | null,
    featureId: string
): Promise<FeatureCategory[]> => {
    let getAllFeatureCategory = await FeatureCategoryRepository.getAllFeatureCategory(isActive, featureId);
    if (getAllFeatureCategory.length < 0) getAllFeatureCategory = [];
    return getAllFeatureCategory;
};

export const storeOrUpdateFeatureCategory = async (
    FeatureCategoryData: FeatureCategory
): Promise<FeatureCategory | ValidationError[]> => {
    const featureCategory = new FeatureCategory();
    const normalizeKey: string = FeatureCategoryData.name.replace(/ /g, "_");
    featureCategory.id = isEmpty(FeatureCategoryData.id) ? undefined : FeatureCategoryData.id;
    featureCategory.key = normalizeKey.toLowerCase();
    featureCategory.name = FeatureCategoryData.name;
    featureCategory.featureId = FeatureCategoryData.featureId;
    featureCategory.isActive = FeatureCategoryData.isActive;

    const validateData = await validation(featureCategory);
    if (validateData.length > 0) return validateData;

    const storeOrUpdateFeatureCategory = await FeatureCategoryRepository.storeOrUpdateFeatureCategory(featureCategory);

    return storeOrUpdateFeatureCategory;
};

export const deleteFeatureCategory = async (id: string): Promise<UpdateResult> => {
    return await FeatureCategoryRepository.deleteFeatureCategory(id);
};
