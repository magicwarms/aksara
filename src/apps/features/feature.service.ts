/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import isEmpty from "lodash/isEmpty";
import { UpdateResult } from "typeorm";

import validation from "../../config/validation";

import { Feature } from "./entity/Feature";
import * as FeatureRepository from "./feature.repository";

/**
 * Service Methods
 */
export const getAllFeature = async (isActive: boolean | null): Promise<Feature[]> => {
    let getAllFeature = await FeatureRepository.getAllFeature(isActive);
    if (getAllFeature.length < 0) getAllFeature = [];
    return getAllFeature;
};

export const storeOrUpdateFeature = async (featureData: Feature): Promise<Feature | ValidationError[]> => {
    const feature = new Feature();
    const normalizeKey: string = featureData.name.replace(/ /g, "_");
    feature.id = isEmpty(featureData.id) ? undefined : featureData.id;
    feature.key = normalizeKey.toLowerCase();
    feature.name = featureData.name;
    feature.isActive = featureData.isActive;

    const validateData = await validation(feature);
    if (validateData.length > 0) return validateData;

    const storeOrUpdateFeature = await FeatureRepository.storeOrUpdateFeature(feature);

    return storeOrUpdateFeature;
};

export const deleteFeature = async (id: string): Promise<UpdateResult> => {
    return await FeatureRepository.deleteFeature(id);
};
