/**
 * Required External Modules and Interfaces
 */
import express from "express";
import { verifyToken, verifyAdminAccess } from "../middlewares";
import * as UserController from "./user.controller";
/**
 * Router Definition
 */
const userRouter = express.Router();
/**
 * Controller Definitions
 */
userRouter.get("/", [verifyToken, verifyAdminAccess], UserController.getAllUser);
userRouter.get("/user-profile", [verifyToken], UserController.getUserProfile);
userRouter.put("/update-profile", [verifyToken], UserController.updateUserProfile);
// userRouter.delete("/delete", [verifyToken], UserController.deleteUser);
userRouter.post("/register-login", UserController.loginOrRegisterCustomer);
userRouter.get("/logout", [verifyToken], UserController.logoutUser);

export default userRouter;
