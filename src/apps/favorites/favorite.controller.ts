import { NextFunction, Request, Response } from "express";

import * as FavoriteService from "./favorite.service";

export const getAllFavorite = async (_req: Request, res: Response, _next: NextFunction) => {
    const userId: string = res.locals.userId;
    const favoriteData = await FavoriteService.getAllFavorite(userId);
    return res.status(200).json({
        success: true,
        data: favoriteData,
        message: favoriteData.length > 0 ? "Favorite data found" : "Favorite data not found",
    });
};

export const storeOrUpdateFavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string = res.locals.userId;
        const favoriteId: string = req.body.id;
        const status: string = favoriteId ? "updated" : "saved";
        const storeOrUpdateFavorite = await FavoriteService.storeOrUpdateFavorite(req.body, userId);
        if (storeOrUpdateFavorite instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storeOrUpdateFavorite,
                message: `Validation error`,
            });
        }
        return res.status(200).json({
            success: true,
            data: storeOrUpdateFavorite,
            message: `Favorite data has been ${status}`,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteFavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const favoriteId = req.body.id;
        const userId = res.locals.userId;
        if (!favoriteId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `Favorite ID is required`,
            });
        }
        const deleteFavorite = await FavoriteService.deleteFavorite(favoriteId, userId);
        if (!deleteFavorite.affected) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "Favorite data has not successfully deleted",
            });
        }
        return res.status(200).json({
            success: true,
            data: null,
            message: "Favorite data has been deleted",
        });
    } catch (err) {
        next(err);
    }
};
