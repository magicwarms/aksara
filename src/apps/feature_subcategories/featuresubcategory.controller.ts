import { NextFunction, Request, Response } from "express";

import * as FeatureSubCategoryService from "./featuresubcategory.service";
import { queryFindFeatureSubCategoryData } from "./featuresubcategory.interface";
import { isEmpty } from "lodash";

export const getAllFeatureSubCategories = async (
    req: Request<{}, {}, {}, queryFindFeatureSubCategoryData>,
    res: Response,
    _next: NextFunction
) => {
    const isActive = req.query.isActive;
    const featureCategoryId = req.query.featureCategoryId;
    if (isEmpty(featureCategoryId)) {
        return res.status(422).json({
            success: false,
            data: null,
            message: `Feature ID is required`,
        });
    }
    const featureCategoriesData = await FeatureSubCategoryService.getAllFeatureSubCategories(
        isActive,
        featureCategoryId
    );
    return res.status(200).json({
        success: true,
        data: featureCategoriesData,
        message: "Features subcategories data found",
    });
};

export const storeOrUpdateFeatureSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const featureCategoryId: string = req.body.id;
        const status: string = featureCategoryId ? "updated" : "saved";
        const storeOrUpdateFeatureSubCategory = await FeatureSubCategoryService.storeOrUpdateFeatureSubCategory(
            req.body
        );
        if (storeOrUpdateFeatureSubCategory instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storeOrUpdateFeatureSubCategory,
                message: `Validation error`,
            });
        }
        return res.status(200).json({
            success: true,
            data: storeOrUpdateFeatureSubCategory,
            message: `Feature subcategory data successfully ${status}`,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteFeatureSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const featureCategoryId = req.body.id;
        if (!featureCategoryId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `Feature subcategory ID is required`,
            });
        }
        const deleteFeatureSubCategory = await FeatureSubCategoryService.deleteFeatureSubCategory(featureCategoryId);
        if (!deleteFeatureSubCategory.affected) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "Feature subcategory data not successfully deleted",
            });
        }
        return res.status(200).json({
            success: true,
            data: null,
            message: "Feature subcategory data successfully deleted",
        });
    } catch (err) {
        next(err);
    }
};
