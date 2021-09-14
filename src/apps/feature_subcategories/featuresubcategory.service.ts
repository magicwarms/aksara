/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import isEmpty from "lodash/isEmpty";
import { UpdateResult } from "typeorm";

import validation from "../../config/validation";
import { normalizeKey } from "../../utilities/helper";
import { FeatureCategory } from "../feature_categories/entity/FeatureCategory";

import { FeatureSubCategory } from "./entity/FeatureSubCategory";
import * as FeatureSubCategoryRepository from "./featuresubcategory.repository";
import * as FeatureCategoryRepository from "../feature_categories/featurecategory.repository";
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
): Promise<FeatureSubCategory | ValidationError[]> => {
    const featureSubCategory = new FeatureSubCategory();

    const getSubCategoryData: FeatureCategory | undefined = await FeatureCategoryRepository.getFeatureCategory(
        featureSubCategoryData.featureCategoryId
    );

    featureSubCategory.id = isEmpty(featureSubCategoryData.id) ? undefined : featureSubCategoryData.id;
    featureSubCategory.key = {
        id: normalizeKey(featureSubCategoryData.name.id),
        us: normalizeKey(featureSubCategoryData.name.us),
    };
    featureSubCategory.name = featureSubCategoryData.name;
    featureSubCategory.featureCategoryId = featureSubCategoryData.featureCategoryId;
    featureSubCategory.featureCategoryKey = getSubCategoryData?.key!;
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
