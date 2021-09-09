import { NextFunction, Request, Response } from "express";

import logger from "../../config/logger";
import * as ThemeService from "./theme.service";
import { queryIsActiveTheme } from "./theme.interface";

export const getAllTheme = async (req: Request<{}, {}, {}, queryIsActiveTheme>, res: Response, _next: NextFunction) => {
    const isActive = req.query.isActive;
    const themes = await ThemeService.getAllTheme(isActive);
    return res.status(200).json({
        success: true,
        data: themes,
        message: "Themes data found",
    });
};

export const storeOrUpdateTheme = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const themeId: string = req.body.id;
        const status: string = themeId ? "updated" : "saved";
        const storeOrUpdateTheme = await ThemeService.storeOrUpdateTheme(req.body);
        if (storeOrUpdateTheme instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storeOrUpdateTheme,
                message: `Validation error`,
            });
        }
        return res.status(200).json({
            success: true,
            data: storeOrUpdateTheme,
            message: `Theme data successfully ${status}`,
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const deleteTheme = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const themeId = req.body.id;
        if (!themeId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `Theme ID is required`,
            });
        }
        const deleteTheme = await ThemeService.deleteTheme(themeId);
        if (!deleteTheme.affected) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "Theme data not successfully deleted",
            });
        }
        return res.status(200).json({
            success: true,
            data: null,
            message: "Theme data successfully deleted",
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};
