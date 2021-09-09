/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import isEmpty from "lodash/isEmpty";
import { UpdateResult } from "typeorm";

import validation from "../../config/validation";

import { FeatureSubCategory } from "./entity/FeatureSubCategory";
import * as FeatureSubCategoryRepository from "./featuresubcategory.repository";

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
    FeatureSubCategoryData: FeatureSubCategory
): Promise<FeatureSubCategory | ValidationError[]> => {
    const featureSubCategory = new FeatureSubCategory();
    const normalizeKey: string = FeatureSubCategoryData.name.replace(/ /g, "_");
    featureSubCategory.id = isEmpty(FeatureSubCategoryData.id) ? undefined : FeatureSubCategoryData.id;
    featureSubCategory.key = normalizeKey.toLowerCase();
    featureSubCategory.name = FeatureSubCategoryData.name;
    featureSubCategory.featureCategoryId = FeatureSubCategoryData.featureCategoryId;
    featureSubCategory.isActive = FeatureSubCategoryData.isActive;

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
