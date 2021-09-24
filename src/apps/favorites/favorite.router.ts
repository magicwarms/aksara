/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as FavoriteController from "./favorite.controller";
/**
 * Router Definition
 */
const favoriteRouter = express.Router();
/**
 * Controller Definitions
 */

favoriteRouter.get("/", FavoriteController.getAllFavorite);
favoriteRouter.post("/store-update", FavoriteController.storeOrUpdateFavorite);
favoriteRouter.delete("/delete", FavoriteController.deleteFavorite);

export default favoriteRouter;
