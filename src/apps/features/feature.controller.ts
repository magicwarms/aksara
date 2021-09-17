import { NextFunction, Request, Response } from "express";

import logger from "../../config/logger";
import * as FeatureService from "./feature.service";
import { queryFindFeatureData } from "./feature.interface";

export const getAllFeature = async (
    req: Request<{}, {}, {}, queryFindFeatureData>,
    res: Response,
    _next: NextFunction
) => {
    const isActive = req.query.isActive;
    const featuresData = await FeatureService.getAllFeature(isActive);
    return res.status(200).json({
        success: true,
        data: featuresData,
        message: "Features data found",
    });
};

export const storeOrUpdateFeature = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const featureId: string = req.body.id;
        const status: string = featureId ? "updated" : "saved";
        const storeOrUpdateFeature = await FeatureService.storeOrUpdateFeature(req.body);
        if (storeOrUpdateFeature instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storeOrUpdateFeature,
                message: `Validation error`,
            });
        }
        return res.status(200).json({
            success: true,
            data: storeOrUpdateFeature,
            message: `Feature data successfully ${status}`,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteFeature = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const featureId = req.body.id;
        if (!featureId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `Feature ID is required`,
            });
        }
        const deleteFeature = await FeatureService.deleteFeature(featureId);
        if (!deleteFeature.affected) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "Feature data not successfully deleted",
            });
        }
        return res.status(200).json({
            success: true,
            data: null,
            message: "Feature data successfully deleted",
        });
    } catch (err) {
        next(err);
    }
};
