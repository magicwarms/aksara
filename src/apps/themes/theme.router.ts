/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as ThemeController from "./theme.controller";
/**
 * Router Definition
 */
const themeRouter = express.Router();
/**
 * Controller Definitions
 */

themeRouter.get("/", ThemeController.getAllTheme);
themeRouter.post("/store-update", ThemeController.storeOrUpdateTheme);
themeRouter.delete("/delete", ThemeController.deleteTheme);

export default themeRouter;
