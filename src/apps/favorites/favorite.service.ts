/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import isEmpty from "lodash/isEmpty";
import { UpdateResult } from "typeorm";

import validation from "../../config/validation";

import { Favorite } from "./entity/Favorite";
import * as FavoriteRepository from "./favorite.repository";

/**
 * Service Methods
 */
export const getAllFavorite = async (userId: string): Promise<Favorite[]> => {
    let getAllFavorite = await FavoriteRepository.getAllFavorite(userId);
    if (getAllFavorite.length < 0) getAllFavorite = [];
    return getAllFavorite;
};

export const storeOrUpdateFavorite = async (
    favoriteData: Favorite,
    userId: string
): Promise<Favorite | ValidationError[]> => {
    const favorite = new Favorite();
    favorite.id = isEmpty(favoriteData.id) ? undefined : favoriteData.id;
    favorite.userId = userId;
    favorite.completionId = favoriteData.completionId;
    favorite.completionMsg = favoriteData.completionMsg;

    const validateData = await validation(favorite);
    if (validateData.length > 0) return validateData;

    const storeOrUpdateFavorite = await FavoriteRepository.storeOrUpdateFavorite(favorite);

    return storeOrUpdateFavorite;
};

export const deleteFavorite = async (id: string, userId: string): Promise<UpdateResult> => {
    return await FavoriteRepository.deleteFavorite(id, userId);
};
