import { NextFunction, Request, Response } from "express";

import logger from "../../config/logger";
import * as FeatureCategoryService from "./featurecategory.service";
import { queryFindFeatureCategoryData } from "./featurecategory.interface";
import { isEmpty } from "lodash";

export const getAllFeatureCategories = async (
    req: Request<{}, {}, {}, queryFindFeatureCategoryData>,
    res: Response,
    _next: NextFunction
) => {
    const isActive = req.query.isActive;
    const featureId = req.query.featureId;
    if (isEmpty(featureId)) {
        return res.status(422).json({
            success: false,
            data: null,
            message: `Feature ID is required`,
        });
    }
    const featureCategoriesData = await FeatureCategoryService.getAllFeatureCategories(isActive, featureId);
    return res.status(200).json({
        success: true,
        data: featureCategoriesData,
        message: "Features categories data found",
    });
};

export const storeOrUpdateFeatureCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const featureCategoryId: string = req.body.id;
        const status: string = featureCategoryId ? "updated" : "saved";
        const storeOrUpdateFeatureCategory = await FeatureCategoryService.storeOrUpdateFeatureCategory(req.body);
        if (storeOrUpdateFeatureCategory instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storeOrUpdateFeatureCategory,
                message: `Validation error`,
            });
        }
        return res.status(200).json({
            success: true,
            data: storeOrUpdateFeatureCategory,
            message: `Feature category data successfully ${status}`,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteFeatureCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const featureCategoryId = req.body.id;
        if (!featureCategoryId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `Feature category ID is required`,
            });
        }
        const deleteFeatureCategory = await FeatureCategoryService.deleteFeatureCategory(featureCategoryId);
        if (!deleteFeatureCategory.affected) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "Feature category data not successfully deleted",
            });
        }
        return res.status(200).json({
            success: true,
            data: null,
            message: "Feature category data successfully deleted",
        });
    } catch (err) {
        next(err);
    }
};
