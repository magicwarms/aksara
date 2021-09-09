import { NextFunction, Request, Response } from "express";

import logger from "../../config/logger";
import * as FromToService from "./fromto.service";
import { queryIsActiveFromTo } from "./fromto.inteface";

export const getAllFromTo = async (
    req: Request<{}, {}, {}, queryIsActiveFromTo>,
    res: Response,
    _next: NextFunction
) => {
    const isActive = req.query.isActive;
    const tones = await FromToService.getAllFromTo(isActive);
    return res.status(200).json({
        success: true,
        data: tones,
        message: "From & To data found",
    });
};

export const storeOrUpdateFromTo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fromToId: string = req.body.id;
        const status: string = fromToId ? "updated" : "saved";
        const storeOrUpdateFromTo = await FromToService.storeOrUpdateFromTo(req.body);
        if (storeOrUpdateFromTo instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storeOrUpdateFromTo,
                message: `Validation error`,
            });
        }
        return res.status(200).json({
            success: true,
            data: storeOrUpdateFromTo,
            message: `From and To data successfully ${status}`,
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const deleteFromTo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fromToId = req.body.id;
        if (!fromToId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `From and To ID is required`,
            });
        }
        const deleteFromTo = await FromToService.deleteFromTo(fromToId);
        if (!deleteFromTo.affected) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "From and To data not successfully deleted",
            });
        }
        return res.status(200).json({
            success: true,
            data: null,
            message: "Tone data successfully deleted",
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};